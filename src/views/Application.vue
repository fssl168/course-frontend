<template>
  <div class="application-container">
    <h2>申请管理</h2>
    
    <div class="tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.key"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="tab-content">
      <!-- 报名申请 -->
      <div v-if="activeTab === 'register'" class="form-container">
        <h3>报名申请</h3>
        <form @submit.prevent="submitRegistration">
          <div class="form-group">
            <label>活动ID</label>
            <input v-model="registrationForm.activity_id" type="text" required>
          </div>
          <div class="form-group">
            <label>姓名</label>
            <input v-model="registrationForm.name" type="text" required>
          </div>
          <div class="form-group">
            <label>身份证号</label>
            <input v-model="registrationForm.id_card" type="text" required>
          </div>
          <div class="form-group">
            <label>手机号</label>
            <input v-model="registrationForm.phone" type="tel" required>
          </div>
          <div class="form-group">
            <label>医院</label>
            <input v-model="registrationForm.hospital" type="text">
          </div>
          <div class="form-group">
            <label>职务</label>
            <input v-model="registrationForm.position" type="text">
          </div>
          <div class="form-group">
            <label>职称</label>
            <input v-model="registrationForm.title" type="text">
          </div>
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? '提交中...' : '提交报名' }}
          </button>
        </form>
      </div>

      <!-- 调剂申请 -->
      <div v-if="activeTab === 'adjust'" class="form-container">
        <h3>调剂申请</h3>
        <form @submit.prevent="submitAdjustment">
          <div class="form-group">
            <label>报名ID</label>
            <input v-model="adjustmentForm.registration_id" type="text" required>
          </div>
          <div class="form-group">
            <label>目标课程ID</label>
            <input v-model="adjustmentForm.new_course_id" type="text" required>
          </div>
          <div class="form-group">
            <label>调剂原因</label>
            <textarea v-model="adjustmentForm.reason"></textarea>
          </div>
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? '提交中...' : '提交调剂' }}
          </button>
        </form>
      </div>

      <!-- 取消申请 -->
      <div v-if="activeTab === 'cancel'" class="form-container">
        <h3>取消申请</h3>
        <form @submit.prevent="submitCancellation">
          <div class="form-group">
            <label>报名ID</label>
            <input v-model="cancellationForm.registration_id" type="text" required>
          </div>
          <div class="form-group">
            <label>取消原因</label>
            <textarea v-model="cancellationForm.reason"></textarea>
          </div>
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? '提交中...' : '提交取消' }}
          </button>
        </form>
      </div>

      <!-- 申请进度 -->
      <div v-if="activeTab === 'progress'" class="form-container">
        <h3>申请进度</h3>
        <div class="form-group">
          <label>申请ID</label>
          <input v-model="progressForm.application_id" type="text" required>
        </div>
        <button @click="getProgress" class="btn-primary" :disabled="loading">
          {{ loading ? '查询中...' : '查询进度' }}
        </button>
        
        <div v-if="progressData" class="progress-result">
          <h4>进度详情</h4>
          <div class="progress-info">
            <p><strong>状态：</strong>{{ statusMap[progressData.workflow.status] }}</p>
            <p><strong>当前节点：</strong>{{ progressData.workflow.current_node }}</p>
            <p><strong>申请类型：</strong>{{ typeMap[progressData.workflow.workflow_type] }}</p>
            <p><strong>创建时间：</strong>{{ progressData.workflow.created_at }}</p>
          </div>
          
          <div v-if="progressData.nodes && progressData.nodes.length > 0" class="nodes-list">
            <h5>审批节点：</h5>
            <div 
              v-for="(node, index) in progressData.nodes" 
              :key="index"
              class="node-item"
              :class="{ passed: node.status === 1, rejected: node.status === 2 }"
            >
              <div class="node-header">
                <span class="node-name">{{ node.node_name }}</span>
                <span class="node-status">{{ nodeStatusMap[node.status] }}</span>
              </div>
              <div class="node-time">
                {{ node.created_at }}
                <span v-if="node.processed_at"> → {{ node.processed_at }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 消息提示 -->
    <div v-if="message" class="message" :class="{ success: messageType === 'success', error: messageType === 'error' }">
      {{ message }}
      <button @click="message = ''" class="close-btn">×</button>
    </div>
  </div>
</template>

<script>
import api from '../api/axios'

export default {
  name: 'Application',
  data() {
    return {
      activeTab: 'register',
      tabs: [
        { key: 'register', label: '报名申请' },
        { key: 'adjust', label: '调剂申请' },
        { key: 'cancel', label: '取消申请' },
        { key: 'progress', label: '申请进度' }
      ],
      loading: false,
      message: '',
      messageType: 'success',
      
      // 报名表单
      registrationForm: {
        activity_id: '',
        name: '',
        id_card: '',
        phone: '',
        hospital: '',
        position: '',
        title: ''
      },
      
      // 调剂表单
      adjustmentForm: {
        registration_id: '',
        new_course_id: '',
        reason: ''
      },
      
      // 取消表单
      cancellationForm: {
        registration_id: '',
        reason: ''
      },
      
      // 进度查询
      progressForm: {
        application_id: ''
      },
      
      progressData: null,
      
      // 状态映射
      statusMap: {
        0: '进行中',
        1: '已完成',
        2: '已终止'
      },
      
      typeMap: {
        'registration': '报名申请',
        'adjustment': '调剂申请',
        'cancellation': '取消申请'
      },
      
      nodeStatusMap: {
        0: '待处理',
        1: '通过',
        2: '不通过'
      }
    }
  },
  methods: {
    async submitRegistration() {
      try {
        this.loading = true
        this.message = ''
        
        const response = await api.post('/api/applications/register', this.registrationForm)
        
        this.message = '报名成功！'
        this.messageType = 'success'
        
        // 重置表单
        Object.keys(this.registrationForm).forEach(key => {
          this.registrationForm[key] = ''
        })
        
      } catch (error) {
        this.message = error.message || '报名失败'
        this.messageType = 'error'
      } finally {
        this.loading = false
      }
    },
    
    async submitAdjustment() {
      try {
        this.loading = true
        this.message = ''
        
        const response = await api.post('/api/applications/adjust', this.adjustmentForm)
        
        this.message = '调剂申请已提交，等待审核！'
        this.messageType = 'success'
        
        // 重置表单
        Object.keys(this.adjustmentForm).forEach(key => {
          this.adjustmentForm[key] = ''
        })
        
      } catch (error) {
        this.message = error.message || '调剂申请失败'
        this.messageType = 'error'
      } finally {
        this.loading = false
      }
    },
    
    async submitCancellation() {
      try {
        this.loading = true
        this.message = ''
        
        const response = await api.post('/api/applications/cancel', this.cancellationForm)
        
        this.message = '取消申请已提交，等待审核！'
        this.messageType = 'success'
        
        // 重置表单
        Object.keys(this.cancellationForm).forEach(key => {
          this.cancellationForm[key] = ''
        })
        
      } catch (error) {
        this.message = error.message || '取消申请失败'
        this.messageType = 'error'
      } finally {
        this.loading = false
      }
    },
    
    async getProgress() {
      try {
        this.loading = true
        this.message = ''
        this.progressData = null
        
        const response = await api.get(`/api/applications/${this.progressForm.application_id}/progress`)
        
        this.progressData = response
        
      } catch (error) {
        this.message = error.message || '查询失败'
        this.messageType = 'error'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.application-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.tabs button {
  padding: 10px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.tabs button.active {
  color: #1890ff;
  border-bottom-color: #1890ff;
}

.form-container {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.btn-primary {
  background: #1890ff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #40a9ff;
}

.btn-primary:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
}

.message {
  margin-top: 20px;
  padding: 10px 15px;
  border-radius: 4px;
  position: relative;
}

.message.success {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  color: #52c41a;
}

.message.error {
  background: #fff1f0;
  border: 1px solid #ffccc7;
  color: #ff4d4f;
}

.close-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: inherit;
}

.progress-result {
  margin-top: 20px;
  padding: 15px;
  background: #fafafa;
  border-radius: 4px;
}

.progress-info p {
  margin: 5px 0;
}

.nodes-list {
  margin-top: 15px;
}

.node-item {
  padding: 10px;
  margin-bottom: 10px;
  background: #fff;
  border-radius: 4px;
  border-left: 3px solid #d9d9d9;
}

.node-item.passed {
  border-left-color: #52c41a;
}

.node-item.rejected {
  border-left-color: #ff4d4f;
}

.node-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.node-name {
  font-weight: 500;
}

.node-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  background: #f0f0f0;
}

.node-item.passed .node-status {
  background: #f6ffed;
  color: #52c41a;
}

.node-item.rejected .node-status {
  background: #fff1f0;
  color: #ff4d4f;
}

.node-time {
  font-size: 12px;
  color: #999;
}
</style>
