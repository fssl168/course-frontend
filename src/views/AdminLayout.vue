<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo">
          <svg class="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span v-if="!sidebarCollapsed" class="logo-text">院前急救培训平台</span>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <div class="nav-group">
          <div class="nav-group-title">
            <i class="fas fa-chart-line"></i>
            <span v-if="!sidebarCollapsed">工作台</span>
          </div>
          <router-link to="/admin" class="nav-item" exact>
            <i class="fas fa-home"></i>
            <span v-if="!sidebarCollapsed">首页</span>
          </router-link>
        </div>

        <div class="nav-group">
          <div class="nav-group-title">
            <i class="fas fa-user-md"></i>
            <span v-if="!sidebarCollapsed">医护培训管理</span>
          </div>
          <router-link to="/admin/medical/activities" class="nav-item">
            <i class="fas fa-calendar-alt"></i>
            <span v-if="!sidebarCollapsed">活动管理</span>
          </router-link>
          <router-link to="/admin/medical/registrations" class="nav-item">
            <i class="fas fa-clipboard-list"></i>
            <span v-if="!sidebarCollapsed">报名管理</span>
          </router-link>
          <router-link to="/admin/medical/cancellations" class="nav-item">
            <i class="fas fa-times-circle"></i>
            <span v-if="!sidebarCollapsed">取消管理</span>
          </router-link>
          <router-link to="/admin/medical/adjustments" class="nav-item">
            <i class="fas fa-exchange-alt"></i>
            <span v-if="!sidebarCollapsed">调剂管理</span>
          </router-link>
        </div>

        <div class="nav-group">
          <div class="nav-group-title">
            <i class="fas fa-users"></i>
            <span v-if="!sidebarCollapsed">公共培训管理</span>
          </div>
          <router-link to="/admin/public/activities" class="nav-item">
            <i class="fas fa-calendar-check"></i>
            <span v-if="!sidebarCollapsed">活动管理</span>
          </router-link>
          <router-link to="/admin/public/registrations" class="nav-item">
            <i class="fas fa-user-plus"></i>
            <span v-if="!sidebarCollapsed">报名管理</span>
          </router-link>
        </div>

        <div class="nav-group">
          <div class="nav-group-title">
            <i class="fas fa-cog"></i>
            <span v-if="!sidebarCollapsed">系统管理</span>
          </div>
          <router-link to="/admin/users" class="nav-item">
            <i class="fas fa-user-friends"></i>
            <span v-if="!sidebarCollapsed">用户管理</span>
          </router-link>
          <router-link to="/admin/videos" class="nav-item">
            <i class="fas fa-video"></i>
            <span v-if="!sidebarCollapsed">视频管理</span>
          </router-link>
          <router-link to="/admin/settings" class="nav-item">
            <i class="fas fa-sliders-h"></i>
            <span v-if="!sidebarCollapsed">系统设置</span>
          </router-link>
        </div>
      </nav>
    </aside>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 顶部栏 -->
      <header class="top-bar">
        <div class="top-bar-left">
          <button class="collapse-btn" @click="toggleSidebar">
            <i class="fas fa-bars"></i>
          </button>
          <div class="breadcrumb">
            <router-link to="/admin" class="breadcrumb-item">首页</router-link>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-item-current">{{ currentPageTitle }}</span>
          </div>
        </div>
        <div class="top-bar-right">
          <div class="user-info">
            <div class="avatar">
              <i class="fas fa-user-circle"></i>
            </div>
            <span class="username">{{ currentUser?.name || '管理员' }}</span>
            <button class="logout-btn" @click="logout">
              <i class="fas fa-sign-out-alt"></i>
              <span>退出</span>
            </button>
          </div>
        </div>
      </header>

      <!-- 内容区域 -->
      <div class="content-wrapper">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'AdminLayout',
  data() {
    return {
      sidebarCollapsed: false,
      currentUser: null
    }
  },
  computed: {
    currentPageTitle() {
      const routeMap = {
        '/admin': '首页',
        '/admin/medical/activities': '活动管理',
        '/admin/medical/registrations': '报名管理',
        '/admin/medical/cancellations': '取消管理',
        '/admin/medical/adjustments': '调剂管理',
        '/admin/public/activities': '活动管理',
        '/admin/public/registrations': '报名管理',
        '/admin/users': '用户管理',
        '/admin/videos': '视频管理',
        '/admin/settings': '系统设置'
      }
      return routeMap[this.$route.path] || '管理后台'
    }
  },
  mounted() {
    const user = localStorage.getItem('user')
    if (user) {
      this.currentUser = JSON.parse(user)
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  background: #f0f2f5;
}

/* 侧边栏样式 */
.sidebar {
  width: 256px;
  background: #001529;
  transition: width 0.2s;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
}

.logo-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  white-space: nowrap;
}

.sidebar.collapsed .logo-text {
  display: none;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.nav-group {
  margin-bottom: 16px;
}

.nav-group-title {
  padding: 12px 24px 8px;
  color: rgba(255, 255, 255, 0.45);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-group-title i {
  font-size: 12px;
}

.sidebar.collapsed .nav-group-title {
  text-align: center;
  padding: 12px 8px 8px;
}

.sidebar.collapsed .nav-group-title span {
  display: none;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  transition: all 0.3s;
  cursor: pointer;
}

.nav-item:hover {
  color: white;
  background: rgba(255, 255, 255, 0.08);
}

.nav-item.router-link-active {
  background: #1890ff;
  color: white;
}

.nav-item i {
  width: 16px;
  text-align: center;
  font-size: 16px;
}

.sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 12px 8px;
}

.sidebar.collapsed .nav-item span {
  display: none;
}

/* 主内容区样式 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-bar {
  height: 64px;
  background: white;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 10;
}

.top-bar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.collapse-btn:hover {
  background: #f5f5f5;
}

.collapse-btn i {
  font-size: 18px;
  color: #666;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.breadcrumb-item {
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
}

.breadcrumb-item:hover {
  color: #1890ff;
}

.breadcrumb-separator {
  color: #d9d9d9;
}

.breadcrumb-item-current {
  color: #333;
  font-weight: 500;
}

.top-bar-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar i {
  font-size: 24px;
  color: #1890ff;
}

.username {
  color: #333;
  font-size: 14px;
}

.logout-btn {
  margin-left: 16px;
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
  transition: all 0.3s;
}

.logout-btn:hover {
  color: #ff4d4f;
  border-color: #ff4d4f;
}

.content-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.content-wrapper::-webkit-scrollbar {
  width: 8px;
}

.content-wrapper::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 4px;
}

.content-wrapper::-webkit-scrollbar-track {
  background: #f0f2f5;
}
</style>