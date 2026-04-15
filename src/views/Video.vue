<template>
  <div class="video-container">
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
          <router-link to="/activities" class="nav-item">活动报名</router-link>
          <router-link to="/video" class="nav-item active">视频培训</router-link>
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
        <h1>视频培训</h1>
        <p>随时随地学习急救知识，提升急救技能</p>
      </div>
    </div>

    <div class="main-content">
      <div class="filter-section">
        <div class="filter-row">
          <div class="filter-item">
            <label>视频分类</label>
            <select v-model="filters.category" @change="loadVideos">
              <option value="">全部分类</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div class="filter-item">
            <label>排序方式</label>
            <select v-model="filters.sort" @change="loadVideos">
              <option value="latest">最新发布</option>
              <option value="popular">最多观看</option>
            </select>
          </div>
          <div class="filter-item">
            <label>搜索视频</label>
            <input type="text" v-model="filters.search" placeholder="搜索视频名称..." @keyup.enter="loadVideos">
          </div>
          <button class="btn-search" @click="loadVideos">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            搜索
          </button>
        </div>
      </div>

      <div class="videos-section">
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <div v-else-if="videos.length === 0" class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
            <path d="M10 9L15 12L10 15V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p>暂无培训视频</p>
        </div>

        <div v-else class="videos-grid">
          <div v-for="video in videos" :key="video.id" class="video-card" @click="playVideo(video)">
            <div class="video-thumbnail">
              <img v-if="video.thumbnail" :src="getImageUrl(video.thumbnail)" :alt="video.title">
              <div v-else class="video-thumbnail-placeholder">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M10 9L15 12L10 15V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="video-play-btn">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                </svg>
              </div>
              <span class="video-duration">{{ video.duration || '00:00' }}</span>
              <span v-if="video.category" class="video-category">{{ video.category }}</span>
            </div>
            <div class="video-content">
              <h3 class="video-title">{{ video.title }}</h3>
              <p class="video-desc" v-if="video.description">{{ truncateText(video.description, 50) }}</p>
              <div class="video-meta">
                <span class="meta-item">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  {{ video.views }}次观看
                </span>
                <span class="meta-item">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                    <path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  {{ formatDate(video.created_at) }}
                </span>
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
          <button class="page-btn" :disabled="pagination.page >= totalPages" @click="changePage(pagination.page + 1)">
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

    <div v-if="showVideoModal" class="video-modal" @click="closeVideoModal">
      <div class="video-modal-content" @click.stop>
        <div class="video-modal-header">
          <h3>{{ currentVideo?.title }}</h3>
          <button @click="closeVideoModal" class="btn-close">&times;</button>
        </div>
        <div class="video-player-wrapper">
          <video v-if="currentVideo?.video_url" ref="videoPlayer" controls autoplay class="video-player">
            <source :src="getVideoUrl(currentVideo.video_url)" type="video/mp4">
            您的浏览器不支持视频播放
          </video>
          <div v-else class="video-placeholder">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M10 9L15 12L10 15V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p>暂无视频资源</p>
          </div>
        </div>
        <div class="video-modal-info">
          <div class="info-row">
            <span class="info-label">分类：</span>
            <span class="info-value">{{ currentVideo?.category || '未分类' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">时长：</span>
            <span class="info-value">{{ currentVideo?.duration || '00:00' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">观看：</span>
            <span class="info-value">{{ currentVideo?.views }}次</span>
          </div>
          <div class="info-row" v-if="currentVideo?.description">
            <span class="info-label">简介：</span>
            <span class="info-value">{{ currentVideo.description }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/axios'

export default {
  name: 'Video',
  data() {
    return {
      isLoggedIn: false,
      user: null,
      loading: false,
      videos: [],
      categories: [],
      filters: {
        category: '',
        sort: 'latest',
        search: ''
      },
      pagination: {
        total: 0,
        page: 1,
        per_page: 12,
        total_pages: 0
      },
      showVideoModal: false,
      currentVideo: null
    }
  },
  computed: {
    totalPages() {
      return this.pagination.total_pages || Math.ceil(this.pagination.total / this.pagination.per_page)
    }
  },
  mounted() {
    this.checkLoginStatus()
    this.loadCategories()
    this.loadVideos()
  },
  methods: {
    checkLoginStatus() {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        this.user = JSON.parse(userStr)
        this.isLoggedIn = true
      }
    },
    async loadCategories() {
      try {
        const response = await api.get('/api/video-categories')
        this.categories = response.data.categories || []
      } catch (error) {
        console.error('加载分类失败:', error)
      }
    },
    async loadVideos() {
      this.loading = true
      try {
        const params = {
          page: this.pagination.page,
          per_page: this.pagination.per_page,
          category: this.filters.category,
          sort: this.filters.sort,
          search: this.filters.search
        }
        const response = await api.get('/api/videos', { params })
        this.videos = response.data.videos || []
        this.pagination = {
          total: response.data.total,
          page: response.data.page,
          per_page: response.data.per_page,
          total_pages: response.data.total_pages
        }
      } catch (error) {
        console.error('加载视频失败:', error)
      } finally {
        this.loading = false
      }
    },
    changePage(page) {
      this.pagination.page = page
      this.loadVideos()
    },
    getImageUrl(path) {
      if (!path) return ''
      if (path.startsWith('http')) return path
      return api.defaults.baseURL + path
    },
    getVideoUrl(path) {
      if (!path) return ''
      if (path.startsWith('http')) return path
      return api.defaults.baseURL + path
    },
    truncateText(text, length) {
      if (!text) return ''
      return text.length > length ? text.substring(0, length) + '...' : text
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN')
    },
    playVideo(video) {
      this.currentVideo = video
      this.showVideoModal = true
      document.body.style.overflow = 'hidden'
    },
    closeVideoModal() {
      this.showVideoModal = false
      this.currentVideo = null
      document.body.style.overflow = ''
      if (this.$refs.videoPlayer) {
        this.$refs.videoPlayer.pause()
      }
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
.video-container {
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

.videos-section {
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

.videos-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.video-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s;
}

.video-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.video-thumbnail {
  position: relative;
  width: 100%;
  height: 140px;
  overflow: hidden;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-thumbnail-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-thumbnail-placeholder svg {
  width: 48px;
  height: 48px;
  color: #bfbfbf;
}

.video-play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.video-card:hover .video-play-btn {
  background: rgba(24, 144, 255, 0.9);
  transform: translate(-50%, -50%) scale(1.1);
}

.video-play-btn svg {
  width: 20px;
  height: 20px;
  color: white;
  margin-left: 3px;
}

.video-duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  padding: 2px 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 4px;
  font-size: 12px;
}

.video-category {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 2px 8px;
  background: rgba(24, 144, 255, 0.9);
  color: white;
  border-radius: 4px;
  font-size: 12px;
}

.video-content {
  padding: 16px;
}

.video-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.video-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 12px;
  min-height: 40px;
}

.video-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #8c8c8c;
}

.meta-item svg {
  width: 14px;
  height: 14px;
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

.video-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.video-modal-content {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
}

.video-modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.video-modal-header h3 {
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

.video-player-wrapper {
  position: relative;
  width: 100%;
  background: #000;
}

.video-player {
  width: 100%;
  max-height: 500px;
  display: block;
}

.video-placeholder {
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8c8c8c;
}

.video-placeholder svg {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
}

.video-modal-info {
  padding: 20px;
}

.info-row {
  display: flex;
  margin-bottom: 12px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  width: 60px;
  font-size: 14px;
  color: #8c8c8c;
  flex-shrink: 0;
}

.info-value {
  font-size: 14px;
  color: #1a1a1a;
  flex: 1;
}

@media (max-width: 1024px) {
  .videos-grid {
    grid-template-columns: repeat(3, 1fr);
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
  
  .videos-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .videos-grid {
    grid-template-columns: 1fr;
  }
}
</style>
