<template>
  <div class="login-page">
    <div class="login-header">
      <router-link to="/" class="logo">
        <svg class="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="logo-text">院前急救培训平台</span>
      </router-link>
    </div>
    
    <div class="login-container">
      <div class="login-card">
        <div class="card-header">
          <h2>用户登录</h2>
          <p>欢迎回来，请登录您的账号</p>
        </div>
        
        <form @submit.prevent="login" class="login-form">
          <div class="form-group">
            <label for="email">邮箱地址</label>
            <div class="input-wrapper">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <input type="email" id="email" v-model="form.email" placeholder="请输入邮箱" required>
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">登录密码</label>
            <div class="input-wrapper">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" stroke-width="2"/>
              </svg>
              <input type="password" id="password" v-model="form.password" placeholder="请输入密码" required>
            </div>
          </div>
          
          <button type="submit" class="btn-submit">登 录</button>
        </form>
        
        <div class="card-footer">
          <p>还没有账号？<router-link to="/register">立即注册</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/axios'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async login() {
      try {
        // 管理员账号密码硬编码
        const adminEmail = 'admin@example.com'
        const adminPassword = 'admin123'
        
        // 检查是否是管理员登录
        if (this.form.email === adminEmail && this.form.password === adminPassword) {
          // 模拟管理员登录
          const adminUser = {
            id: 'admin',
            email: adminEmail,
            name: '管理员',
            is_admin: true
          }
          const adminToken = 'admin-token-' + Date.now()
          
          localStorage.setItem('token', adminToken)
          localStorage.setItem('user', JSON.stringify(adminUser))
          alert('管理员登录成功')
          this.$router.push('/admin')
        } else {
          // 普通用户登录
          const response = await api.post('/api/user/login', this.form)
          localStorage.setItem('token', response.token)
          localStorage.setItem('user', JSON.stringify(response.user))
          alert('登录成功')
          this.$router.push('/')
        }
      } catch (error) {
        alert(error.message || '登录失败')
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
}

.login-header {
  padding: 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: white;
}

.logo-icon {
  width: 32px;
  height: 32px;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
}

.login-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  color: white;
  padding: 40px 30px;
  text-align: center;
}

.card-header h2 {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 600;
}

.card-header p {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
}

.login-form {
  padding: 30px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper svg {
  position: absolute;
  left: 14px;
  width: 20px;
  height: 20px;
  color: #bfbfbf;
}

.input-wrapper input {
  width: 100%;
  padding: 14px 14px 14px 44px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s;
  box-sizing: border-box;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(24, 144, 255, 0.4);
}

.card-footer {
  padding: 20px 30px 30px;
  text-align: center;
  border-top: 1px solid #f0f0f0;
}

.card-footer p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.card-footer a {
  color: #1890ff;
  text-decoration: none;
  font-weight: 500;
}

.card-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .card-header {
    padding: 30px 20px;
  }
  
  .card-header h2 {
    font-size: 24px;
  }
  
  .login-form {
    padding: 20px;
  }
  
  .card-footer {
    padding: 15px 20px 20px;
  }
}
</style>
