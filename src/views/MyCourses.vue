<template>
  <div class="my-courses-container">
    <nav class="navbar">
      <div class="navbar-brand">院前培训报名系统</div>
      <div class="navbar-links">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/training" class="nav-link">课程介绍</router-link>
        <router-link to="/activities" class="nav-link">活动报名</router-link>
        <router-link to="/video" class="nav-link">视频培训</router-link>
        <span v-if="isLoggedIn">{{ user.username }} - {{ user.organization }}</span>
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
          <div class="card-header">
            <h3>{{ registration.course.title }}</h3>
            <span :class="['status-badge', getStatusClass(registration.registration_status)]">
              {{ getStatusText(registration.registration_status) }}
            </span>
          </div>
          
          <div class="personal-info">
            <h4>个人信息</h4>
            <p><strong>姓名：</strong>{{ registration.name }}</p>
            <p><strong>身份证号：</strong>{{ registration.id_card }}</p>
            <p><strong>性别：</strong>{{ registration.gender === 1 ? '男' : '女' }}</p>
            <p><strong>年龄：</strong>{{ registration.age }}</p>
            <p><strong>所属医院：</strong>{{ registration.hospital }}</p>
            <p><strong>职务：</strong>{{ registration.position }}</p>
            <p><strong>职称：</strong>{{ registration.title }}</p>
            <p><strong>手机号码：</strong>{{ registration.phone }}</p>
          </div>
          
          <div class="course-info">
            <h4>课程信息</h4>
            <p><strong>日期：</strong>{{ registration.course.date }}</p>
            <p><strong>时间：</strong>{{ registration.course.time }}</p>
            <p><strong>地点：</strong>{{ registration.course.location }}</p>
            <p><strong>报名时间：</strong>{{ formatDate(registration.registration_date) }}</p>
          </div>
          
          <div class="card-actions" v-if="registration.registration_status === 1">
            <button @click="showEditModal(registration)" class="btn-edit">编辑信息</button>
            <button @click="showAdjustmentModal(registration)" class="btn-adjust">调剂申请</button>
            <button @click="showCancelModal(registration)" class="btn-cancel">取消报名</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 编辑信息弹窗 -->
    <div v-if="editModalVisible" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>编辑个人信息</h3>
          <button @click="closeEditModal" class="btn-close">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitEdit">
            <div class="form-group">
              <label>姓名</label>
              <input v-model="editForm.name" type="text" required>
            </div>
            <div class="form-group">
              <label>身份证号</label>
              <input v-model="editForm.id_card" type="text" required maxlength="18">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>性别</label>
                <select v-model="editForm.gender" required>
                  <option :value="1">男</option>
                  <option :value="0">女</option>
                </select>
              </div>
              <div class="form-group">
                <label>年龄</label>
                <input v-model.number="editForm.age" type="number" required min="1" max="120">
              </div>
            </div>
            <div class="form-group">
              <label>所属医院</label>
              <select v-model="editForm.hospital" required>
                <option value="">请选择医院</option>
                <option v-for="hospital in hospitals" :key="hospital.hospital_id" :value="hospital.hospital_name">
                  {{ hospital.hospital_name }}
                </option>
              </select>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>职务</label>
                <input v-model="editForm.position" type="text" required>
              </div>
              <div class="form-group">
                <label>职称</label>
                <input v-model="editForm.title" type="text" required>
              </div>
            </div>
            <div class="form-group">
              <label>手机号码</label>
              <input v-model="editForm.phone" type="tel" required maxlength="11">
            </div>
            <div class="form-actions">
              <button type="button" @click="closeEditModal" class="btn-secondary">取消</button>
              <button type="submit" class="btn-primary">保存</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- 调剂申请弹窗 -->
    <div v-if="adjustmentModalVisible" class="modal-overlay" @click="closeAdjustmentModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>调剂申请</h3>
          <button @click="closeAdjustmentModal" class="btn-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="current-course">
            <h4>当前课程</h4>
            <p>{{ currentRegistration?.course?.title }}</p>
            <p>{{ currentRegistration?.course?.location }} {{ currentRegistration?.course?.date }}</p>
          </div>
          
          <div class="form-group">
            <label>选择目标课程</label>
            <select v-model="adjustmentForm.new_course_id" required>
              <option value="">请选择课程</option>
              <option v-for="course in availableCourses" :key="course.course_id" :value="course.course_id">
                {{ course.title }} - {{ course.location }} ({{ course.registered }}/{{ course.capacity }})
              </option>
            </select>
          </div>
          
          <div class="form-group" v-if="selectedCourse && selectedCourse.registered >= selectedCourse.capacity">
            <label>调剂原因</label>
            <textarea v-model="adjustmentForm.adjustment_reason" rows="3" placeholder="请说明调剂原因"></textarea>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeAdjustmentModal" class="btn-secondary">取消</button>
            <button @click="submitAdjustment" class="btn-primary">提交申请</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 取消报名弹窗 -->
    <div v-if="cancelModalVisible" class="modal-overlay" @click="closeCancelModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>取消报名</h3>
          <button @click="closeCancelModal" class="btn-close">&times;</button>
        </div>
        <div class="modal-body">
          <p class="warning-text">确定要取消报名吗？</p>
          <div class="course-info-box">
            <p><strong>课程：</strong>{{ currentRegistration?.course?.title }}</p>
            <p><strong>时间：</strong>{{ currentRegistration?.course?.date }} {{ currentRegistration?.course?.time }}</p>
            <p><strong>地点：</strong>{{ currentRegistration?.course?.location }}</p>
          </div>
          
          <div class="form-group" v-if="needCancelReason">
            <label>取消原因</label>
            <textarea v-model="cancelForm.cancel_reason" rows="3" placeholder="请说明取消原因" required></textarea>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeCancelModal" class="btn-secondary">取消</button>
            <button @click="submitCancellation" class="btn-danger">确认取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/axios'

