<template>
  <div class="admin-page">
    <div class="page-header">
      <h1 class="page-title">系统设置</h1>
    </div>

    <div class="settings-container">
      <!-- 基础设置 -->
      <div class="settings-card">
        <div class="settings-header">
          <i class="fas fa-cog"></i>
          <h3>基础设置</h3>
        </div>
        <div class="settings-body">
          <div class="form-group">
            <label>系统名称</label>
            <input type="text" v-model="settings.systemName" placeholder="请输入系统名称">
          </div>
          <div class="form-group">
            <label>系统描述</label>
            <textarea v-model="settings.systemDescription" placeholder="请输入系统描述" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>管理员邮箱</label>
            <input type="email" v-model="settings.adminEmail" placeholder="请输入管理员邮箱">
          </div>
          <div class="form-actions">
            <button class="btn btn-primary" @click="saveBaseSettings">保存设置</button>
          </div>
        </div>
      </div>

      <!-- 报名设置 -->
      <div class="settings-card">
        <div class="settings-header">
          <i class="fas fa-calendar-check"></i>
          <h3>报名设置</h3>
        </div>
        <div class="settings-body">
          <div class="form-group">
            <label>默认活动容量</label>
            <input type="number" v-model="settings.defaultCapacity" placeholder="请输入默认容量">
          </div>
          <div class="form-group">
            <label>报名截止时间（天）</label>
            <input type="number" v-model="settings.registrationDeadline" placeholder="请输入截止天数">
          </div>
          <div class="form-group">
            <label>是否允许调剂</label>
            <select v-model="settings.allowAdjustment">
              <option :value="true">允许</option>
              <option :value="false">不允许</option>
            </select>
          </div>
          <div class="form-actions">
            <button class="btn btn-primary" @click="saveRegistrationSettings">保存设置</button>
          </div>
        </div>
      </div>

      <!-- 通知设置 -->
      <div class="settings-card">
        <div class="settings-header">
          <i class="fas fa-bell"></i>
          <h3>通知设置</h3>
        </div>
        <div class="settings-body">
          <div class="form-group">
            <label>报名成功通知</label>
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="settings.notifyRegistrationSuccess"> 启用
              </label>
            </div>
          </div>
          <div class="form-group">
            <label>取消报名通知</label>
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="settings.notifyCancellation"> 启用
              </label>
            </div>
          </div>
          <div class="form-group">
            <label>调剂结果通知</label>
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="settings.notifyAdjustment"> 启用
              </label>
            </div>
          </div>
          <div class="form-actions">
            <button class="btn btn-primary" @click="saveNotificationSettings">保存设置</button>
          </div>
        </div>
      </div>

      <!-- 系统信息 -->
      <div class="settings-card">
        <div class="settings-header">
          <i class="fas fa-info-circle"></i>
          <h3>系统信息</h3>
        </div>
        <div class="settings-body">
          <div class="info-item">
            <div class="info-label">系统版本</div>
            <div class="info-value">v1.0.0</div>
          </div>
          <div class="info-item">
            <div class="info-label">最后更新时间</div>
            <div class="info-value">{{ lastUpdateTime || '-' }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">服务器状态</div>
            <div class="info-value">
              <span class="status-dot"></span>
              运行正常
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminSettings',
  data() {
    return {
      settings: {
        systemName: '院前急救培训平台',
        systemDescription: '医护培训管理系统',
        adminEmail: '',
        defaultCapacity: 50,
        registrationDeadline: 7,
        allowAdjustment: true,
        notifyRegistrationSuccess: true,
        notifyCancellation: true,
        notifyAdjustment: true
      },
      lastUpdateTime: '',
      loading: false
    }
  },
  mounted() {
    this.loadSettings()
  },
  methods: {
    async loadSettings() {
      this.loading = true
      try {
        // 从本地存储或 API 加载设置
        const savedSettings = localStorage.getItem('systemSettings')
        if (savedSettings) {
          this.settings = JSON.parse(savedSettings)
        }
        this.lastUpdateTime = new Date().toLocaleString('zh-CN')
      } catch (error) {
        console.error('加载设置失败:', error)
      } finally {
        this.loading = false
      }
    },
    saveBaseSettings() {
      this.saveSettings('基础设置')
    },
    saveRegistrationSettings() {
      this.saveSettings('报名设置')
    },
    saveNotificationSettings() {
      this.saveSettings('通知设置')
    },
    saveSettings(type) {
      try {
        localStorage.setItem('systemSettings', JSON.stringify(this.settings))
        this.lastUpdateTime = new Date().toLocaleString('zh-CN')
        alert(`${type}保存成功`)
      } catch (error) {
        console.error('保存设置失败:', error)
        alert('保存设置失败，请重试')
      }
    }
  }
}
</script>

<style scoped>
.admin-page {
  padding: 0;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.settings-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 24px;
}

.settings-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.settings-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.settings-header i {
  font-size: 20px;
  color: #1890ff;
}

.settings-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.settings-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #606266;
  font-weight: 500;
  font-size: 14px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #1890ff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.checkbox-group {
  display: flex;
  gap: 16px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: normal;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  cursor: pointer;
}

.form-actions {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.btn {
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-primary {
  background: #1890ff;
  color: white;
}

.btn-primary:hover {
  background: #40a9ff;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: #666;
  font-size: 14px;
}

.info-value {
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #52c41a;
  margin-right: 8px;
}

@media (max-width: 768px) {
  .settings-container {
    grid-template-columns: 1fr;
  }
}
</style>