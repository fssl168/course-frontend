<template>
  <div class="admin-page">
    <div class="page-header">
      <h1 class="page-title">调剂申请管理</h1>
    </div>

    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-value">{{ totalCount }}</div>
        <div class="stat-label">总申请数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ pendingCount }}</div>
        <div class="stat-label">待审核</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ approvedCount }}</div>
        <div class="stat-label">已通过</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ rejectedCount }}</div>
        <div class="stat-label">已拒绝</div>
      </div>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="toolbar">
          <div class="search-box">
            <input type="text" class="search-input" v-model="searchKeyword" placeholder="搜索姓名、手机号、原课程...">
            <button class="btn btn-primary" @click="search"><i class="fas fa-search"></i> 搜索</button>
          </div>
          <div class="filter-box">
            <select class="filter-select" v-model="filterStatus">
              <option value="">全部状态</option>
              <option value="0">待审核</option>
              <option value="1">已通过</option>
              <option value="2">已拒绝</option>
            </select>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>姓名</th>
                <th>手机号</th>
                <th>医院</th>
                <th>原课程</th>
                <th>调剂课程</th>
                <th>调剂原因</th>
                <th>申请时间</th>
                <th>审核状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredData.length === 0">
                <td colspan="9" class="empty-state">
                  <i class="fas fa-inbox"></i>
                  <p>暂无调剂申请</p>
                </td>
              </tr>
              <tr v-for="item in paginatedData" :key="item.id">
                <td>{{ item.name || '-' }}</td>
                <td>{{ item.phone || '-' }}</td>
                <td>{{ item.hospital || '-' }}</td>
                <td>{{ item.original_activity || '-' }}</td>
                <td>{{ item.new_activity || '-' }}</td>
                <td>{{ item.reason || '-' }}</td>
                <td>{{ formatDateTime(item.create_time) }}</td>
                <td>
                  <span :class="['status-tag', getStatusClass(item.status)]">
                    {{ getStatusText(item.status) }}
                  </span>
                </td>
                <td>
                  <button v-if="item.status === 0" class="btn btn-success btn-sm" @click="audit(item, 1)">
                    <i class="fas fa-check"></i> 通过
                  </button>
                  <button v-if="item.status === 0" class="btn btn-danger btn-sm" @click="audit(item, 2)">
                    <i class="fas fa-times"></i> 拒绝
                  </button>
                  <button class="btn btn-primary btn-sm" @click="viewDetail(item)">
                    <i class="fas fa-eye"></i> 详情
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

    <!-- 详情模态框 -->
    <div class="modal" v-if="showDetailModal" @click="closeDetailModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">调剂申请详情</h3>
          <button class="modal-close" @click="closeDetailModal">&times;</button>
        </div>
        <div class="modal-body" v-if="selectedItem">
          <div class="detail-row">
            <div class="detail-label">学员姓名</div>
            <div class="detail-value">{{ selectedItem.name }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">身份证号</div>
            <div class="detail-value">{{ selectedItem.id_card || '-' }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">手机号</div>
            <div class="detail-value">{{ selectedItem.phone }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">医院</div>
            <div class="detail-value">{{ selectedItem.hospital || '-' }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">职务</div>
            <div class="detail-value">{{ selectedItem.position || '-' }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">职称</div>
            <div class="detail-value">{{ selectedItem.title || '-' }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">原课程</div>
            <div class="detail-value">{{ selectedItem.original_activity }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">调剂课程</div>
            <div class="detail-value">{{ selectedItem.new_activity }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">调剂原因</div>
            <div class="detail-value">{{ selectedItem.reason || '-' }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">申请时间</div>
            <div class="detail-value">{{ formatDateTime(selectedItem.create_time) }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">审核状态</div>
            <div class="detail-value">
              <span :class="['status-tag', getStatusClass(selectedItem.status)]">
                {{ getStatusText(selectedItem.status) }}
              </span>
            </div>
          </div>
          <div class="detail-row" v-if="selectedItem.audit_reason">
            <div class="detail-label">审核意见</div>
            <div class="detail-value">{{ selectedItem.audit_reason }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/axios'

export default {
  name: 'AdminAdjustments',
  data() {
    return {
      adjustments: [],
      searchKeyword: '',
      filterStatus: '',
      currentPage: 1,
      pageSize: 10,
      showDetailModal: false,
      selectedItem: null,
      loading: false
    }
  },
  computed: {
    filteredData() {
      let data = this.adjustments
      if (this.searchKeyword) {
        data = data.filter(item => 
          (item.name && item.name.includes(this.searchKeyword)) ||
          (item.phone && item.phone.includes(this.searchKeyword)) ||
          (item.original_activity && item.original_activity.includes(this.searchKeyword))
        )
      }
      if (this.filterStatus !== '') {
        data = data.filter(item => item.status === parseInt(this.filterStatus))
      }
      return data
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
      return this.adjustments.length
    },
    pendingCount() {
      return this.adjustments.filter(item => item.status === 0).length
    },
    approvedCount() {
      return this.adjustments.filter(item => item.status === 1).length
    },
    rejectedCount() {
      return this.adjustments.filter(item => item.status === 2).length
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true
      try {
        const response = await api.get('/api/admin/medical/adjustments')
        this.adjustments = response.adjustments || []
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
    closeDetailModal() {
      this.showDetailModal = false
      this.selectedItem = null
    },
    async audit(item, status) {
      const confirmText = status === 1 ? '通过' : '拒绝'
      if (!confirm(`确定要${confirmText}该调剂申请吗？`)) return

      this.loading = true
      try {
        await api.post(`/api/admin/medical/adjustments/${item.id}/audit`, {
          status: status,
          audit_reason: status === 2 ? '审核不通过' : ''
        })
        alert(`审核已${confirmText}`)
        this.loadData()
      } catch (error) {
        console.error('审核失败:', error)
        alert('审核失败，请重试')
      } finally {
        this.loading = false
      }
    },
    getStatusClass(status) {
      const map = {
        0: 'status-pending',
        1: 'status-success',
        2: 'status-danger'
      }
      return map[status] || ''
    },
    getStatusText(status) {
      const map = {
        0: '待审核',
        1: '已通过',
        2: '已拒绝'
      }
      return map[status] || '未知'
    },
    formatDateTime(dateTimeString) {
      if (!dateTimeString) return ''
      const date = new Date(dateTimeString)
      return date.toLocaleString('zh-CN')
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
  grid-template-columns: repeat(4, 1fr);
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

.filter-select {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  cursor: pointer;
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
  background: #52c41a;
  color: white;
}

.btn-success:hover {
  background: #73d13d;
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

.status-pending {
  background: #fff7e6;
  color: #fa8c16;
}

.status-success {
  background: #f6ffed;
  color: #52c41a;
}

.status-danger {
  background: #fff1f0;
  color: #ff4d4f;
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

.detail-row {
  display: flex;
  margin-bottom: 16px;
}

.detail-label {
  width: 100px;
  font-weight: 500;
  color: #666;
  flex-shrink: 0;
}

.detail-value {
  flex: 1;
  color: #333;
}
</style>