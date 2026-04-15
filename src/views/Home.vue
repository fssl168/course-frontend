<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
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
          <router-link to="/" class="nav-item active">首页</router-link>
          <router-link to="/training" class="nav-item">课程介绍</router-link>
          <router-link to="/activities" class="nav-item">活动报名</router-link>
          <router-link to="/video" class="nav-item">视频培训</router-link>
          <router-link to="/application" class="nav-item" v-if="isLoggedIn">申请管理</router-link>
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
    
    <!-- 轮播图区域 -->
    <section class="banner-section">
      <div class="banner-carousel" @mouseenter="pauseCarousel" @mouseleave="resumeCarousel">
        <div class="carousel-wrapper">
          <div 
            class="carousel-track" 
            :style="{ transform: 'translateX(-' + currentSlide * 100 + '%)' }"
          >
            <div 
              v-for="(slide, index) in bannerSlides" 
              :key="index" 
              class="carousel-slide"
              :style="{ background: slide.image ? 'url(' + slide.image + ') center/cover no-repeat' : slide.bgColor }"
            >
              <div class="slide-overlay" v-if="slide.image"></div>
              <div class="slide-content">
                <div class="slide-text">
                  <h1 class="slide-title">{{ slide.title }}</h1>
                  <p class="slide-subtitle">{{ slide.subtitle }}</p>
                  <div class="banner-actions">
                    <a :href="slide.primaryLink" class="btn-primary">{{ slide.primaryText }}</a>
                    <a :href="slide.secondaryLink" class="btn-secondary">{{ slide.secondaryText }}</a>
                  </div>
                </div>
                <div class="slide-image" v-if="slide.imageUrl">
                  <img :src="slide.imageUrl" :alt="slide.title">
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 轮播指示器 -->
        <div class="carousel-indicators">
          <button 
            v-for="index in bannerSlides.length" 
            :key="index - 1"
            :class="{ active: currentSlide === index - 1 }"
            @click="currentSlide = index - 1"
          ></button>
        </div>
      </div>
    </section>
    
    <!-- 统计数据 -->
    <section class="stats-section">
      <div class="stats-container">
        <div class="stat-item">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.totalCourses }}</div>
            <div class="stat-label">精品课程</div>
          </div>
        </div>
        
        <div class="stat-item">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.totalRegistrations }}</div>
            <div class="stat-label">累计报名</div>
          </div>
        </div>
        
        <div class="stat-item">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="23 7 16 12 23 17 23 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.totalVideos }}</div>
            <div class="stat-label">培训视频</div>
          </div>
        </div>
        
        <div class="stat-item">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.totalUsers }}</div>
            <div class="stat-label">培训学员</div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 课程展示 -->
    <section class="courses-section">
      <div class="container">
        <div class="section-header">
          <h2>精品课程</h2>
          <p>专业急救技能培训，提升急救能力</p>
        </div>
        
        <div class="course-tabs">
          <button 
            v-for="tab in courseTabs" 
            :key="tab.key"
            :class="{ active: activeCourseTab === tab.key }"
            @click="activeCourseTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>
        
        <div class="courses-grid">
          <div 
            v-for="course in filteredCourses" 
            :key="course.id"
            class="course-card"
            @click="handleEnroll(course)"
          >
            <div class="course-badge" v-if="course.type === 2">医护专属</div>
            <div class="course-thumbnail">
              <img v-if="course.cover_image" :src="course.cover_image" :alt="course.title">
              <div v-else class="thumbnail-placeholder">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            <div class="course-content">
              <h3 class="course-title">{{ course.title }}</h3>
              <p class="course-description">{{ course.description }}</p>
              <div class="course-info">
                <span class="course-date">{{ course.date }}</span>
                <span class="course-time">{{ course.time }}</span>
                <span class="course-location">{{ course.location }}</span>
              </div>
              <div class="course-status">
                <span :class="getActivityStatusClass(course)">{{ getActivityStatusText(course) }}</span>
                <span class="course-capacity">{{ course.registered }}/{{ course.capacity || '不限' }}</span>
              </div>
              <div class="course-progress">
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: getActivityCapacityPercent(course) + '%' }"
                  ></div>
                </div>
              </div>
              <div class="course-action">
                <button 
                  class="btn-primary" 
                  :disabled="!canActivityEnroll(course)"
                >
                  {{ getActivityEnrollText(course) }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 活动展示 -->
    <section class="activities-section">
      <div class="container">
        <div class="section-header">
          <h2>最新活动</h2>
          <p>参与急救培训活动，提升实战能力</p>
        </div>
        
        <div class="activity-tabs">
          <button 
            v-for="tab in activityTabs" 
            :key="tab.key"
            :class="{ active: activeActivityTab === tab.key }"
            @click="activeActivityTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>
        
        <div class="activities-grid">
          <div 
            v-for="activity in filteredActivities" 
            :key="activity.id"
            class="activity-card"
            @click="handleActivityEnroll(activity)"
          >
            <div :class="['activity-badge', getActivityTypeClass(activity.type)]">
              {{ getActivityTypeText(activity.type) }}
            </div>
            <div class="activity-thumbnail">
              <img v-if="activity.cover_image" :src="activity.cover_image" :alt="activity.title">
              <div v-else class="thumbnail-placeholder">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            <div class="activity-content">
              <h3 class="activity-title">{{ activity.title }}</h3>
              <p class="activity-description">{{ activity.description }}</p>
              <div class="activity-info">
                <span class="activity-date">{{ activity.date }}</span>
                <span class="activity-time">{{ activity.time }}</span>
                <span class="activity-location">{{ activity.location }}</span>
              </div>
              <div class="activity-status">
                <span :class="getActivityStatusClass(activity)">{{ getActivityStatusText(activity) }}</span>
                <span class="activity-capacity">{{ activity.registered }}/{{ activity.capacity || '不限' }}</span>
              </div>
              <div class="activity-progress">
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: getActivityCapacityPercent(activity) + '%' }"
                  ></div>
                </div>
              </div>
              <div class="activity-action">
                <button 
                  class="btn-primary" 
                  :disabled="!canActivityEnroll(activity)"
                >
                  {{ getActivityEnrollText(activity) }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 视频培训 -->
    <section class="videos-section">
      <div class="container">
        <div class="section-header">
          <h2>视频培训</h2>
          <p>观看专业急救视频，学习急救技能</p>
        </div>
        
        <div class="videos-grid">
          <div 
            v-for="video in hotVideos" 
            :key="video.id"
            class="video-card"
          >
            <div class="video-thumbnail">
              <img v-if="video.thumbnail" :src="video.thumbnail" :alt="video.title">
              <div v-else class="video-thumbnail-placeholder">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="23 7 16 12 23 17 23 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="video-play-btn">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="5 3 19 12 5 21 5 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="video-duration">{{ video.duration }}</div>
            </div>
            <div class="video-content">
              <h3 class="video-title">{{ video.title }}</h3>
              <div class="video-meta">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>{{ video.views }} 次观看</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-info">
          <h4>院前急救培训平台</h4>
          <p>专业的急救技能培训服务提供商</p>
        </div>
        <div class="footer-links">
          <a href="/about">关于我们</a>
          <a href="/contact">联系我们</a>
          <a href="/privacy">隐私政策</a>
          <a href="/terms">服务条款</a>
        </div>
        <div class="footer-copyright">
          <p>&copy; 2024 院前急救培训平台. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      isLoggedIn: false,
      user: null,
      currentSlide: 0,
      carouselInterval: null,
      isPaused: false,
      activeCourseTab: 'all',
      courseTabs: [
        { key: 'all', label: '全部' },
        { key: 'open', label: '报名中' },
        { key: 'upcoming', label: '即将开始' }
      ],
      activeActivityTab: 'all',
      activityTabs: [
        { key: 'all', label: '全部' },
        { key: 'open', label: '报名中' },
        { key: 'upcoming', label: '即将开始' }
      ],
      defaultBannerSlides: [
        {
          title: '专业急救培训平台',
          subtitle: '提供专业的急救技能培训课程',
          primaryText: '立即报名',
          primaryLink: '/training',
          secondaryText: '了解更多',
          secondaryLink: '/video',
          bgColor: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
          image: ''
        },
        {
          title: '急救技能认证培训',
          subtitle: '通过考核获取专业认证证书',
          primaryText: '查看课程',
          primaryLink: '/training',
          secondaryText: '观看视频',
          secondaryLink: '/video',
          bgColor: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)',
          image: ''
        }
      ],
      bannerSlides: [],
      stats: {
        totalCourses: 128,
        totalRegistrations: 15680,
        totalVideos: 86,
        totalUsers: 8920
      },
      latestCourses: [],
      latestActivities: [],
      hotVideos: [
        { id: 1, title: '心肺复苏(CPR)基础操作', thumbnail: '', duration: '15:30', views: 2356 },
        { id: 2, title: '海姆立克急救法详解', thumbnail: '', duration: '12:45', views: 1893 },
        { id: 3, title: '外伤止血包扎技术', thumbnail: '', duration: '18:20', views: 1567 },
        { id: 4, title: '骨折固定与搬运方法', thumbnail: '', duration: '20:15', views: 1234 }
      ]
    }
  },
  mounted() {
    this.checkLoginStatus()
    this.loadBanners()
    this.loadCourses()
    this.loadActivities()
    this.startCarousel()
  },
  beforeUnmount() {
    this.stopCarousel()
  },
  computed: {
    filteredCourses() {
      if (this.activeCourseTab === 'all') {
        return this.latestCourses
      }
      return this.latestCourses.filter(course => {
        const now = new Date()
        const regStart = new Date(course.registration_start)
        const regEnd = new Date(course.registration_end)
        
        if (this.activeCourseTab === 'open') {
          return now >= regStart && now <= regEnd && course.registered < course.capacity
        } else if (this.activeCourseTab === 'upcoming') {
          return now < regStart
        }
        return true
      })
    },
    filteredActivities() {
      if (this.activeActivityTab === 'all') {
        return this.latestActivities
      }
      return this.latestActivities.filter(activity => {
        const now = new Date()
        const regStart = new Date(activity.registration_start)
        const regEnd = new Date(activity.registration_end)
        
        if (this.activeActivityTab === 'open') {
          return now >= regStart && now <= regEnd && activity.registered < activity.capacity
        } else if (this.activeActivityTab === 'upcoming') {
          return now < regStart
        }
        return true
      })
    }
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')
      if (token && userStr) {
        try {
          this.user = JSON.parse(userStr)
          this.isLoggedIn = true
        } catch (e) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          this.isLoggedIn = false
          this.user = null
        }
      }
    },
    loadBanners() {
      this.bannerSlides = this.defaultBannerSlides
    },
    loadCourses() {
      this.latestCourses = [
        {
          id: 1,
          title: '基础急救技能培训',
          description: '学习基础急救技能，包括心肺复苏、止血、包扎等',
          date: '2024-05-15',
          time: '09:00-17:00',
          location: '急救培训中心',
          capacity: 50,
          registered: 35,
          registration_start: '2024-04-01T00:00:00',
          registration_end: '2024-05-10T23:59:59',
          type: 1
        },
        {
          id: 2,
          title: '高级心肺复苏培训',
          description: '针对医护人员的高级心肺复苏技能培训',
          date: '2024-05-20',
          time: '09:00-17:00',
          location: '医疗中心',
          capacity: 30,
          registered: 25,
          registration_start: '2024-04-01T00:00:00',
          registration_end: '2024-05-15T23:59:59',
          type: 2
        }
      ]
    },
    loadActivities() {
      this.latestActivities = [
        {
          id: 1,
          title: '社区急救知识讲座',
          description: '面向社区居民的急救知识普及讲座',
          date: '2024-05-10',
          time: '14:00-16:00',
          location: '社区中心',
          capacity: 100,
          registered: 80,
          registration_start: '2024-04-01T00:00:00',
          registration_end: '2024-05-08T23:59:59',
          type: 1
        },
        {
          id: 2,
          title: '医护人员急救技能竞赛',
          description: '面向医护人员的急救技能竞赛活动',
          date: '2024-05-25',
          time: '09:00-12:00',
          location: '医疗中心',
          capacity: 50,
          registered: 45,
          registration_start: '2024-04-01T00:00:00',
          registration_end: '2024-05-20T23:59:59',
          type: 2
        }
      ]
    },
    startCarousel() {
      this.carouselInterval = setInterval(() => {
        if (!this.isPaused) {
          this.currentSlide = (this.currentSlide + 1) % this.bannerSlides.length
        }
      }, 5000)
    },
    stopCarousel() {
      if (this.carouselInterval) {
        clearInterval(this.carouselInterval)
      }
    },
    pauseCarousel() {
      this.isPaused = true
    },
    resumeCarousel() {
      this.isPaused = false
    },
    getActivityTypeClass(type) {
      return type === 2 ? 'type-medical' : 'type-public'
    },
    getActivityTypeText(type) {
      return type === 2 ? '医护培训' : '公众活动'
    },
    getActivityStatusClass(activity) {
      const now = new Date()
      const regStart = new Date(activity.registration_start)
      const regEnd = new Date(activity.registration_end)

      if (now < regStart) return 'status-upcoming'
      if (now > regEnd) return 'status-ended'
      if (activity.registered >= activity.capacity) return 'status-full'        
      return 'status-open'
    },
    getActivityStatusText(activity) {
      const now = new Date()
      const regStart = new Date(activity.registration_start)
      const regEnd = new Date(activity.registration_end)

      if (now < regStart) return '即将开始'
      if (now > regEnd) return '已结束'
      if (activity.registered >= activity.capacity) return '已报满'
      return '报名中'
    },
    getActivityCapacityPercent(activity) {
      if (!activity.capacity) return 0
      return Math.min(100, Math.round((activity.registered / activity.capacity) * 100))
    },
    canActivityEnroll(activity) {
      const now = new Date()
      const regStart = new Date(activity.registration_start)
      const regEnd = new Date(activity.registration_end)

      if (now < regStart || now > regEnd) return false
      if (activity.capacity === 0) return true
      return activity.registered < activity.capacity
    },
    getActivityEnrollText(activity) {
      const now = new Date()
      const regStart = new Date(activity.registration_start)
      const regEnd = new Date(activity.registration_end)

      if (now < regStart) return '未开始'
      if (now > regEnd) return '已结束'
      if (activity.capacity > 0 && activity.registered >= activity.capacity) return '已报满'
      return '立即报名'
    },
    handleEnroll(course) {
      if (!this.isLoggedIn) {
        this.$router.push('/login')
        return
      }
      this.$router.push('/course/' + course.id)
    },
    handleActivityEnroll(activity) {
      if (!this.isLoggedIn) {
        this.$router.push('/login')
        return
      }
      this.$router.push('/activity/' + activity.id)
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
.home-container {
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
  color: white;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
}

.nav-menu {
  display: flex;
  gap: 24px;
}

.nav-item {
  color: white;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.2);
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-login {
  color: white;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border: 1px solid white;
  border-radius: 4px;
  transition: all 0.3s;
}

.btn-login:hover {
  background: white;
  color: #1890ff;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.username {
  font-size: 14px;
  font-weight: 500;
}

.btn-logout {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.3);
}

