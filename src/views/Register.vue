<template>
  <div class="register-page">
    <div class="register-header">
      <router-link to="/" class="logo">
        <svg class="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="logo-text">院前急救培训平台</span>
      </router-link>
    </div>
    
    <div class="register-container">
      <div class="register-card">
        <div class="card-header">
          <h2>用户注册</h2>
          <p>创建账号，开始您的学习之旅</p>
        </div>
        
        <form @submit.prevent="register" class="register-form">
          <div class="form-group user-type-group">
            <label>用户类型</label>
            <div class="type-options">
              <div class="type-option" :class="{ active: form.user_type === 'public' }" @click="form.user_type = 'public'">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                  <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>公众报名</span>
              </div>
              <div class="type-option" :class="{ active: form.user_type === 'medical' }" @click="form.user_type = 'medical'">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12H18V15C18 16.0609 17.5786 17.0783 16.8284 17.8284C16.0783 18.5786 15.0609 19 14 19H10C8.93913 19 7.92172 18.5786 7.17157 17.8284C6.42143 17.0783 6 16.0609 6 15V12H2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 2V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M8 6H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M9 22H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>医护报名</span>
              </div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="username">用户名</label>
              <div class="input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                </svg>
                <input type="text" id="username" v-model="form.username" placeholder="请输入用户名" required>
              </div>
            </div>
            
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
          </div>
          
          <div class="form-row">
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
            
            <div class="form-group">
              <label for="phone">联系电话</label>
              <div class="input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7294C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5342 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.09494 3.90347 2.12781 3.62476 2.21643 3.36162C2.30506 3.09849 2.4475 2.85669 2.6347 2.65163C2.82189 2.44656 3.04974 2.28271 3.30372 2.17052C3.55771 2.05833 3.83227 2.00026 4.10999 2H7.10999C7.5953 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04207 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.8939 7.65088C9.81415 8.02485 9.62886 8.36811 9.35999 8.64L8.08999 9.91C9.51355 12.4135 11.5864 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <input type="tel" id="phone" v-model="form.phone" placeholder="请输入电话" required>
              </div>
            </div>
          </div>
          
          <div class="form-row" v-if="form.user_type === 'medical'">
            <div class="form-group">
              <label for="hospital">所属医院 <span class="required">*</span></label>
              <div class="input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 21H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M5 21V7L12 3L19 7V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 21V15H15V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <select id="hospital" v-model="form.hospital_id" required>
                  <option value="">请选择医院</option>
                  <option v-for="h in hospitals" :key="h.id" :value="h.id">{{ h.name }}</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label for="profession">职业 <span class="required">*</span></label>
              <div class="input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M16 7V4C16 2.89543 15.1046 2 14 2H10C8.89543 2 8 2.89543 8 4V7" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 12V12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <select id="profession" v-model="form.profession_id" required>
                  <option value="">请选择职业</option>
                  <option v-for="p in professions" :key="p.id" :value="p.id">{{ p.name }}</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="form-row" v-if="form.user_type === 'public'">
            <div class="form-group">
              <label for="organization">所属单位</label>
              <div class="input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 21H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M5 21V7L12 3L19 7V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <input type="text" id="organization" v-model="form.organization" placeholder="请输入单位名称">
              </div>
            </div>
            
            <div class="form-group">
              <label for="address">联系地址</label>
              <div class="input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
                </svg>
                <input type="text" id="address" v-model="form.address" placeholder="请输入地址">
              </div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="delivery_method">邮寄方式 <span class="required">*</span></label>
              <div class="input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="3" width="15" height="13" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M16 8h4a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V10a2 2 0 012-2h4" stroke="currentColor" stroke-width="2"/>
                  <path d="M21 12H3" stroke="currentColor" stroke-width="2"/>
                </svg>
                <select id="delivery_method" v-model="form.delivery_method_id" required>
                  <option value="">请选择邮寄方式</option>
                  <option v-for="m in deliveryMethods" :key="m.id" :value="m.id">
                    {{ m.name }}{{ m.fee > 0 ? ` (¥${m.fee})` : '' }}
                  </option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label for="delivery_address">收件地址</label>
              <div class="input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
                </svg>
                <input type="text" id="delivery_address" v-model="form.delivery_address" placeholder="请输入收件地址（证书邮寄地址）">
              </div>
            </div>
          </div>
          
          <button type="submit" class="btn-submit" :disabled="loading">
            {{ loading ? '注册中...' : '立即注册' }}
          </button>
        </form>
        
        <div class="card-footer">
          <p>已有账号？<router-link to="/login">立即登录</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/axios'