export default {
  name: 'MyCourses',
  data() {
    return {
      registrations: [],
      user: null,
      isLoggedIn: false,
      hospitals: [],
      availableCourses: [],
      editModalVisible: false,
      adjustmentModalVisible: false,
      cancelModalVisible: false,
      currentRegistration: null,
      needCancelReason: false,
      editForm: {
        name: '',
        id_card: '',
        gender: 1,
        age: '',
        hospital: '',
        position: '',
        title: '',
        phone: ''
      },
      adjustmentForm: {
        new_course_id: '',
        adjustment_reason: ''
      },
      cancelForm: {
        cancel_reason: ''
      }
    }
  },
  computed: {
    selectedCourse() {
      if (!this.adjustmentForm.new_course_id) return null
      return this.availableCourses.find(c => c.course_id === this.adjustmentForm.new_course_id)
    }
  },
  mounted() {
    this.checkLoginStatus()
    if (this.isLoggedIn && this.user) {
      this.fetchRegistrations()
      this.loadHospitals()
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
      try {
        const response = await api.get('/api/my-courses')
        this.registrations = response.data.map(course => ({
          id: `reg_${course.id}`,
          user_id: this.user.id,
          course_id: course.id,
          registration_date: course.registered_at,
          registration_status: course.registration_status || 1,
          name: course.name || this.user.username,
          id_card: course.id_card || '',
          gender: course.gender || 1,
          age: course.age || '',
          hospital: course.hospital || this.user.organization,
          position: course.position || '',
          title: course.title || '',
          phone: course.phone || this.user.phone,
          course: course
        }))
      } catch (error) {
        console.error('获取报名记录失败:', error)
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
    async loadAvailableCourses(activityId) {
      try {
        const response = await api.get(`/api/activities/${activityId}`)
        this.availableCourses = response.data.courses.filter(c => c.course_id !== this.currentRegistration.course_id)
      } catch (error) {
        console.error('加载可选课程失败:', error)
      }
    },
    showEditModal(registration) {
      this.currentRegistration = registration
      this.editForm = {
        name: registration.name,
        id_card: registration.id_card,
        gender: registration.gender,
        age: registration.age,
        hospital: registration.hospital,
        position: registration.position,
        title: registration.title,
        phone: registration.phone
      }
      this.editModalVisible = true
    },
    closeEditModal() {
      this.editModalVisible = false
      this.currentRegistration = null
    },
    async submitEdit() {
      try {
        await api.put(`/api/admin/registrations/${this.currentRegistration.id}`, this.editForm)
        alert('信息更新成功！')
        this.closeEditModal()
        this.fetchRegistrations()
      } catch (error) {
        alert(error.response?.data?.message || '更新失败')
      }
    },
    showAdjustmentModal(registration) {
      this.currentRegistration = registration
      this.adjustmentForm = { new_course_id: '', adjustment_reason: '' }
      this.adjustmentModalVisible = true
      if (registration.course.activity_id) {
        this.loadAvailableCourses(registration.course.activity_id)
      }
    },
    closeAdjustmentModal() {
      this.adjustmentModalVisible = false
      this.currentRegistration = null
      this.availableCourses = []
    },
    async submitAdjustment() {
      if (!this.adjustmentForm.new_course_id) {
        alert('请选择目标课程')
        return
      }
      
      try {
        await api.post('/api/adjustments', {
          registration_id: this.currentRegistration.id,
          new_course_id: this.adjustmentForm.new_course_id,
          adjustment_reason: this.adjustmentForm.adjustment_reason
        })
        alert('调剂申请已提交！')
        this.closeAdjustmentModal()
        this.fetchRegistrations()
      } catch (error) {
        alert(error.response?.data?.message || '调剂申请失败')
      }
    },
    showCancelModal(registration) {
      this.currentRegistration = registration
      this.cancelForm = { cancel_reason: '' }
      
      const now = new Date()
      const regEnd = new Date(registration.course.registration_end)
      this.needCancelReason = now > regEnd
      
      this.cancelModalVisible = true
    },
    closeCancelModal() {
      this.cancelModalVisible = false
      this.currentRegistration = null
    },
    async submitCancellation() {
      if (this.needCancelReason && !this.cancelForm.cancel_reason) {
        alert('请填写取消原因')
        return
      }
      
      if (!confirm('确定要取消报名吗？')) return
      
      try {
        await api.post('/api/cancellations', {
          registration_id: this.currentRegistration.id,
          cancel_reason: this.cancelForm.cancel_reason
        })
        alert('取消报名成功！')
        this.closeCancelModal()
        this.fetchRegistrations()
      } catch (error) {
        alert(error.response?.data?.message || '取消报名失败')
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
    },
    getStatusText(status) {
      const statusMap = {
        0: '已取消',
        1: '已报名',
        2: '审核中',
        3: '调剂中'
      }
      return statusMap[status] || '未知'
    },
    getStatusClass(status) {
      const classMap = {
        0: 'status-cancelled',
        1: 'status-registered',
        2: 'status-pending',
        3: 'status-adjusting'
      }
      return classMap[status] || ''
    }
  }
}
</script>

<style scoped>
.my-courses-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
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
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
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
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.btn-back {
  display: inline-block;
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.registrations-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.registration-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.card-header h3 {
  color: #333;
  margin: 0;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-registered {
  background: #d4edda;
  color: #155724;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-adjusting {
  background: #d1ecf1;
  color: #0c5460;
}

.personal-info, .course-info {
  margin-bottom: 15px;
}

.personal-info h4, .course-info h4 {
  color: #667eea;
  margin-bottom: 10px;
  font-size: 14px;
}

.personal-info p, .course-info p {
  margin: 5px 0;
  color: #555;
  font-size: 14px;
}

.card-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.btn-edit, .btn-adjust, .btn-cancel {
  flex: 1;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-edit {
  background: #4CAF50;
  color: white;
}

.btn-adjust {
  background: #2196F3;
  color: white;
}

.btn-cancel {
  background: #f44336;
  color: white;
}

.btn-edit:hover, .btn-adjust:hover, .btn-cancel:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.form-group input, .form-group select, .form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-primary, .btn-secondary, .btn-danger {
  flex: 1;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;
}

.btn-danger {
  background: #f44336;
  color: white;
}

.warning-text {
  color: #f44336;
  font-weight: 500;
  margin-bottom: 15px;
}

.course-info-box {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.course-info-box p {
  margin: 5px 0;
  color: #555;
}

.current-course {
  background: #f0f0f0;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.current-course h4 {
  margin: 0 0 10px 0;
  color: #667eea;
}

.current-course p {
  margin: 5px 0;
  color: #555;
}

@media (max-width: 768px) {
  .registrations-list {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .card-actions {
    flex-direction: column;
  }
}
</style>
