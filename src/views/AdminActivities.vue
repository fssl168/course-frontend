<template>
  <div class="admin-activities-container">
    <h2>医护培训活动管理</h2>
    
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">活动列表</h3>
        <button class="btn btn-success" @click="showCreateModal = true"><i class="fas fa-plus"></i> 创建活动</button>
      </div>
      <div class="card-body">
        <div class="toolbar">
          <div class="search-box">
            <input type="text" class="search-input" v-model="searchKeyword" placeholder="搜索活动名称...">
            <button class="btn btn-primary" @click="searchActivities"><i class="fas fa-search"></i> 搜索</button>
          </div>
        </div>
        
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>活动名称</th>
                <th>活动日期</th>
                <th>活动时间</th>
                <th>活动地点</th>
                <th>报名人数</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredActivities.length === 0">
                <td colspan="7" class="empty-state">
                  <i class="fas fa-calendar-alt"></i>
                  <p>暂无活动数据</p>
                </td>
              </tr>
              <tr v-for="activity in paginatedActivities" :key="activity.id">
                <td>{{ activity.title }}</td>
                <td>{{ formatDate(activity.date) }}</td>
                <td>{{ activity.time || '-' }}</td>
                <td>{{ activity.location || '-' }}</td>
                <td>{{ activity.registration_count }}</td>
                <td>
                  <span :class="['status-tag', activity.status === 1 ? 'status-active' : 'status-inactive']">
                    {{ activity.status === 1 ? '进行中' : '已结束' }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-primary btn-sm" @click="viewDetail(activity)" title="查看详情">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn btn-success btn-sm" @click="viewRegistrations(activity)" title="查看报名">
                    <i class="fas fa-list"></i>
                  </button>
                  <button class="btn btn-danger btn-sm" @click="deleteActivity(activity)" title="删除活动">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="pagination" v-if="totalPages > 1">
          <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">上一页</button>
          <span>第 {{ currentPage }} / {{ totalPages }} 页</span>
          <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">下一页</button>
        </div>
      </div>
    </div>

    <!-- 创建活动模态框 -->
    <div class="modal" v-if="showCreateModal" @click="closeCreateModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">创建活动</h3>
          <button class="modal-close" @click="closeCreateModal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createActivity">
            <div class="form-group">
              <label>活动名称</label>
              <input type="text" v-model="activityForm.title" placeholder="请输入活动名称" required>
            </div>
            <div class="form-group">
              <label>活动描述</label>
              <textarea v-model="activityForm.description" placeholder="请输入活动描述" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label>活动日期</label>
              <input type="date" v-model="activityForm.date" required>
            </div>
            <div class="form-group">
              <label>活动时间</label>
              <input type="time" v-model="activityForm.time">
            </div>
            <div class="form-group">
              <label>活动地点</label>
              <input type="text" v-model="activityForm.location" placeholder="请输入活动地点">
            </div>
            <div class="form-group">
              <label>活动容量</label>
              <input type="number" v-model="activityForm.capacity" placeholder="请输入活动容量" min="1">
            </div>
            <div class="form-group">
              <label>报名开始时间</label>
              <input type="datetime-local" v-model="activityForm.registration_start" required>
            </div>
            <div class="form-group">
              <label>报名结束时间</label>
              <input type="datetime-local" v-model="activityForm.registration_end" required>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn" style="background: #fff; border: 1px solid #dcdfe6; color: #606266;" @click="closeCreateModal">取消</button>
              <button type="submit" class="btn btn-primary">创建活动</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 活动详情模态框 -->
    <div class="modal" v-if="showDetailModal" @click="closeDetailModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">活动详情</h3>
          <button class="modal-close" @click="closeDetailModal">&times;</button>
        </div>
        <div class="modal-body" v-if="selectedActivity">
          <div class="detail-row">
            <div class="detail-label">活动名称</div>
            <div class="detail-value">{{ selectedActivity.title }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">活动描述</div>
            <div class="detail-value">{{ selectedActivity.description || '-' }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">活动日期</div>
            <div class="detail-value">{{ formatDate(selectedActivity.date) }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">活动时间</div>
            <div class="detail-value">{{ selectedActivity.time || '-' }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">活动地点</div>
            <div class="detail-value">{{ selectedActivity.location || '-' }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">活动容量</div>
            <div class="detail-value">{{ selectedActivity.capacity }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">报名人数</div>
            <div class="detail-value">{{ selectedActivity.registration_count }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">报名开始时间</div>
            <div class="detail-value">{{ formatDateTime(selectedActivity.registration_start) }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">报名结束时间</div>
            <div class="detail-value">{{ formatDateTime(selectedActivity.registration_end) }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">状态</div>
            <div class="detail-value">{{ selectedActivity.status === 1 ? '进行中' : '已结束' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/axios'

export default {
  name: 'AdminActivities',
  data() {
    return {
      activities: [],
      searchKeyword: '',
      currentPage: 1,
      pageSize: 10,
      showCreateModal: false,
      showDetailModal: false,
      selectedActivity: null,
      activityForm: {
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        capacity: 50,
        registration_start: '',
        registration_end: ''
      },
      loading: false
    }
  },
  computed: {
    filteredActivities() {
      if (!this.searchKeyword) {
        return this.activities
      }
      return this.activities.filter(a => a.title.includes(this.searchKeyword))
    },
    paginatedActivities() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredActivities.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredActivities.length / this.pageSize)
    }
  },
  mounted() {
    this.loadActivities()
  },
  methods: {
    async loadActivities() {
      this.loading = true
      try {
        const response = await api.get('/api/admin/medical/activities')
        this.activities = response.activities || []
      } catch (error) {
        console.error('加载活动数据失败:', error)
      } finally {
        this.loading = false
      }
    },
    searchActivities() {
      this.currentPage = 1
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return
      this.currentPage = page
    },
    viewDetail(activity) {
      this.selectedActivity = activity
      this.showDetailModal = true
    },
    closeDetailModal() {
      this.showDetailModal = false
      this.selectedActivity = null
    },
    closeCreateModal() {
      this.showCreateModal = false
      this.resetActivityForm()
    },
    resetActivityForm() {
      this.activityForm = {
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        capacity: 50,
        registration_start: '',
        registration_end: ''
      }
    },
    async createActivity() {
      this.loading = true
      try {
        // 格式化日期和时间
        const formData = {
          ...this.activityForm,
          date: this.formatDateForBackend(this.activityForm.date),
          registration_start: this.formatDateTimeForBackend(this.activityForm.registration_start),
          registration_end: this.formatDateTimeForBackend(this.activityForm.registration_end)
        }
        
        await api.post('/api/admin/medical/activities', formData)
        alert('活动创建成功')
        this.closeCreateModal()
        this.loadActivities()
      } catch (error) {
        console.error('创建活动失败:', error)
        alert('创建活动失败：' + (error.message || '请重试'))
      } finally {
        this.loading = false
      }
    },
    async deleteActivity(activity) {
      if (!confirm('确定要删除这个活动吗？删除后相关的报名信息也会被删除。')) {
        return
      }
      this.loading = true
      try {
        await api.delete(`/api/admin/medical/activities/${activity.id}`)
        alert('活动删除成功')
        this.loadActivities()
      } catch (error) {
        console.error('删除活动失败:', error)
        alert('删除活动失败，请重试')
      } finally {
        this.loading = false
      }
    },
    viewRegistrations(activity) {
      // 跳转到报名管理页面，并传递活动ID
      this.$router.push({
        path: '/admin/medical/registrations',
        query: { activity_id: activity.id }
      })
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN')
    },
    formatDateTime(dateTimeString) {
      if (!dateTimeString) return ''
      const date = new Date(dateTimeString)
      return date.toLocaleString('zh-CN')
    },
    formatDateForBackend(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toISOString().split('T')[0]
    },
    formatDateTimeForBackend(dateTimeString) {
      if (!dateTimeString) return ''
      const date = new Date(dateTimeString)
      return date.toISOString().replace('T', ' ').substring(0, 19)
    }
  }
}
</script>

<style scoped>
.admin-activities-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.card-body {
  padding: 20px;
}

.toolbar {
  margin-bottom: 20px;
}

.search-box {
  display: flex;
  gap: 10px;
}

.search-input {
  flex: 1;
  max-width: 400px;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #409eff;
  color: #fff;
  border: 1px solid #409eff;
}

.btn-primary:hover {
  background: #66b1ff;
  border-color: #66b1ff;
}

.btn-success {
  background: #67c23a;
  color: #fff;
  border: 1px solid #67c23a;
}

.btn-success:hover {
  background: #85ce61;
  border-color: #85ce61;
}

.btn-danger {
  background: #f56c6c;
  color: #fff;
  border: 1px solid #f56c6c;
}

.btn-danger:hover {
  background: #f78989;
  border-color: #f78989;
}

.btn-sm {
  padding: 4px 12px;
  font-size: 12px;
  margin-right: 5px;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ebeef5;
}

th {
  background: #f5f7fa;
  font-weight: 600;
  color: #303133;
}

tr:hover {
  background: #f5f7fa;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #909399;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 10px;
  display: block;
}

.status-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.status-active {
  background: #f0f9eb;
  color: #67c23a;
}

.status-inactive {
  background: #fef0f0;
  color: #f56c6c;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination button {
  padding: 4px 12px;
  border: 1px solid #dcdfe6;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  color: #c0c4cc;
  cursor: not-allowed;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #909399;
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
  color: #606266;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.detail-row {
  display: flex;
  margin-bottom: 10px;
}

.detail-label {
  width: 120px;
  font-weight: 500;
  color: #606266;
}

.detail-value {
  flex: 1;
  color: #303133;
}
</style>