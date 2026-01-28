<template>
  <div class="my-courses-container">
    <nav class="navbar">
      <div class="navbar-brand">院前培训报名系统</div>
      <div class="navbar-links">
        <span v-if="isLoggedIn">{{ user.username }} - {{ user.organization }}</span>
        <router-link to="/">首页</router-link>
        <button @click="logout" class="btn-logout">退出登录</button>
      </div>
    </nav>

    <div class="registrations-container">
      <h1>我的报名记录</h1>
      <div v-if="registrations.length === 0" class="no-courses">
        <p>您还没有报名任何课程</p>
        <router-link to="/" class="btn-back">返回首页</router-link>
      </div>
      <div v-else class="registrations-list">
        <div v-for="registration in registrations" :key="registration.id" class="registration-card">
          <h3>{{ registration.course.title }}</h3>
          <div class="course-info">
            <p><strong>日期：</strong>{{ registration.course.date }}</p>
            <p><strong>时间：</strong>{{ registration.course.time }}</p>
            <p><strong>地点：</strong>{{ registration.course.location }}</p>
            <p><strong>报名时间：</strong>{{ formatDate(registration.registration_date) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MyCourses',
  data() {
    return {
      registrations: [],
      user: null,
      isLoggedIn: false
    }
  },
  mounted() {
    this.checkLoginStatus()
    console.log('mounted后用户信息:', this.user)
    console.log('登录状态:', this.isLoggedIn)
    if (this.isLoggedIn && this.user) {
      this.fetchRegistrations()
    }
  },
  methods: {
    checkLoginStatus() {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        this.user = JSON.parse(userStr)
        this.isLoggedIn = true
      } else {
        this.$router.push('/login')
      }
    },
    async fetchRegistrations() {
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
        console.log('调用API获取报名记录，用户ID:', this.user.id)
        console.log('认证令牌:', token)
        console.log('API URL:', 'http://localhost:5000/api/my-courses')
        const response = await axios.get('http://localhost:5000/api/my-courses', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        console.log('获取报名记录成功:', response.data)
        // 转换数据格式以匹配前端期望的结构
        this.registrations = response.data.map(course => ({
          id: `reg_${course.id}`,
          user_id: this.user.id,
          course_id: course.id,
          registration_date: course.registered_at,
          course: course
        }))
      } catch (error) {
        console.error('获取报名记录失败:', error)
        console.error('错误详情:', error.response)
        console.error('错误消息:', error.message)
        console.error('错误配置:', error.config)
      }
    },
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.user = null
      this.isLoggedIn = false
      this.$router.push('/')
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleString()
    }
  }
}
</script>

<style scoped>
.my-courses-container {
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

.registrations-container {
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 20px;
}

.registrations-container h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.no-courses {
  text-align: center;
  padding: 50px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.no-courses p {
  font-size: 18px;
  color: #666;
  margin-bottom: 20px;
}

.btn-back {
  display: inline-block;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 16px;
}

.btn-back:hover {
  background-color: #45a049;
}

.registrations-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.registration-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.registration-card h3 {
  color: #4CAF50;
  margin-bottom: 15px;
}

.course-info p {
  margin: 8px 0;
  color: #555;
}
</style>