<template>
  <div class="home-container">
    <nav class="navbar">
      <div class="navbar-brand">院前培训报名系统</div>
      <div class="navbar-links">
        <span v-if="isLoggedIn">{{ user.username }} - {{ user.organization }}</span>
        <router-link v-if="!isLoggedIn" to="/login">登录</router-link>
        <router-link v-if="!isLoggedIn" to="/register">注册</router-link>
        <router-link v-if="isLoggedIn" to="/my-courses">我的课程</router-link>
        <router-link v-if="isLoggedIn" to="/user-profile">个人信息</router-link>
        <button v-if="!isLoggedIn" @click="wechatLogin" class="btn-wechat">微信登录</button>
        <button v-if="isLoggedIn" @click="logout" class="btn-logout">退出登录</button>
      </div>
    </nav>

    <div class="courses-container">
      <h1>培训课程列表</h1>
      <div class="course-filters">
        <input 
          v-model="searchQuery" 
          @input="handleSearch" 
          type="text" 
          placeholder="搜索课程标题或描述" 
          class="search-input"
        >
        <div class="status-filters">
          <button 
            v-for="status in statusFilters" 
            :key="status.value"
            @click="filterByStatus(status.value)"
            :class="['status-btn', { active: currentStatus === status.value }]"
          >
            {{ status.label }}
          </button>
        </div>
      </div>
      <div class="courses-grid">
        <div v-for="course in courses" :key="course.id" class="course-card">
          <h3>{{ course.title }}</h3>
          <p class="course-description" @click="toggleCourseDetails(course.id)" style="cursor: pointer; user-select: none;">{{ course.description.length > 35 ? course.description.substring(0, 35) + '...' : course.description }}</p>
          <div v-if="course.image" class="course-image-container">
            <img :src="getImageUrl(course.image)" :alt="course.title" class="course-image">
          </div>
          <div class="course-info" @click="toggleCourseDetails(course.id)" style="cursor: pointer; user-select: none;">
            <p><strong>可报名人数：</strong>{{ course.registered >= course.capacity ? '已报满' : course.registered + '/' + course.capacity }}</p>
            <p><strong>报名时间：</strong>{{ course.registration_start }} 至 {{ course.registration_end }}</p>
            <p><strong>上课时间：</strong>{{ course.date }} {{ course.time.split('-')[0] }}:00 至 {{ course.date }} {{ course.time.split('-')[1] }}:00</p>
          </div>
          <!-- 课程详情 -->
          <div v-if="expandedCourses[course.id]" class="course-details">
            <p><strong>课程简介：</strong>{{ course.description }}</p>
            <p><strong>日期：</strong>{{ course.date }}</p>
            <p><strong>时间：</strong>{{ course.time }}</p>
            <p><strong>地点：</strong>{{ course.location }}</p>
            <p><strong>报名状态：</strong>{{ getButtonText(course) }}</p>
            <p><strong>注意事项：</strong>请在报名时间内完成报名，逾期将无法报名。</p>
          </div>
          <button 
            v-if="isLoggedIn" 
            @click="registerCourse(course.id)" 
            class="btn-register"
            :disabled="course.registered >= course.capacity || hasRegistered(course.id) || isCourseEnded(course.class_end) || isCourseNotStarted(course.registration_start)"
          >
            {{ getButtonText(course) }}
          </button>
          <button v-else-if="course.registered < course.capacity && !isCourseEnded(course.class_end) && !isCourseNotStarted(course.registration_start)" @click="$router.push('/login')" class="btn-register">登录报名</button>
          <button v-else-if="isCourseEnded(course.class_end)" class="btn-register" disabled>已结束</button>
          <button v-else-if="isCourseNotStarted(course.registration_start)" class="btn-register" disabled>未开始</button>
          <button v-else class="btn-register" disabled>已报满</button>
        </div>
      </div>
      <!-- 加载状态 -->
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
      <!-- 无更多数据提示 -->
      <div v-else-if="!hasMore && courses.length > 0" class="no-more-container">
        <p>没有更多课程了</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/axios'

