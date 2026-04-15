<template>
  <div class="admin-page">
    <div class="page-header">
      <h1 class="page-title">公共培训报名管理</h1>
    </div>

    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-value">{{ totalCount }}</div>
        <div class="stat-label">总报名人数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ activeCount }}</div>
        <div class="stat-label">有效报名</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ cancelledCount }}</div>
        <div class="stat-label">已取消</div>
      </div>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="toolbar">
          <div class="search-box">
            <input type="text" class="search-input" v-model="searchKeyword" placeholder="搜索姓名、手机号...">
            <button class="btn btn-primary" @click="search"><i class="fas fa-search"></i> 搜索</button>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>姓名</th>
                <th>手机号</th>
                <th>医院</th>
                <th>活动名称</th>
                <th>报名时间</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredData.length === 0">
                <td colspan="7" class="empty-state">
                  <i class="fas fa-clipboard-list"></i>
                  <p>暂无报名数据</p>
                </td>
              </tr>
              <tr v-for="item in paginatedData" :key="item.id">
                <td>{{ item.name || '-' }}</td>
                <td>{{ item.phone || '-' }}</td>
                <td>{{ item.hospital || '-' }}</td>
                <td>{{ item.activity_title || '-' }}</td>
                <td>{{ formatDateTime(item.create_time) }}</td>
                <td>
                  <span :class="['status-tag', item.status === 1 ? 'status-active' : 'status-cancelled']">
                    {{ item.status === 1 ? '已报名' : '已取消' }}
                  </span>
                </td>
                <td>
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
  </div>
</template>

<script>
import api from '../api/axios'

export default {
  name: 'AdminPublicRegistrations',
  data() {
    return {
      registrations: [],
      searchKeyword: '',
      currentPage: 1,
      pageSize: 10,
      loading: false
    }
  },
  computed: {
    filteredData() {
      if (!this.searchKeyword) {
        return this.registrations
      }
      return this.registrations.filter(item => 
        (item.name && item.name.includes(this.searchKeyword)) ||
        (item.phone && item.phone.includes(this.searchKeyword))
      )
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
      return this.registrations.length
    },
    activeCount() {
      return this.registrations.filter(item => item.status === 1).length
    },
    cancelledCount() {
      return this.registrations.filter(item => item.status === 0).length
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true
      try {
        const response = await api.get('/api/admin/public/registrations')
        this.registrations = response.registrations || []
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

.status-cancelled {
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
</style>