<template>
  <div class="activity-container">
    <nav class="navbar">
      <div class="navbar-brand">院前培训报名系统</div>
      <div class="navbar-links">
        <router-link to="/">返回首页</router-link>
        <router-link v-if="!isLoggedIn" to="/login">登录</router-link>
        <router-link v-if="isLoggedIn" to="/my-courses">我的报名</router-link>
        <button v-if="isLoggedIn" @click="logout" class="btn-logout">退出登录</button>
      </div>
    </nav>

    <div class="activity-content">
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <div v-else-if="activity" class="activity-detail">
        <div class="activity-header">
          <img v-if="activity.activity_cover" :src="activity.activity_cover" :alt="activity.activity_name" class="activity-cover">
          <div class="activity-info">
            <h1>{{ activity.activity_name }}</h1>
            <p class="activity-description">{{ activity.activity_description }}</p>
            <div class="activity-stats">
              <span>累计报名: {{ activity.total_registrations }}人</span>
              <span>状态: {{ getStatusText(activity.activity_status) }}</span>
            </div>
          </div>
        </div>

        <div class="courses-section">
          <h2>课程列表</h2>
          <div class="courses-list">
            <div v-for="course in courses" :key="course.course_id" class="course-item">
              <div class="course-header" @click="toggleCourse(course.course_id)">
                <div class="course-main-info">
                  <h3>{{ course.title }}</h3>
                  <span :class="['status-badge', getCourseStatusClass(course)]">
                    {{ getCourseStatusText(course) }}
                  </span>
                </div>
                <div class="course-basic-info">
                  <span><i class="icon-location"></i> {{ course.location }}</span>
                  <span><i class="icon-time"></i> {{ course.date }} {{ course.time }}</span>
                  <span><i class="icon-users"></i> {{ course.registered }}/{{ course.capacity }}</span>
                </div>
              </div>

              <div v-if="expandedCourses.includes(course.course_id)" class="course-details">
                <div class="detail-row">
                  <label>授课形式:</label>
                  <span>{{ course.teaching_form || '线下培训' }}</span>
                </div>
                <div class="detail-row">
                  <label>报名时间:</label>
                  <span>{{ course.registration_start }} 至 {{ course.registration_end }}</span>
                </div>
                <div class="detail-row">
                  <label>上课时间:</label>
                  <span>{{ course.date }} {{ course.time.split('-')[0] }}:00 至 {{ course.date }} {{ course.time.split('-')[1] }}:00</span>
                </div>
                <div class="detail-row">
                  <label>上课地点:</label>
                  <span>{{ course.location }}</span>
                </div>
                <div class="detail-row">
                  <label>报名情况:</label>
                  <span>{{ course.registered >= course.capacity ? '已报满' : course.registered + '/' + course.capacity }}</span>
                </div>

                <div class="course-actions">
                  <button 
                    v-if="isLoggedIn && canRegister(course)"
                    @click="showRegisterForm(course)"
                    class="btn-register"
                  >
                    立即报名
                  </button>
                  <button 
                    v-else-if="!isLoggedIn && canRegister(course)"
                    @click="$router.push('/login')"
                    class="btn-login"
                  >
                    登录报名
                  </button>
                  <button v-else-if="course.registered >= course.capacity" class="btn-disabled" disabled>
                    已报满
                  </button>
                  <button v-else-if="!isRegistrationOpen(course)" class="btn-disabled" disabled>
                    {{ isRegistrationNotStarted(course) ? '报名未开始' : '报名已结束' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="error-container">
        <p>活动不存在或已结束</p>
        <router-link to="/">返回首页</router-link>
      </div>
    </div>

    <!-- 报名表单弹窗 -->
    <div v-if="showRegisterModal" class="modal-overlay" @click="closeRegisterForm">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>报名信息填写</h3>
          <button @click="closeRegisterForm" class="btn-close">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitRegistration">
            <div class="form-group">
              <label>姓名 <span class="required">*</span></label>
              <input v-model="registerForm.name" type="text" required placeholder="请输入姓名">
            </div>
            <div class="form-group">
              <label>身份证号 <span class="required">*</span></label>
              <input v-model="registerForm.id_card" type="text" required placeholder="请输入身份证号" maxlength="18">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>性别 <span class="required">*</span></label>
                <select v-model="registerForm.gender" required>
                  <option :value="1">男</option>
                  <option :value="0">女</option>
                </select>
              </div>
              <div class="form-group">
                <label>年龄 <span class="required">*</span></label>
                <input v-model.number="registerForm.age" type="number" required min="1" max="120" placeholder="年龄">
              </div>
            </div>
            <div class="form-group">
              <label>所属医院 <span class="required">*</span></label>
              <select v-model="registerForm.hospital" required>
                <option value="">请选择医院</option>
                <option v-for="hospital in hospitals" :key="hospital.hospital_id" :value="hospital.hospital_name">
                  {{ hospital.hospital_name }}
                </option>
              </select>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>职务 <span class="required">*</span></label>
                <input v-model="registerForm.position" type="text" required placeholder="职务">
              </div>
              <div class="form-group">
                <label>职称 <span class="required">*</span></label>
                <input v-model="registerForm.title" type="text" required placeholder="职称">
              </div>
            </div>
            <div class="form-group">
              <label>手机号码 <span class="required">*</span></label>
              <input v-model="registerForm.phone" type="tel" required placeholder="手机号码" maxlength="11">
            </div>
            <div class="form-actions">
              <button type="button" @click="closeRegisterForm" class="btn-cancel">取消</button>
              <button type="submit" class="btn-submit" :disabled="isSubmitting">
                {{ isSubmitting ? '提交中...' : '提交报名' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/axios'

export default {
  name: 'ActivityDetail',
  data() {
    return {
      activity: null,
      courses: [],
      isLoading: true,
      isLoggedIn: false,
      expandedCourses: [],
      showRegisterModal: false,
      selectedCourse: null,
      hospitals: [],
      registerForm: {
        name: '',
        id_card: '',
        gender: 1,
        age: '',
        hospital: '',
        position: '',
        title: '',
        phone: ''
      },
      isSubmitting: false
    }
  },
  mounted() {
    this.checkLoginStatus()
    this.loadActivity()
    this.loadHospitals()
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('token')
      this.isLoggedIn = !!token
    },
    async loadActivity() {
      try {
        const activityId = this.$route.params.id
        const response = await api.get(`/api/activities/${activityId}`)
        this.activity = response.data
        this.courses = response.data.courses || []
      } catch (error) {
        console.error('加载活动失败:', error)
        this.activity = null
      } finally {
        this.isLoading = false
      }
    },
    async loadHospitals() {
      try {
        const response = await api.get('/api/hospitals')
        this.hospitals = response.data.hospitals || []
      } catch (error) {
        console.error('加载医院列表失败:', error)
      }
    },
    toggleCourse(courseId) {
      const index = this.expandedCourses.indexOf(courseId)
      if (index > -1) {
        this.expandedCourses.splice(index, 1)
      } else {
        this.expandedCourses.push(courseId)
      }
    },
    getStatusText(status) {
      const statusMap = {
        0: '未开始',
        1: '进行中',
        2: '已结束'
      }
      return statusMap[status] || '未知'
    },
    getCourseStatusClass(course) {
      if (this.isRegistrationNotStarted(course)) return 'status-not-started'
      if (this.isRegistrationEnded(course)) return 'status-ended'
      if (course.registered >= course.capacity) return 'status-full'
      return 'status-open'
    },
    getCourseStatusText(course) {
      if (this.isRegistrationNotStarted(course)) return '报名未开始'
      if (this.isRegistrationEnded(course)) return '报名已结束'
      if (course.registered >= course.capacity) return '已报满'
      return '报名中'
    },
    canRegister(course) {
      return this.isRegistrationOpen(course) && course.registered < course.capacity
    },
    isRegistrationOpen(course) {
      const now = new Date()
      const start = new Date(course.registration_start)
      const end = new Date(course.registration_end)
      return now >= start && now <= end
    },
    isRegistrationNotStarted(course) {
      const now = new Date()
      const start = new Date(course.registration_start)
      return now < start
    },
    isRegistrationEnded(course) {
      const now = new Date()
      const end = new Date(course.registration_end)
      return now > end
    },
    showRegisterForm(course) {
      this.selectedCourse = course
      this.showRegisterModal = true
    },
    closeRegisterForm() {
      this.showRegisterModal = false
      this.selectedCourse = null
      this.registerForm = {
        name: '',
        id_card: '',
        gender: 1,
        age: '',
        hospital: '',
        position: '',
        title: '',
        phone: ''
      }
    },
    async submitRegistration() {
      if (!this.selectedCourse) return
      
      this.isSubmitting = true
      try {
        await api.post(`/api/courses/${this.selectedCourse.course_id}/register`, this.registerForm)
        alert('报名成功！')
        this.closeRegisterForm()
        this.loadActivity()
      } catch (error) {
        const message = error.response?.data?.message || '报名失败，请重试'
        alert(message)
      } finally {
        this.isSubmitting = false
      }
    },
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.isLoggedIn = false
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.activity-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.navbar-links a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.3s;
}

.navbar-links a:hover {
  background: rgba(255,255,255,0.2);
}

.btn-logout {
  background: rgba(255,255,255,0.2);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-logout:hover {
  background: rgba(255,255,255,0.3);
}

.activity-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.activity-detail {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.activity-header {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  border-bottom: 1px solid #eee;
}

.activity-cover {
  width: 300px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.activity-info {
  flex: 1;
}

.activity-info h1 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.8rem;
}

.activity-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.activity-stats {
  display: flex;
  gap: 2rem;
  color: #888;
  font-size: 0.9rem;
}

.courses-section {
  padding: 2rem;
}

.courses-section h2 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.5rem;
}

.courses-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.course-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s;
}

.course-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.course-header {
  padding: 1.5rem;
  cursor: pointer;
  background: #fafafa;
}

.course-main-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.course-main-info h3 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-open {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-full {
  background: #ffebee;
  color: #c62828;
}

.status-ended {
  background: #f5f5f5;
  color: #757575;
}

.status-not-started {
  background: #fff3e0;
  color: #ef6c00;
}

.course-basic-info {
  display: flex;
  gap: 1.5rem;
  color: #666;
  font-size: 0.9rem;
}

.course-details {
  padding: 1.5rem;
  background: white;
  border-top: 1px solid #e0e0e0;
}

.detail-row {
  display: flex;
  margin-bottom: 0.75rem;
}

.detail-row label {
  width: 100px;
  color: #888;
  font-weight: 500;
}

.detail-row span {
  flex: 1;
  color: #333;
}

.course-actions {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
}

.btn-register, .btn-login {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-register {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-register:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-login {
  background: #4caf50;
  color: white;
}

.btn-login:hover {
  background: #45a049;
}

.btn-disabled {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  background: #e0e0e0;
  color: #9e9e9e;
  cursor: not-allowed;
}

.loading-container {
  text-align: center;
  padding: 3rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.error-container a {
  color: #667eea;
  text-decoration: none;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.required {
  color: #f44336;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-cancel, .btn-submit {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .activity-header {
    flex-direction: column;
  }
  
  .activity-cover {
    width: 100%;
    height: 200px;
  }
  
  .course-basic-info {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