.banner-section {
  position: relative;
  overflow: hidden;
  height: 500px;
}

.banner-carousel {
  position: relative;
  height: 100%;
}

.carousel-wrapper {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  height: 100%;
  transition: transform 0.5s ease;
}

.carousel-slide {
  flex: 0 0 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
}

.slide-content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  width: 100%;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.slide-text {
  flex: 1;
  color: white;
  max-width: 600px;
}

.slide-title {
  font-size: 48px;
  font-weight: 600;
  margin-bottom: 16px;
  line-height: 1.2;
}

.slide-subtitle {
  font-size: 20px;
  margin-bottom: 32px;
  opacity: 0.9;
}

.banner-actions {
  display: flex;
  gap: 16px;
}

.btn-primary {
  background: #1890ff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: #40a9ff;
}

.btn-primary:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid white;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
}

.slide-image {
  flex: 1;
  max-width: 500px;
}

.slide-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.carousel-indicators {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.carousel-indicators button {
  width: 12px;
  height: 12px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s;
}

.carousel-indicators button.active {
  background: white;
  width: 32px;
  border-radius: 6px;
}

.stats-section {
  background: white;
  padding: 60px 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.stats-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
}

.stat-item {
  text-align: center;
  padding: 30px 20px;
  background: #fafafa;
  border-radius: 8px;
  transition: all 0.3s;
}

.stat-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.stat-icon svg {
  width: 32px;
  height: 32px;
  color: white;
}

.stat-number {
  font-size: 36px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-header h2 {
  font-size: 32px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.section-header p {
  font-size: 16px;
  color: #666;
}

.courses-section {
  padding: 60px 0;
  background: #f5f7fa;
}

.course-tabs {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 40px;
}

.course-tabs button {
  padding: 10px 24px;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.course-tabs button:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.course-tabs button.active {
  background: #1890ff;
  border-color: #1890ff;
  color: white;
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
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.course-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #ff4d4f;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  z-index: 1;
}

.course-thumbnail {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.course-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail-placeholder svg {
  width: 48px;
  height: 48px;
  color: #bfbfbf;
}

.course-content {
  padding: 20px;
}

.course-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.course-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.course-info {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 12px;
  color: #999;
}

.course-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
}

.course-status span:first-child {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.status-open {
  background: #f6ffed;
  color: #52c41a;
}

.status-upcoming {
  background: #e6f7ff;
  color: #1890ff;
}

.status-ended {
  background: #f5f5f5;
  color: #999;
}

.status-full {
  background: #fff1f0;
  color: #ff4d4f;
}

.course-capacity {
  font-size: 12px;
  color: #999;
}

.course-progress {
  margin-bottom: 16px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1890ff 0%, #40a9ff 100%);
  border-radius: 3px;
  transition: width 0.3s;
}

.course-action {
  text-align: center;
}

.activities-section {
  padding: 60px 0;
  background: white;
}

.activity-tabs {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 40px;
}

.activity-tabs button {
  padding: 10px 24px;
  background: #f5f7fa;
  border: 1px solid #d9d9d9;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.activity-tabs button:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.activity-tabs button.active {
  background: #1890ff;
  border-color: #1890ff;
  color: white;
}

.activities-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.activity-card {
  background: #f5f7fa;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.activity-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.activity-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  z-index: 1;
}

.type-public {
  background: #1890ff;
  color: white;
}

.type-medical {
  background: #52c41a;
  color: white;
}

.activity-thumbnail {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.activity-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.activity-content {
  padding: 20px;
}

.activity-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.activity-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.activity-info {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 12px;
  color: #999;
}

.activity-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
}

.activity-status span:first-child {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.activity-capacity {
  font-size: 12px;
  color: #999;
}

.activity-progress {
  margin-bottom: 16px;
}

.activity-action {
  text-align: center;
}

.videos-section {
  padding: 60px 0;
  background: #f5f7fa;
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

.video-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #8c8c8c;
}

.video-meta svg {
  width: 14px;
  height: 14px;
}

.footer {
  background: #001529;
  color: rgba(255, 255, 255, 0.65);
  padding: 40px 20px;
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

@media (max-width: 1024px) {
  .courses-grid,
  .videos-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .slide-content {
    flex-direction: column;
    text-align: center;
  }

  .slide-text {
    text-align: center;
  }

  .slide-image {
    max-width: 400px;
  }

  .banner-actions {
    justify-content: center;
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

  .carousel-slide {
    padding: 60px 20px;
  }

  .slide-title {
    font-size: 28px;
  }

  .slide-subtitle {
    font-size: 16px;
    color: #666;
    margin-top: 10px;
  }
}
</style>