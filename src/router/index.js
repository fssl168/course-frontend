import { createRouter, createWebHistory } from 'vue-router'
import { reportPageView } from '../api/axios'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Training from '../views/Training.vue'
import Activities from '../views/Activities.vue'
import Video from '../views/Video.vue'
import MyCourses from '../views/MyCourses.vue'
import UserProfile from '../views/UserProfile.vue'
import ActivityDetail from '../views/ActivityDetail.vue'
import CourseDetail from '../views/CourseDetail.vue'
import Application from '../views/Application.vue'
import AdminLayout from '../views/AdminLayout.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import AdminRegistrations from '../views/AdminRegistrations.vue'
import AdminActivities from '../views/AdminActivities.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/training',
    name: 'Training',
    component: Training
  },
  {
    path: '/course/:id',
    name: 'CourseDetail',
    component: CourseDetail
  },
  {
    path: '/activities',
    name: 'Activities',
    component: Activities
  },
  {
    path: '/video',
    name: 'Video',
    component: Video
  },
  {
    path: '/my-courses',
    name: 'MyCourses',
    component: MyCourses
  },
  {
    path: '/user-profile',
    name: 'UserProfile',
    component: UserProfile
  },
  {
    path: '/activity/:id',
    name: 'ActivityDetail',
    component: ActivityDetail
  },
  {
    path: '/application',
    name: 'Application',
    component: Application
  },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: AdminDashboard
      },
      {
        path: 'medical/registrations',
        name: 'AdminRegistrations',
        component: AdminRegistrations
      },
      {
        path: 'medical/activities',
        name: 'AdminActivities',
        component: AdminActivities
      },
      {
        path: 'medical/cancellations',
        name: 'AdminCancellations',
        component: () => import('../views/AdminCancellations.vue')
      },
      {
        path: 'medical/adjustments',
        name: 'AdminAdjustments',
        component: () => import('../views/AdminAdjustments.vue')
      },
      {
        path: 'public/activities',
        name: 'AdminPublicActivities',
        component: () => import('../views/AdminPublicActivities.vue')
      },
      {
        path: 'public/registrations',
        name: 'AdminPublicRegistrations',
        component: () => import('../views/AdminPublicRegistrations.vue')
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('../views/AdminUsers.vue')
      },
      {
        path: 'videos',
        name: 'AdminVideos',
        component: () => import('../views/AdminVideos.vue')
      },
      {
        path: 'settings',
        name: 'AdminSettings',
        component: () => import('../views/AdminSettings.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 检查是否是管理后台路由
  if (to.path.startsWith('/admin')) {
    let user = null
    try {
      user = JSON.parse(localStorage.getItem('user'))
    } catch (e) {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
    // 检查用户是否登录且是管理员
    if (!user || !user.is_admin) {
      alert('请以管理员身份登录')
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

// 路由切换后上报页面访问日志
router.afterEach((to) => {
  const pageTitle = to.name || to.meta?.title || document.title
  reportPageView(pageTitle)
})

export default router
