<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1 class="page-title">欢迎使用管理后台</h1>
      <p class="page-description">院前急救培训平台 - 医护培训管理系统</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card primary">
        <div class="stat-icon">
          <i class="fas fa-calendar-alt"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.activities }}</div>
          <div class="stat-label">进行中活动</div>
        </div>
      </div>

      <div class="stat-card success">
        <div class="stat-icon">
          <i class="fas fa-clipboard-list"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.registrations }}</div>
          <div class="stat-label">总报名人数</div>
        </div>
      </div>

      <div class="stat-card warning">
        <div class="stat-icon">
          <i class="fas fa-user-clock"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.pendingCancellations }}</div>
          <div class="stat-label">待审核取消</div>
        </div>
      </div>

      <div class="stat-card info">
        <div class="stat-icon">
          <i class="fas fa-exchange-alt"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.pendingAdjustments }}</div>
          <div class="stat-label">待审核调剂</div>
        </div>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="quick-actions">
      <h2 class="section-title">快捷操作</h2>
      <div class="action-grid">
        <router-link to="/admin/medical/activities" class="action-card">
          <div class="action-icon">
            <i class="fas fa-plus-circle"></i>
          </div>
          <div class="action-label">发布活动</div>
        </router-link>
        <router-link to="/admin/medical/registrations" class="action-card">
          <div class="action-icon">
            <i class="fas fa-list"></i>
          </div>
          <div class="action-label">报名管理</div>
        </router-link>
        <router-link to="/admin/medical/cancellations" class="action-card">
          <div class="action-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="action-label">取消审核</div>
        </router-link>
        <router-link to="/admin/medical/adjustments" class="action-card">
          <div class="action-icon">
            <i class="fas fa-random"></i>
          </div>
          <div class="action-label">调剂审核</div>
        </router-link>
      </div>
    </div>

    <!-- 待办事项 -->
    <div class="todo-section">
      <h2 class="section-title">待办事项</h2>
      <div class="todo-list">
        <div class="todo-item" v-if="stats.pendingCancellations > 0">
          <div class="todo-icon warning">
            <i class="fas fa-exclamation-circle"></i>
          </div>
          <div class="todo-content">
            <div class="todo-title">待审核取消申请</div>
            <div class="todo-desc">有 {{ stats.pendingCancellations }} 个取消报名待审核</div>
          </div>
          <router-link to="/admin/medical/cancellations" class="todo-link">
            去处理 <i class="fas fa-arrow-right"></i>
          </router-link>
        </div>
        <div class="todo-item" v-if="stats.pendingAdjustments > 0">
          <div class="todo-icon warning">
            <i class="fas fa-exclamation-circle"></i>
          </div>
          <div class="todo-content">
            <div class="todo-title">待审核调剂申请</div>
            <div class="todo-desc">有 {{ stats.pendingAdjustments }} 个调剂申请待审核</div>
          </div>
          <router-link to="/admin/medical/adjustments" class="todo-link">
            去处理 <i class="fas fa-arrow-right"></i>
          </router-link>
        </div>
        <div class="todo-item" v-if="stats.pendingCancellations === 0 && stats.pendingAdjustments === 0">
          <div class="todo-icon success">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="todo-content">
            <div class="todo-title">暂无待办事项</div>
            <div class="todo-desc">所有申请已处理完毕</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 流程指引 -->
    <div class="workflow-section">
      <h2 class="section-title">业务流程指引</h2>
      <div class="workflow-steps">
        <div class="workflow-step">
          <div class="step-number">1</div>
          <div class="step-content">
            <div class="step-title">发布课程</div>
            <div class="step-desc">管理员发布医护培训课程，设置时间、地点、容量等信息</div>
          </div>
        </div>
        <div class="workflow-step">
          <div class="step-number">2</div>
          <div class="step-content">
            <div class="step-title">生成二维码</div>
            <div class="step-desc">系统自动生成专属报名二维码，支持医护扫码报名</div>
          </div>
        </div>
        <div class="workflow-step">
          <div class="step-number">3</div>
          <div class="step-content">
            <div class="step-title">报名审核</div>
            <div class="step-desc">系统自动校验报名资格，管理员进行最终审核</div>
          </div>
        </div>
        <div class="workflow-step">
          <div class="step-number">4</div>
          <div class="step-content">
            <div class="step-title">调剂处理</div>
            <div class="step-desc">处理学员调剂申请，根据课程容量进行审核</div>
          </div>
        </div>
        <div class="workflow-step">
          <div class="step-number">5</div>
          <div class="step-content">
            <div class="step-title">取消管理</div>
            <div class="step-desc">审核取消报名申请，更新课程容量</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/axios'

export default {
  name: 'AdminDashboard',
  data() {
    return {
      stats: {
        activities: 0,
        registrations: 0,
        pendingCancellations: 0,
        pendingAdjustments: 0
      },
      loading: false
    }
  },
  mounted() {
    this.loadStats()
  },
  methods: {
    async loadStats() {
      this.loading = true
      try {
        // 加载活动统计
        const activitiesRes = await api.get('/api/admin/medical/activities')
        this.stats.activities = (activitiesRes.activities || []).filter(a => a.status === 1).length

        // 加载报名统计
        const registrationsRes = await api.get('/api/admin/medical/registrations')
        this.stats.registrations = (registrationsRes.registrations || []).filter(r => r.status === 1).length

        // 加载取消统计
        const cancellationsRes = await api.get('/api/admin/medical/cancellations')
        this.stats.pendingCancellations = (cancellationsRes.cancellations || []).filter(c => c.audit_status === 0).length

        // 加载调剂统计
        const adjustmentsRes = await api.get('/api/admin/medical/adjustments')
        this.stats.pendingAdjustments = (adjustmentsRes.adjustments || []).filter(a => a.status === 0).length
      } catch (error) {
        console.error('加载统计数据失败:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  padding: 0;
}

.dashboard-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px;
}

.page-description {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
}

.stat-card.primary .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card.success .stat-icon {
  background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
}

.stat-card.warning .stat-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-card.info .stat-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px;
}

.quick-actions {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
  background: #fafafa;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s;
  cursor: pointer;
}

.action-card:hover {
  background: #e6f7ff;
  transform: translateY(-2px);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #1890ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 12px;
}

.action-label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.todo-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  border-left: 4px solid #faad14;
}

.todo-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.todo-icon.warning {
  background: #fff7e6;
  color: #fa8c16;
}

.todo-icon.success {
  background: #f6ffed;
  color: #52c41a;
}

.todo-content {
  flex: 1;
}

.todo-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.todo-desc {
  font-size: 13px;
  color: #666;
}

.todo-link {
  color: #1890ff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.3s;
}

.todo-link:hover {
  color: #40a9ff;
}

.workflow-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.workflow-steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.workflow-step {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.step-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #1890ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.step-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

@media (max-width: 1200px) {
  .stats-grid,
  .action-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-grid,
  .action-grid {
    grid-template-columns: 1fr;
  }
}
</style>