export default {
  name: 'Home',
  data() {
    return {
      courses: [],
      user: null,
      isLoggedIn: false,
      registeredCourses: [], // 存储用户已报名的课程ID
      searchQuery: '',
      currentStatus: '',
      expandedCourses: {}, // 存储展开的课程ID
      statusFilters: [
        { label: '全部', value: '' },
        { label: '未开始', value: 'upcoming' },
        { label: '进行中', value: 'ongoing' },
        { label: '已结束', value: 'ended' }
      ],
      // 分页相关
      currentPage: 1,
      perPage: 10,
      hasMore: true,
      isLoading: false
    }
  },
  mounted() {
    // 处理微信登录回调
    this.handleWechatCallback()
    this.checkLoginStatus()
    this.fetchCourses(true) // 初始加载第一页课程
    if (this.isLoggedIn) {
      this.fetchUserRegistrations()
    }
    // 添加滚动事件监听器
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    // 移除滚动事件监听器
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleWechatCallback() {
      // 从URL参数中获取token
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('token')
      if (token) {
        // 移除URL中的token参数
        window.history.replaceState({}, document.title, window.location.pathname)
        
        // 存储token并获取用户信息
        localStorage.setItem('token', token)
        this.fetchUserInfo(token)
      }
    },
    async fetchUserInfo(token) {
      try {
        const response = await api.get('/api/user-info')
        const user = response.data
        console.log('获取到的用户信息:', user)
        localStorage.setItem('user', JSON.stringify(user))
        this.user = user
        this.isLoggedIn = true
        this.fetchUserRegistrations()
      } catch (error) {
        console.error('获取用户信息失败:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    },
    checkLoginStatus() {
      const userStr = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      console.log('检查登录状态，用户信息:', userStr ? '存在' : '不存在', 'token:', token ? '存在' : '不存在')
      if (userStr && token) {
        this.user = JSON.parse(userStr)
        console.log('从localStorage获取的用户信息:', this.user)
        console.log('调用API获取报名记录，用户ID:', this.user.id)
        console.log('认证令牌:', token)
        console.log('API URL:', '/api/my-courses')
        this.isLoggedIn = true
      } else {
        // 如果缺少token或用户信息，清除登录状态
        console.log('登录状态不完整，清除登录信息')
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        this.user = null
        this.isLoggedIn = false
      }
    },
    async fetchCourses(reset = false) {
      if (this.isLoading || (!reset && !this.hasMore)) {
        return
      }
      
      this.isLoading = true
      try {
        const params = {
          page: reset ? 1 : this.currentPage,
          per_page: this.perPage
        }
        if (this.searchQuery) {
          params.search = this.searchQuery
        }
        if (this.currentStatus) {
          params.status = this.currentStatus
        }
        const response = await api.get('/api/courses', { params })
        
        if (reset) {
          this.courses = response.data.courses
          this.currentPage = 1
        } else {
          this.courses = [...this.courses, ...response.data.courses]
        }
        
        this.hasMore = response.data.pagination.has_more
        this.currentPage += 1
      } catch (error) {
        console.error('获取课程列表失败:', error)
      } finally {
        this.isLoading = false
      }
    },
    filterByStatus(status) {
      this.currentStatus = status
      this.fetchCourses(true) // 重置分页，重新加载第一页
    },
    handleSearch() {
      this.fetchCourses(true) // 重置分页，重新加载第一页
    },
    handleScroll() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      const clientHeight = document.documentElement.clientHeight || window.innerHeight
      
      // 当滚动到距离底部100px时，加载更多课程
      if (scrollTop + clientHeight >= scrollHeight - 100 && !this.isLoading && this.hasMore) {
        this.fetchCourses()
      }
    },
    async fetchUserRegistrations() {
      if (!this.user || !this.user.id) {
        console.error('用户信息不存在或没有id字段')
        return
      }
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('登录状态已过期，请重新登录')
        return
      }
      try {
        const response = await api.get('/api/my-courses')
        console.log('获取报名记录成功:', response.data)
        // 提取已报名的课程ID
        this.registeredCourses = response.data.map(course => course.id)
      } catch (error) {
        console.error('获取报名记录失败:', error)
      }
    },
    async registerCourse(courseId) {
      if (!this.user || !this.user.id) {
        alert('用户信息不存在，请重新登录')
        return
      }
      const token = localStorage.getItem('token')
      if (!token) {
        alert('登录状态已过期，请重新登录')
        return
      }
      try {
        console.log('调用API报名课程，用户ID:', this.user.id, '课程ID:', courseId)
        const course = this.courses.find(c => c.id === courseId)
        if (!course) {
          console.error('课程不存在:', courseId)
          alert('课程不存在')
          return
        }
        console.log('课程信息:', course)
        if (this.isCourseNotStarted(course.registration_start)) {
          alert('课程未开始，不能报名')
          return
        }
        
        const response = await api.post(`/api/courses/${courseId}/register`, {})
        console.log('报名成功:', response.data)
        alert(response.data.message)
        this.fetchCourses() // 刷新课程列表
        this.fetchUserRegistrations() // 刷新已报名课程列表
      } catch (error) {
        console.error('报名失败:', error)
        if (error.response && error.response.data) {
          alert(error.response.data.message)
        } else {
          alert('报名失败，请稍后重试')
        }
      }
    },
    hasRegistered(courseId) {
      return this.registeredCourses.includes(courseId)
    },
    isCourseEnded(class_end) {
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19)
      return class_end < now
    },
    isCourseNotStarted(registration_start) {
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19)
      return now < registration_start
    },
    getButtonText(course) {
      if (this.isCourseEnded(course.class_end)) {
        return '已结束'
      } else if (this.isCourseNotStarted(course.registration_start)) {
        return '未开始'
      } else if (this.hasRegistered(course.id)) {
        return '已报名'
      } else if (course.registered >= course.capacity) {
        return '已满'
      } else {
        return '报名'
      }
    },
    // 切换课程详情显示/隐藏
    toggleCourseDetails(courseId) {
      console.log('点击了课程信息区域，课程ID:', courseId)
      this.expandedCourses[courseId] = !this.expandedCourses[courseId]
      this.$forceUpdate() // 强制更新视图
      console.log('expandedCourses状态:', this.expandedCourses)
    },
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.user = null
      this.isLoggedIn = false
      this.registeredCourses = []
      this.$router.push('/')
    },
    wechatLogin() {
      // 跳转到微信登录授权页面
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
      window.location.href = `${apiBaseUrl}/api/wechat/auth`
    },
    getImageUrl(imagePath) {
      // 处理课程图片的 URL
      if (!imagePath) return ''
      if (imagePath.startsWith('http')) {
        return imagePath
      }
      // 确保 imagePath 以 / 开头
      const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
      return `${apiBaseUrl}${normalizedPath}`
    }
  }
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #f9f9f9;
}

