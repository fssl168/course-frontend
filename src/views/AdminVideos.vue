<template>
  <div class="admin-page">
    <div class="page-header">
      <h1 class="page-title">视频管理</h1>
    </div>

    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-value">{{ totalCount }}</div>
        <div class="stat-label">总视频数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ courseCount }}</div>
        <div class="stat-label">课程视频</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ activityCount }}</div>
        <div class="stat-label">活动视频</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="card-title">视频列表</h3>
        <button class="btn btn-success" @click="showUploadModal = true"><i class="fas fa-upload"></i> 上传视频</button>
      </div>
      <div class="card-body">
        <div class="toolbar">
          <div class="search-box">
            <input type="text" class="search-input" v-model="searchKeyword" placeholder="搜索视频名称...">
            <button class="btn btn-primary" @click="search"><i class="fas fa-search"></i> 搜索</button>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>视频名称</th>
                <th>视频类型</th>
                <th>时长</th>
                <th>上传时间</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredData.length === 0">
                <td colspan="6" class="empty-state">
                  <i class="fas fa-video"></i>
                  <p>暂无视频数据</p>
                </td>
              </tr>
              <tr v-for="item in paginatedData" :key="item.id">
                <td>{{ item.title || '-' }}</td>
                <td>
                  <span :class="['status-tag', item.type === 1 ? 'status-course' : 'status-activity']">
                    {{ item.type === 1 ? '课程视频' : '活动视频' }}
                  </span>
                </td>
                <td>{{ item.duration || '-' }}</td>
                <td>{{ formatDateTime(item.create_time) }}</td>
                <td>
                  <span :class="['status-tag', item.status === 1 ? 'status-active' : 'status-inactive']">
                    {{ item.status === 1 ? '已发布' : '未发布' }}
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
  </div>
</template>

<script>
import api from '../api/axios'

export default {
  name: 'AdminVideos',
  data() {
    return {
      videos: [],
      searchKeyword: '',
      currentPage: 1,
      pageSize: 10,
      showUploadModal: false,
      loading: false
    }
  },
  computed: {
    filteredData() {
      if (!this.searchKeyword) {
        return this.videos
      }
      return this.videos.filter(item => item.title && item.title.includes(this.searchKeyword))
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
      return this.videos.length
    },
    courseCount() {
      return this.videos.filter(item => item.type === 1).length
    },
    activityCount() {
      return this.videos.filter(item => item.type === 0).length
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true
      try {
        const response = await api.get('/api/admin/videos')
        this.videos = response.videos || []
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
    async deleteItem(item) {
      if (!confirm('确定要删除这个视频吗？')) return
      this.loading = true
      try {
        await api.delete(`/api/admin/videos/${item.id}`)
        alert('视频删除成功')
        this.loadData()
      } catch (error) {
        console.error('删除视频失败:', error)
        alert('删除视频失败，请重试')
      } finally {
        this.loading = false
      }
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

.status-course {
  background: #e6f7ff;
  color: #1890ff;
}

.status-activity {
  background: #f6ffed;
  color: #52c41a;
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
</style>