export default {
  name: 'Register',
  data() {
    return {
      loading: false,
      form: {
        user_type: 'public',
        username: '',
        email: '',
        password: '',
        phone: '',
        organization: '',
        address: '',
        hospital_id: '',
        profession_id: '',
        delivery_method_id: '',
        delivery_address: ''
      },
      hospitals: [],
      professions: [],
      deliveryMethods: []
    }
  },
  mounted() {
    this.loadHospitals()
    this.loadProfessions()
    this.loadDeliveryMethods()
  },
  methods: {
    async loadHospitals() {
      try {
        const response = await api.get('/api/public/hospitals')
        this.hospitals = response.data.hospitals || []
      } catch (error) {
        console.error('加载医院列表失败:', error)
      }
    },
    async loadProfessions() {
      try {
        const response = await api.get('/api/public/professions')
        this.professions = response.data.professions || []
      } catch (error) {
        console.error('加载职业列表失败:', error)
      }
    },
    async loadDeliveryMethods() {
      try {
        const response = await api.get('/api/public/delivery-methods')
        this.deliveryMethods = response.data.delivery_methods || []
      } catch (error) {
        console.error('加载邮寄方式失败:', error)
      }
    },
    async register() {
      if (this.form.user_type === 'medical') {
        if (!this.form.hospital_id) {
          alert('请选择所属医院')
          return
        }
        if (!this.form.profession_id) {
          alert('请选择职业')
          return
        }
      }
      
      if (!this.form.delivery_method_id) {
        alert('请选择邮寄方式')
        return
      }
      
      this.loading = true
      try {
        const response = await api.post('/api/register', this.form)
        alert(response.data.message)
        this.$router.push('/login')
      } catch (error) {
        alert(error.response?.data?.message || '注册失败')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
}

.register-header {
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

.register-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-card {
  width: 100%;
  max-width: 600px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  color: white;
  padding: 30px;
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

.register-form {
  padding: 30px;
}

.user-type-group {
  margin-bottom: 24px;
}

.type-options {
  display: flex;
  gap: 16px;
}

.type-option {
  flex: 1;
  padding: 20px;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s;
}

.type-option:hover {
  border-color: #1890ff;
}

.type-option.active {
  border-color: #1890ff;
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.1) 0%, rgba(9, 109, 217, 0.1) 100%);
}

.type-option svg {
  width: 32px;
  height: 32px;
  color: #8c8c8c;
  margin-bottom: 8px;
}

.type-option.active svg {
  color: #1890ff;
}

.type-option span {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

.required {
  color: #f5222d;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper svg {
  position: absolute;
  left: 14px;
  width: 18px;
  height: 18px;
  color: #bfbfbf;
  pointer-events: none;
}

.input-wrapper input,
.input-wrapper select {
  width: 100%;
  padding: 12px 12px 12px 42px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
  box-sizing: border-box;
  background: white;
  appearance: none;
}

.input-wrapper select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

.input-wrapper input:focus,
.input-wrapper select:focus {
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
  margin-top: 10px;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(24, 144, 255, 0.4);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .type-options {
    flex-direction: column;
    gap: 12px;
  }
  
  .card-header {
    padding: 24px 20px;
  }
  
  .card-header h2 {
    font-size: 24px;
  }
  
  .register-form {
    padding: 20px;
  }
  
  .card-footer {
    padding: 15px 20px 20px;
  }
}
</style>
