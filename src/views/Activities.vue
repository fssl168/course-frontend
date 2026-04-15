<template>
  <div class="activities-container">
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
          <router-link to="/training" class="nav-item">课程介绍</router-link>
          <router-link to="/activities" class="nav-item active">活动报名</router-link>
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
        <h1>活动中心</h1>
        <p>参与急救培训活动，提升急救技能</p>
      </div>
    </div>

    <div class="main-content">
      <div class="filter-section">
        <div class="filter-row">
          <div class="filter-item">
            <label>活动状态</label>
            <select v-model="filters.status" @change="loadActivities">
              <option value="">全部状态</option>
              <option value="ongoing">报名中</option>
              <option value="upcoming">即将开始</option>
              <option value="ended">已结束</option>
            </select>
          </div>
          <div class="filter-item">
            <label>活动类型</label>
            <select v-model="filters.type" @change="loadActivities">
              <option value="">全部类型</option>
              <option value="1">公众活动</option>
              <option value="2">医护培训</option>
            </select>
          </div>
          <button class="btn-search" @click="loadActivities">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            搜索
          </button>
        </div>
      </div>

      <div class="activities-section">
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <div v-else-if="activities.length === 0" class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" stroke-width="2"/>
            <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5Z" stroke="currentColor" stroke-width="2"/>
          </svg>
          <p>暂无活动信息</p>
        </div>

        <div v-else class="activities-grid">
          <div v-for="activity in activities" :key="activity.id" class="activity-card">
            <div class="activity-header">
              <span class="activity-type" :class="getTypeClass(activity.type)">
                {{ getTypeText(activity.type) }}
              </span>
              <span class="activity-status" :class="getStatusClass(activity)">
                {{ getStatusText(activity) }}
              </span>
            </div>
            <div class="activity-content">
              <h3 class="activity-title">{{ activity.title }}</h3>
              <p class="activity-desc" v-if="activity.description">{{ truncateText(activity.description, 80) }}</p>
              <div class="activity-info">
                <div class="info-item">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                    <path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  <span>{{ activity.date }}</span>
                </div>
                <div class="info-item">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  <span>{{ activity.time }}</span>
                </div>
                <div class="info-item">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <span>{{ activity.location }}</span>
                </div>
              </div>
              <div class="activity-footer">
                <div class="capacity-info" v-if="activity.capacity > 0">
                  <div class="capacity-bar">
                    <div class="capacity-fill" :style="{ width: getCapacityPercent(activity) + '%' }"></div>
                  </div>
                  <span class="capacity-text">{{ activity.registered }}/{{ activity.capacity }}人</span>
                </div>
                <div class="capacity-info" v-else>
                  <span class="capacity-text">不限人数</span>
                </div>
                <button @click="handleRegister(activity)" class="btn-register" :disabled="!canRegister(activity)">
                  {{ getRegisterText(activity) }}
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
  </div>
</template>

<script>
import api from '../api/axios'

