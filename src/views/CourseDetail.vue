<template>
  <div class="course-detail-container">
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <svg class="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="logo-text">院前急救培训平台</span>
        </div>
        
        <nav class="nav-menu">
          <router-link to="/" class="nav-item">首页</router-link>
          <router-link to="/training" class="nav-item active">课程介绍</router-link>
          <router-link to="/activities" class="nav-item">活动报名</router-link>
          <router-link to="/video" class="nav-item">视频培训</router-link>
          <router-link to="/my-courses" class="nav-item" v-if="isLoggedIn">我的学习</router-link>
        </nav>
        
        <div class="user-actions">
          <router-link v-if="!isLoggedIn" to="/login" class="btn-login">登录</router-link>
          <div v-else class="user-info">
            <span class="username">{{ user?.username }}</span>
            <button @click="logout" class="btn-logout">退出</button>
          </div>
        </div>
      </div>
    </header>

    <div class="main-content" v-if="course">
      <div class="course-header">
        <div class="course-cover">
          <img v-if="course.image" :src="course.image" :alt="course.title">
          <div v-else class="course-cover-placeholder">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
              <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
              <path d="M21 15L16 10L5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div class="course-info">
          <h1 class="course-title">{{ course.title }}</h1>
          <div class="course-meta">
            <span class="meta-item">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
              </svg>
              {{ course.location || '待定' }}
            </span>
            <span class="meta-item">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              {{ course.date || '待定' }}
            </span>
            <span class="meta-item">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              {{ course.time || '待定' }}
            </span>
          </div>
        </div>
      </div>

      <div class="course-body">
        <div class="section">
          <h2 class="section-title">课程介绍</h2>
          <div class="section-content">
            <p v-if="course.description">{{ course.description }}</p>
            <p v-else class="empty-text">暂无课程介绍</p>
          </div>
        </div>

        <div class="section" v-if="course.content">
          <h2 class="section-title">课程内容</h2>
          <div class="section-content" v-html="course.content"></div>
        </div>

        <div class="section" v-if="course.target_audience">
          <h2 class="section-title">适用人群</h2>
          <div class="section-content">
            <p>{{ course.target_audience }}</p>
          </div>
        </div>

        <div class="section" v-if="course.requirements">
          <h2 class="section-title">课程要求</h2>
          <div class="section-content">
            <p>{{ course.requirements }}</p>
          </div>
        </div>

        <div class="section" v-if="course.instructors && course.instructors.length > 0">
          <h2 class="section-title">授课导师</h2>
          <div class="instructors-list">
            <div v-for="instructor in course.instructors" :key="instructor.id" class="instructor-item">
              <div class="instructor-avatar">
                <img v-if="instructor.avatar" :src="instructor.avatar" :alt="instructor.name">
                <div v-else class="avatar-placeholder">{{ instructor.name.charAt(0) }}</div>
              </div>
              <div class="instructor-info">
                <h4 class="instructor-name">{{ instructor.name }}</h4>
                <p class="instructor-title" v-if="instructor.title">{{ instructor.title }}</p>
                <p class="instructor-bio" v-if="instructor.bio">{{ instructor.bio }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="course-actions">
        <router-link to="/activities" class="btn-primary">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" stroke-width="2"/>
            <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5Z" stroke="currentColor" stroke-width="2"/>
          </svg>
          前往活动报名
        </router-link>
        <router-link to="/training" class="btn-secondary">
          返回课程列表
        </router-link>
      </div>
    </div>

    <div class="loading-state" v-else-if="loading">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <div class="error-state" v-else>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <p>课程不存在或已下架</p>
      <router-link to="/training" class="btn-back">返回课程列表</router-link>
    </div>

    <footer class="footer">
      <div class="footer-content">
        <div class="footer-info">
          <h4>院前急救培训平台</h4>
          <p>为您提供专业的急救知识培训服务</p>
        </div>
        <div class="footer-links">
          <a href="#">关于我们</a>
          <a href="#">联系方式</a>
          <a href="#">帮助中心</a>
          <a href="#">隐私政策</a>
        </div>
        <div class="footer-copyright">
          <p>© 2026 院前急救培训平台 版权所有</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import api from '../api/axios'

export default {
  name: 'CourseDetail',
  data() {
    return {
      isLoggedIn: false,
      user: null,
      loading: true,
      course: null
    }
  },
  mounted() {
    this.checkLoginStatus()
    this.loadCourseDetail()
  },
  methods: {
    checkLoginStatus() {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        this.user = JSON.parse(userStr)
        this.isLoggedIn = true
      }
    },
    async loadCourseDetail() {
      const courseId = this.$route.params.id
      if (!courseId) {
        this.loading = false
        return
      }
      
      this.loading = true
      try {
        const response = await api.get(`/api/courses/${courseId}`)
        this.course = response.data.course || response.data
      } catch (error) {
        console.error('加载课程详情失败:', error)
        this.course = null
      } finally {
        this.loading = false
      }
    },
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.isLoggedIn = false
      this.user = null
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.course-detail-container {
  min-height: 100vh;
  background: #f5f7fa;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: white;
}

.logo-icon {
  width: 32px;
  height: 32px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
}

.nav-menu {
  display: flex;
  gap: 30px;
}

.nav-item {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 15px;
  transition: color 0.3s;
}

.nav-item:hover,
.nav-item.active {
  color: white;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.btn-login {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  text-decoration: none;
  font-size: 14px;
  transition: background 0.3s;
}

.btn-login:hover {
  background: rgba(255, 255, 255, 0.3);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.username {
  font-size: 14px;
}

.btn-logout {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 6px 15px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.3s;
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.3);
}

.main-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px;
}

.course-header {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

.course-cover {
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.course-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-cover-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.course-cover-placeholder svg {
  width: 80px;
  height: 80px;
  color: rgba(255, 255, 255, 0.5);
}

.course-info {
  padding: 24px;
}

.course-title {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.course-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.meta-item svg {
  width: 16px;
  height: 16px;
  color: #909399;
}

.course-body {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

.section {
  margin-bottom: 32px;
}

.section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.section-content {
  font-size: 15px;
  color: #333;
  line-height: 1.8;
}

.section-content p {
  margin-bottom: 12px;
}

.section-content p:last-child {
  margin-bottom: 0;
}

.empty-text {
  color: #909399;
  font-style: italic;
}

.instructors-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.instructor-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  transition: all 0.3s;
}

.instructor-item:hover {
  background: #f0f2f5;
}

.instructor-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.instructor-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: 600;
}

.instructor-info {
  flex: 1;
}

.instructor-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.instructor-title {
  font-size: 13px;
  color: #409eff;
  margin-bottom: 8px;
}

.instructor-bio {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

.course-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 14px 32px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  transition: transform 0.3s, box-shadow 0.3s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary svg {
  width: 18px;
  height: 18px;
}

.btn-secondary {
  background: white;
  color: #666;
  padding: 14px 32px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 16px;
  border: 1px solid #d9d9d9;
  transition: all 0.3s;
}

.btn-secondary:hover {
  border-color: #667eea;
  color: #667eea;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state svg {
  width: 60px;
  height: 60px;
  color: #909399;
  margin-bottom: 16px;
}

.error-state p {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}

.btn-back {
  background: #667eea;
  color: white;
  padding: 10px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  transition: background 0.3s;
}

.btn-back:hover {
  background: #5a6fd6;
}

.footer {
  background: #2c3e50;
  color: white;
  padding: 40px 20px;
  margin-top: 60px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.footer-info h4 {
  font-size: 18px;
  margin-bottom: 10px;
}

.footer-info p {
  font-size: 14px;
  opacity: 0.8;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: white;
}

.footer-copyright {
  text-align: right;
}

.footer-copyright p {
  font-size: 13px;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
  
  .course-cover {
    height: 200px;
  }
  
  .course-title {
    font-size: 22px;
  }
  
  .course-meta {
    flex-direction: column;
    gap: 12px;
  }
  
  .course-actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .footer-copyright {
    text-align: center;
  }
}
</style>