.navbar {
  background-color: #4CAF50;
  color: white;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  font-size: 24px;
  font-weight: bold;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 20px;
}

.navbar-links a {
  color: white;
  text-decoration: none;
  font-size: 16px;
}

.navbar-links a:hover {
  text-decoration: underline;
}

.btn-logout {
  background-color: transparent;
  color: white;
  border: 1px solid white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-logout:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.btn-wechat {
  background-color: #07C160;
  color: white;
  border: 1px solid #07C160;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-wechat:hover {
  background-color: #06B055;
}

.courses-container {
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 20px;
}

/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #4CAF50;
}

.loading-spinner {
  border: 4px solid rgba(76, 175, 80, 0.3);
  border-radius: 50%;
  border-top: 4px solid #4CAF50;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-more-container {
  text-align: center;
  padding: 40px 0;
  color: #666;
  font-size: 16px;
}

/* H5响应式设计 */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 10px;
    padding: 10px;
  }
  
  .navbar-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }
  
  .courses-container {
    padding: 0 10px;
  }
  
  .course-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    min-width: 100%;
  }
  
  .status-filters {
    justify-content: center;
  }
  
  .courses-grid {
    grid-template-columns: 1fr;
  }
  
  .course-card {
    padding: 15px;
  }
}

.courses-container h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.course-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
}

.search-input {
  flex: 1;
  min-width: 300px;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.status-filters {
  display: flex;
  gap: 5px;
}

.status-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.status-btn:hover {
  background-color: #f0f0f0;
}

.status-btn.active {
  background-color: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.course-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.3s ease;
}

.course-card:hover {
  transform: translateY(-5px);
}

.course-card h3 {
  color: #4CAF50;
  margin-bottom: 10px;
}

.course-description {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
}

.course-info {
  margin-bottom: 20px;
}

.course-info p {
  margin: 5px 0;
  color: #555;
}

.course-details {
  margin: 15px 0;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border-left: 4px solid #4CAF50;
}

.course-details p {
  margin: 8px 0;
  color: #555;
  line-height: 1.4;
}

.course-image-container {
  margin: 10px 0;
  text-align: center;
}

.course-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-register {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.btn-register:hover:not(:disabled) {
  background-color: #45a049;
}

.btn-register:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>