export default {
  name: 'Activities',
  data() {
    return {
      isLoggedIn: false,
      user: null,
      loading: false,
      activities: [],
      filters: {
        status: '',
        type: ''
      },
      pagination: {
        total: 0,
        page: 1,
        per_page: 12,
        has_more: false
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
    this.loadActivities()
  },
  methods: {
    checkLoginStatus() {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        this.user = JSON.parse(userStr)
        this.isLoggedIn = true
      }
    },
    async loadActivities() {
      this.loading = true
      try {
        const params = {
          page: this.pagination.page,
          per_page: this.pagination.per_page,
          status: this.filters.status,
          type: this.filters.type
        }
        const response = await api.get('/api/activities', { params })
        this.activities = response.data.activities || []
        this.pagination.total = response.data.total || 0
        this.pagination.has_more = this.pagination.page < Math.ceil(this.pagination.total / this.pagination.per_page)
      } catch (error) {
        console.error('加载活动失败:', error)
      } finally {
        this.loading = false
      }
    },
    changePage(page) {
      this.pagination.page = page
      this.loadActivities()
    },
    truncateText(text, maxLength) {
      if (!text) return ''
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
    },
    getTypeClass(type) {
      return type === 2 ? 'type-medical' : 'type-public'
    },
    getTypeText(type) {
      return type === 2 ? '医护培训' : '公众活动'
    },
    getStatusClass(activity) {
      const now = new Date()
      const regStart = new Date(activity.registration_start)
      const regEnd = new Date(activity.registration_end)
      
      if (now < regStart) return 'status-upcoming'
      if (now > regEnd) return 'status-ended'
      if (activity.capacity > 0 && activity.registered >= activity.capacity) return 'status-full'
      return 'status-open'
    },
    getStatusText(activity) {
      const now = new Date()
      const regStart = new Date(activity.registration_start)
      const regEnd = new Date(activity.registration_end)
      
      if (now < regStart) return '即将开始'
      if (now > regEnd) return '已结束'
      if (activity.capacity > 0 && activity.registered >= activity.capacity) return '已报满'
      return '报名中'
    },
    getCapacityPercent(activity) {
      if (!activity.capacity || activity.capacity === 0) return 0
      return Math.min(100, Math.round((activity.registered / activity.capacity) * 100))
    },
    canRegister(activity) {
      const now = new Date()
      const regStart = new Date(activity.registration_start)
      const regEnd = new Date(activity.registration_end)
      
      if (now < regStart || now > regEnd) return false
      if (activity.capacity === 0) return true
      return activity.registered < activity.capacity
    },
    getRegisterText(activity) {
      const now = new Date()
      const regStart = new Date(activity.registration_start)
      const regEnd = new Date(activity.registration_end)
      
      if (now < regStart) return '未开始'
      if (now > regEnd) return '已结束'
      if (activity.capacity > 0 && activity.registered >= activity.capacity) return '已报满'
      return '立即报名'
    },
    handleRegister(activity) {
      if (!this.isLoggedIn) {
        this.$router.push('/login')
        return
      }
      this.$router.push(`/activity/${activity.id}`)
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
.activities-container {
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

.page-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 20px;
  text-align: center;
}

.banner-content h1 {
  font-size: 36px;
  margin-bottom: 15px;
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
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 25px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.filter-row {
  display: flex;
  gap: 20px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-item label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.filter-item select {
  padding: 10px 15px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 14px;
  min-width: 150px;
  background: white;
  cursor: pointer;
}

.btn-search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.btn-search:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-search svg {
  width: 16px;
  height: 16px;
}

.activities-section {
  min-height: 400px;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #909399;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state svg {
  width: 60px;
  height: 60px;
  margin-bottom: 15px;
  opacity: 0.5;
}

.activities-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.activity-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}

.activity-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.activity-header {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.activity-type {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 500;
}

.type-public {
  background: #e6f7ff;
  color: #1890ff;
}

.type-medical {
  background: #f6ffed;
  color: #52c41a;
}

.activity-status {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 500;
}

.status-open {
  background: #e6f7ff;
  color: #1890ff;
}

.status-upcoming {
  background: #fff7e6;
  color: #fa8c16;
}

.status-ended {
  background: #f5f5f5;
  color: #8c8c8c;
}

.status-full {
  background: #fff1f0;
  color: #f5222d;
}

.activity-content {
  padding: 20px;
}

.activity-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.activity-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.activity-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #666;
}

.info-item svg {
  width: 16px;
  height: 16px;
  color: #909399;
}

.activity-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.capacity-info {
  flex: 1;
  margin-right: 15px;
}

.capacity-bar {
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 5px;
}

.capacity-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 3px;
  transition: width 0.3s;
}

.capacity-text {
  font-size: 12px;
  color: #909399;
}

.btn-register {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: transform 0.3s, box-shadow 0.3s;
}

.btn-register:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-register:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
}

.page-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #dcdfe6;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn svg {
  width: 18px;
  height: 18px;
}

.page-info {
  font-size: 14px;
  color: #606266;
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
  
  .filter-row {
    flex-direction: column;
  }
  
  .filter-item {
    width: 100%;
  }
  
  .filter-item select {
    width: 100%;
  }
  
  .btn-search {
    width: 100%;
    justify-content: center;
  }
  
  .activities-grid {
    grid-template-columns: 1fr;
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
