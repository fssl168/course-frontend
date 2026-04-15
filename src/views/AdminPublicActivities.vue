<template>
  <div class="admin-page">
    <div class="page-header">
      <h1 class="page-title">公共培训活动管理</h1>
    </div>

    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-value">{{ totalCount }}</div>
        <div class="stat-label">总活动数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ activeCount }}</div>
        <div class="stat-label">进行中</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ registrationCount }}</div>
        <div class="stat-label">总报名人数</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="card-title">活动列表</h3>
        <button class="btn btn-success" @click="showCreateModal = true"><i class="fas fa-plus"></i> 创建活动</button>
      </div>
      <div class="card-body">
        <div class="toolbar">
          <div class="search-box">
            <input type="text" class="search-input" v-model="searchKeyword" placeholder="搜索活动名称...">
            <button class="btn btn-primary" @click="search"><i class="fas fa-search"></i> 搜索</button>
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
              <tr v-if="filteredData.length === 0">
                <td colspan="7" class="empty-state">
                  <i class="fas fa-calendar-alt"></i>
                  <p>暂无活动数据</p>
                </td>
              </tr>
              <tr v-for="item in paginatedData" :key="item.id">
                <td>{{ item.title || '-' }}</td>
                <td>{{ formatDate(item.date) }}</td>
                <td>{{ item.time || '-' }}</td>
                <td>{{ item.location || '-' }}</td>
                <td>{{ item.registration_count || 0 }}</td>
                <td>
                  <span :class="['status-tag', item.status === 1 ? 'status-active' : 'status-inactive']">
                    {{ item.status === 1 ? '进行中' : '已结束' }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-primary btn-sm" @click="viewDetail(item)">
                    <i class="fas fa-eye"></i> 详情
                  </button>
                  <button class="btn btn-danger btn-sm" @click="deleteItem(item)">
                    <i class="fas fa-trash"></i> 删除
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
          <form @submit.prevent="createItem">
            <div class="form-group">
              <label>活动名称</label>
              <input type="text" v-model="form.title" placeholder="请输入活动名称" required>
            </div>
            <div class="form-group">
              <label>活动描述</label>
              <textarea v-model="form.description" placeholder="请输入活动描述" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label>活动日期</label>
              <input type="date" v-model="form.date" required>
            </div>
            <div class="form-group">
              <label>活动时间</label>
              <input type="time" v-model="form.time">
            </div>
            <div class="form-group">
              <label>活动地点</label>
              <input type="text" v-model="form.location" placeholder="请输入活动地点">
            </div>
            <div class="form-group">
              <label>活动容量</label>
              <input type="number" v-model="form.capacity" placeholder="请输入活动容量" min="1">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn" style="background: #fff; border: 1px solid #dcdfe6; color: #606266;" @click="closeCreateModal">取消</button>
              <button type="submit" class="btn btn-primary">创建活动</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/axios'

export default {
  name: 'AdminPublicActivities',
  data() {
    return {
      items: [],
      searchKeyword: '',
      currentPage: 1,
      pageSize: 10,
      showCreateModal: false,
      form: {
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
    filteredData() {
      if (!this.searchKeyword) {
        return this.items
      }
      return this.items.filter(item => item.title && item.title.includes(this.searchKeyword))
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredData.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.pageSize)
    },
    totalCount() {
      return this.items.length
    },
    activeCount() {
      return this.items.filter(item => item.status === 1).length
    },
    registrationCount() {
      return this.items.reduce((sum, item) => sum + (item.registration_count || 0), 0)
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true
      try {
        const response = await api.get('/api/admin/public/activities')
        this.items = response.activities || []
      } catch (error) {
        console.error('加载数据失败:', error)
      } finally {
        this.loading = false
      }
    },
    search() {
      this.currentPage = 1
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return
      this.currentPage = page
    },
    viewDetail(item) {
      this.selectedItem = item
      this.showDetailModal = true
    },
    closeCreateModal() {
      this.showCreateModal = false
      this.resetForm()
    },
    resetForm() {
      this.form = {
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
    async createItem() {
      this.loading = true
      try {
        const formData = {
          ...this.form,
          date: this.formatDateForBackend(this.form.date),
          registration_start: this.formatDateTimeForBackend(this.form.registration_start),
          registration_end: this.formatDateTimeForBackend(this.form.registration_end)
        }
        await api.post('/api/admin/public/activities', formData)
        alert('活动创建成功')
        this.closeCreateModal()
        this.loadData()
      } catch (error) {
        console.error('创建活动失败:', error)
        alert('创建活动失败：' + (error.message || '请重试'))
      } finally {
        this.loading = false
      }
    },
    async deleteItem(item) {
      if (!confirm('确定要删除这个活动吗？')) return
      this.loading = true
      try {
        await api.delete(`/api/admin/public/activities/${item.id}`)
        alert('活动删除成功')
        this.loadData()
      } catch (error) {
        console.error('删除活动失败:', error)
        alert('删除活动失败，请重试')
      } finally {
        this.loading = false
      }
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN')
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

.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
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
  color: #333;
  margin: 0;
}

.card-body {
  padding: 24px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-box {
  display: flex;
  gap: 8px;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  width: 300px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-primary {
  background: #1890ff;
  color: white;
}

.btn-primary:hover {
  background: #40a9ff;
}

.btn-success {
  background: #67c23a;
  color: white;
}

.btn-success:hover {
  background: #85ce61;
}

.btn-danger {
  background: #ff4d4f;
  color: white;
}

.btn-danger:hover {
  background: #ff7875;
}

.btn-sm {
  padding: 4px 12px;
  font-size: 13px;
  margin-right: 4px;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

th {
  background: #fafafa;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

td {
  font-size: 14px;
  color: #666;
}

tr:hover {
  background: #fafafa;
}

.empty-state {
  text-align: center;
  padding: 60px 0 !important;
  color: #999;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
}

.status-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-active {
  background: #f0f9eb;
  color: #67c23a;
}

.status-inactive {
  background: #f5f5f5;
  color: #999;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
}

.pagination button {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.pagination button:hover:not(:disabled) {
  border-color: #1890ff;
  color: #1890ff;
}

.pagination button:disabled {
  color: #d9d9d9;
  cursor: not-allowed;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
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
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.modal-body {
  padding: 24px;
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
  border: 1px solid #d9d9d9;
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
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>