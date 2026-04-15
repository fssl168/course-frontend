<template>
  <div class="training-container">
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

    <div class="page-banner">
      <div class="banner-content">
        <h1>培训报名</h1>
        <p>选择适合您的急救培训课程，提升急救技能</p>
      </div>
    </div>

    <div class="main-content">
      <div class="filter-section">
        <div class="filter-row">
          <div class="filter-item">
            <label>课程状态</label>
            <select v-model="filters.status" @change="loadCourses">
              <option value="">全部状态</option>
              <option value="ongoing">报名中</option>
              <option value="upcoming">即将开始</option>
              <option value="ended">已结束</option>
            </select>
          </div>
          <div class="filter-item">
            <label>搜索课程</label>
            <input type="text" v-model="filters.search" placeholder="搜索课程名称..." @keyup.enter="loadCourses">
          </div>
          <button class="btn-search" @click="loadCourses">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            搜索
          </button>
        </div>
      </div>

      <div class="courses-section">
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <div v-else-if="courses.length === 0" class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" stroke-width="2"/>
            <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5Z" stroke="currentColor" stroke-width="2"/>
          </svg>
          <p>暂无培训课程</p>
        </div>

        <div v-else class="courses-grid">
          <div v-for="course in courses" :key="course.id" class="course-card">
            <div class="course-image">
              <img v-if="course.image" :src="getImageUrl(course.image)" :alt="course.title">
              <div v-else class="course-image-placeholder">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                  <path d="M21 15L16 10L5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="course-status" :class="getCourseStatus(course)">{{ getCourseStatusText(course) }}</span>
            </div>
            <div class="course-content">
              <h3 class="course-title">{{ course.title }}</h3>
              <p class="course-desc" v-if="course.description">{{ truncateText(course.description, 60) }}</p>
              <div class="course-instructors" v-if="course.instructors && course.instructors.length > 0">
                <span class="instructor-label">授课导师：</span>
                <span class="instructor-names">{{ course.instructors.map(i => i.name).join('、') }}</span>
              </div>
              <div class="course-info">
                <div class="info-item">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                    <path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  <span>{{ course.date }}</span>
                </div>
                <div class="info-item">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  <span>{{ course.time }}</span>
                </div>
                <div class="info-item">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <span>{{ course.location }}</span>
                </div>
              </div>
              <div class="course-footer">
                <button @click="viewCourseDetail(course)" class="btn-view">
                  查看详情
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="pagination.total > pagination.per_page" class="pagination">
          <button class="page-btn" :disabled="pagination.page === 1" @click="changePage(pagination.page - 1)">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <span class="page-info">第 {{ pagination.page }} / {{ totalPages }} 页</span>
          <button class="page-btn" :disabled="!pagination.has_more" @click="changePage(pagination.page + 1)">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
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

    <div v-if="showEnrollModal" class="modal-overlay" @click="closeEnrollModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>培训报名</h3>
          <button @click="closeEnrollModal" class="btn-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="selected-course">
            <h4>{{ selectedCourse?.title }}</h4>
            <p>{{ selectedCourse?.date }} {{ selectedCourse?.time }}</p>
            <p>{{ selectedCourse?.location }}</p>
          </div>
          
          <form @submit.prevent="submitEnroll">
            <div class="form-row">
              <div class="form-group">
                <label>姓名 <span class="required">*</span></label>
                <input v-model="enrollForm.name" type="text" required placeholder="请输入姓名">
              </div>
              <div class="form-group">
                <label>身份证号 <span class="required">*</span></label>
                <input v-model="enrollForm.id_card" type="text" required maxlength="18" placeholder="请输入身份证号">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>性别 <span class="required">*</span></label>
                <select v-model="enrollForm.gender" required>
                  <option :value="1">男</option>
                  <option :value="0">女</option>
                </select>
              </div>
              <div class="form-group">
                <label>年龄 <span class="required">*</span></label>
                <input v-model.number="enrollForm.age" type="number" required min="1" max="120" placeholder="请输入年龄">
              </div>
            </div>
            <div class="form-group">
              <label>所属医院 <span class="required">*</span></label>
              <select v-model="enrollForm.hospital" required>
                <option value="">请选择医院</option>
                <option v-for="hospital in hospitals" :key="hospital.hospital_id" :value="hospital.hospital_name">
                  {{ hospital.hospital_name }}
                </option>
              </select>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>职务</label>
                <input v-model="enrollForm.position" type="text" placeholder="请输入职务">
              </div>
              <div class="form-group">
                <label>职称</label>
                <input v-model="enrollForm.title" type="text" placeholder="请输入职称">
              </div>
            </div>
            <div class="form-group">
              <label>手机号码 <span class="required">*</span></label>
              <input v-model="enrollForm.phone" type="tel" required maxlength="11" placeholder="请输入手机号码">
            </div>
            <div class="form-actions">
              <button type="button" @click="closeEnrollModal" class="btn-secondary">取消</button>
              <button type="submit" class="btn-primary" :disabled="submitting">
                {{ submitting ? '提交中...' : '确认报名' }}
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
  name: 'Training',
  data() {
    return {
      isLoggedIn: false,
      user: null,
      loading: false,
      submitting: false,
      courses: [],
      hospitals: [],
      filters: {
        status: '',
        search: ''
      },
      pagination: {
        total: 0,
        page: 1,
        per_page: 12,
        has_more: false
      },
      showEnrollModal: false,
      selectedCourse: null,
      enrollForm: {
        name: '',
        id_card: '',
        gender: 1,
        age: '',
        hospital: '',
        position: '',
        title: '',
        phone: ''
      }
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.pagination.total / this.pagination.per_page)
    }
  },
  mounted() {
    this.checkLoginStatus()
    this.loadCourses()
    this.loadHospitals()
  },
  methods: {
    checkLoginStatus() {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        this.user = JSON.parse(userStr)
        this.isLoggedIn = true
      }
    },
    async loadCourses() {
      this.loading = true
      try {
        const params = {
          page: this.pagination.page,
          per_page: this.pagination.per_page,
          status: this.filters.status,
          search: this.filters.search
        }
        const response = await api.get('/api/courses', { params })
        this.courses = response.data.courses || []
        this.pagination = response.data.pagination || this.pagination
      } catch (error) {
        console.error('加载课程失败:', error)
      } finally {
        this.loading = false
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
    changePage(page) {
      this.pagination.page = page
      this.loadCourses()
    },
    getImageUrl(path) {
      if (!path) return ''
      if (path.startsWith('http')) return path
      return api.defaults.baseURL + path
    },
    getCourseStatus(course) {
      const now = new Date()
      const regStart = new Date(course.registration_start)
      const regEnd = new Date(course.registration_end)
      
      if (now < regStart) return 'status-upcoming'
      if (now > regEnd) return 'status-ended'
      if (course.registered >= course.capacity) return 'status-full'
      return 'status-open'
    },
    getCourseStatusText(course) {
      const now = new Date()
      const regStart = new Date(course.registration_start)
      const regEnd = new Date(course.registration_end)
      
      if (now < regStart) return '即将开始'
      if (now > regEnd) return '已结束'
      if (course.registered >= course.capacity) return '已满员'
      return '进行中'
    },
    truncateText(text, length) {
      if (!text) return ''
      return text.length > length ? text.substring(0, length) + '...' : text
    },
    viewCourseDetail(course) {
      this.$router.push(`/course/${course.id}`)
    },
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.user = null
      this.isLoggedIn = false
    }
  }
}
</script>

