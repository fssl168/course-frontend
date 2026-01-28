<template>
  <div class="user-profile-container">
    <nav class="navbar">
      <div class="navbar-brand">院前培训报名系统</div>
      <div class="navbar-links">
        <span v-if="user">{{ user.username }} - {{ user.organization }}</span>
        <router-link to="/">首页</router-link>
        <router-link to="/my-courses">我的课程</router-link>
        <router-link to="/user-profile">个人信息</router-link>
        <button @click="logout" class="btn-logout">退出登录</button>
      </div>
    </nav>

    <div class="profile-container">
      <h1>个人信息管理</h1>
      
      <div class="profile-section">
        <h2>基本信息</h2>
        <form @submit.prevent="updateProfile">
          <div class="form-group">
            <label>用户名</label>
            <input v-model="userForm.username" type="text" class="form-control">
          </div>
          <div class="form-group">
            <label>邮箱</label>
            <input v-model="userForm.email" type="email" class="form-control">
          </div>
          <div class="form-group">
            <label>电话</label>
            <input v-model="userForm.phone" type="tel" class="form-control">
            <button v-if="user && !user.is_wechat_user" type="button" @click="getWechatPhone" class="btn-wechat-phone">微信授权手机号</button>
          </div>
          <div class="form-group">
            <label>单位/组织</label>
            <input v-model="userForm.organization" type="text" class="form-control">
          </div>
          <div class="form-group">
            <label>地址</label>
            <input v-model="userForm.address" type="text" class="form-control" placeholder="请输入详细地址">
          </div>
          <button type="submit" class="btn-update">更新信息</button>
        </form>
      </div>
      
      <div class="profile-section">
        <h2>账号安全</h2>
        <form @submit.prevent="changePassword">
          <div class="form-group">
            <label>原密码</label>
            <input v-model="passwordForm.oldPassword" type="password" class="form-control">
          </div>
          <div class="form-group">
            <label>新密码</label>
            <input v-model="passwordForm.newPassword" type="password" class="form-control">
          </div>
          <div class="form-group">
            <label>确认新密码</label>
            <input v-model="passwordForm.confirmPassword" type="password" class="form-control">
          </div>
          <button type="submit" class="btn-update">修改密码</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'UserProfile',
  data() {
    return {
      user: null,
      userForm: {
        username: '',
        email: '',
        phone: '',
        organization: '',
        address: ''
      },
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  mounted() {
    this.checkLoginStatus()
    this.fetchUserProfile()
  },
  methods: {
    checkLoginStatus() {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        this.user = JSON.parse(userStr)
      } else {
        this.$router.push('/login')
      }
    },
    async fetchUserProfile() {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          this.$router.push('/login')
          return
        }
        const response = await axios.get('http://localhost:5000/api/user-profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        this.user = response.data
        this.userForm = {
          username: response.data.username,
          email: response.data.email,
          phone: response.data.phone,
          organization: response.data.organization,
          address: response.data.address || ''
        }
      } catch (error) {
        console.error('获取个人信息失败:', error)
        alert('获取个人信息失败')
        this.$router.push('/login')
      }
    },
    async updateProfile() {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.put('http://localhost:5000/api/user-profile', this.userForm, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        alert(response.data.message)
        // 更新本地存储的用户信息
        this.user = { ...this.user, ...this.userForm }
        localStorage.setItem('user', JSON.stringify(this.user))
      } catch (error) {
        console.error('更新个人信息失败:', error)
        alert(error.response.data.message)
      }
    },
    async changePassword() {
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        alert('两次输入的密码不一致')
        return
      }
      
      try {
        const token = localStorage.getItem('token')
        const response = await axios.post('http://localhost:5000/api/change-password', this.passwordForm, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        alert(response.data.message)
        // 重置密码表单
        this.passwordForm = {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      } catch (error) {
        console.error('修改密码失败:', error)
        alert(error.response.data.message)
      }
    },
    getWechatPhone() {
      // 跳转到微信手机号授权页面
      window.location.href = 'http://localhost:5000/api/wechat/phone-auth'
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
.user-profile-container {
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

.profile-container {
  max-width: 800px;
  margin: 30px auto;
  padding: 0 20px;
}

.profile-container h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.profile-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 30px;
}

.profile-section h2 {
  color: #4CAF50;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.btn-update {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-update:hover {
  background-color: #45a049;
}

.btn-wechat-phone {
  margin-top: 10px;
  background-color: #07C160;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-wechat-phone:hover {
  background-color: #06B055;
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
  
  .profile-container {
    padding: 0 10px;
  }
  
  .profile-section {
    padding: 15px;
  }
}
</style>