<style scoped>
.training-container {
  min-height: 100vh;
  background: #f5f7fa;
}

.header {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 32px;
  height: 32px;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 1px;
}

.nav-menu {
  display: flex;
  gap: 32px;
}

.nav-item {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 15px;
  padding: 8px 0;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.nav-item:hover,
.nav-item.active {
  color: white;
  border-bottom-color: white;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-login {
  padding: 8px 24px;
  background: white;
  color: #1890ff;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-login:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.username {
  font-size: 14px;
}

.btn-logout {
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.3);
}

.page-banner {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  padding: 40px 20px;
  text-align: center;
  color: white;
}

.banner-content h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
}

.banner-content p {
  font-size: 16px;
  opacity: 0.9;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

.filter-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.filter-row {
  display: flex;
  gap: 16px;
  align-items: flex-end;
}

.filter-item {
  flex: 1;
}

.filter-item label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.filter-item select,
.filter-item input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s;
}

.filter-item select:focus,
.filter-item input:focus {
  border-color: #1890ff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.btn-search {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 24px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-search:hover {
  background: #40a9ff;
}

.btn-search svg {
  width: 16px;
  height: 16px;
}

.courses-section {
  min-height: 400px;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #8c8c8c;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f0f0f0;
  border-top-color: #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state svg {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  color: #d9d9d9;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.course-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.course-image {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.course-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.course-image-placeholder svg {
  width: 48px;
  height: 48px;
  color: #bfbfbf;
}

.course-status {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-open {
  background: #52c41a;
  color: white;
}

.status-full {
  background: #ff4d4f;
  color: white;
}

.status-upcoming {
  background: #1890ff;
  color: white;
}

.status-ended {
  background: #8c8c8c;
  color: white;
}

.course-content {
  padding: 20px;
}

.course-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.course-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 16px;
  min-height: 44px;
}

.course-instructors {
  font-size: 13px;
  color: #666;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.instructor-label {
  color: #909399;
}

.instructor-names {
  color: #333;
  font-weight: 500;
}

.course-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.info-item svg {
  width: 16px;
  height: 16px;
  color: #1890ff;
}

.course-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.capacity-info {
  flex: 1;
  margin-right: 16px;
}

.capacity-bar {
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}

.capacity-fill {
  height: 100%;
  background: linear-gradient(90deg, #52c41a 0%, #1890ff 100%);
  transition: width 0.3s;
}

.capacity-text {
  font-size: 12px;
  color: #8c8c8c;
}

.btn-view {
  padding: 10px 24px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
  white-space: nowrap;
  flex: 1;
}

.btn-view:hover {
  background: #40a9ff;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
}

.page-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  border-color: #1890ff;
  color: #1890ff;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn svg {
  width: 16px;
  height: 16px;
}

.page-info {
  font-size: 14px;
  color: #666;
}

.footer {
  background: #001529;
  color: rgba(255, 255, 255, 0.65);
  padding: 40px 20px;
  margin-top: 60px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.footer-info h4 {
  color: white;
  font-size: 18px;
  margin-bottom: 8px;
}

.footer-info p {
  font-size: 14px;
  margin-bottom: 24px;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 24px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: white;
}

.footer-copyright {
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-copyright p {
  font-size: 13px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #1a1a1a;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  line-height: 1;
}

.btn-close:hover {
  color: #666;
}

.modal-body {
  padding: 24px;
}

.selected-course {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.selected-course h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #1a1a1a;
}

.selected-course p {
  margin: 4px 0;
  font-size: 14px;
  color: #666;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.required {
  color: #ff4d4f;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #1890ff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-primary {
  background: #1890ff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #40a9ff;
}

.btn-primary:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;
}

.btn-secondary:hover {
  background: #e8e8e8;
}

@media (max-width: 1024px) {
  .courses-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-wrap: wrap;
    height: auto;
    padding: 12px 20px;
  }
  
  .nav-menu {
    order: 3;
    width: 100%;
    justify-content: center;
    margin-top: 12px;
    gap: 16px;
  }
  
  .filter-row {
    flex-direction: column;
  }
  
  .btn-search {
    width: 100%;
    justify-content: center;
  }
  
  .courses-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
