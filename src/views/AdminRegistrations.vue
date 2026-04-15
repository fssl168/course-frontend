<template>
  <div class="admin-registrations-container">
    <h2>医护培训报名信息</h2>
    
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
      <div class="card-header">
        <h3 class="card-title">报名列表</h3>
        <button class="btn btn-success" @click="exportData"><i class="fas fa-download"></i> 导出数据</button>
      </div>
      <div class="card-body">
        <div class="toolbar">
          <div class="search-box">
            <input type="text" class="search-input" v-model="searchKeyword" placeholder="搜索姓名、手机号、医院...">
            <button class="btn btn-primary" @click="searchRegistrations"><i class="fas fa-search"></i> 搜索</button>
          </div>
        </div>
        
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>姓名</th>
                <th>性别</th>
                <th>手机号</th>
                <th>医院</th>
                <th>培训名称</th>
                <th>参加班级</th>
                <th>报名时间</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredRegistrations.length === 0">
                <td colspan="9" class="empty-state">
                  <i class="fas fa-clipboard-list"></i>
                  <p>暂无报名数据</p>
                </td>
              </tr>
              <tr v-for="reg in paginatedRegistrations" :key="reg.id">
                <td>{{ reg.name || '-' }}</td>
                <td>{{ reg.gender === 1 ? '男' : reg.gender === 0 ? '女' : '-' }}</td>
                <td>{{ reg.phone || '-' }}</td>
                <td>{{ reg.hospital || '-' }}</td>
                <td>{{ reg.activity_title || '-' }}</td>
                <td>{{ reg.class_name || '<span style="color:#909399">未分配</span>' }}</td>
                <td>{{ formatDate(reg.create_time) }}</td>
                <td>
                  <span :class="['status-tag', reg.status === 1 ? 'status-registered' : 'status-cancelled']">
                    {{ reg.status === 1 ? '已报名' : '已取消' }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-primary btn-sm" @click="viewDetail(reg)" title="查看详情">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button v-if="reg.status === 1" class="btn btn-danger btn-sm" @click="showCancelModal(reg)" title="取消报名">
                    <i class="fas fa-times"></i>
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

    <div class="modal" v-if="showDetailModal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">报名详情</h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body" v-if="selectedRegistration">
          <div class="detail-row">
            <div class="detail-label">姓名</div>
            <div class="detail-value">{{ selectedRegistration.name || '-' }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">身份证号</div>
            <div class="detail-value">{{ selectedRegistration.id_card || '-' }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">性别</div>
            <div class="detail-value">{{ selectedRegistration.gender === 1 ? '男' : selectedRegistration.gender === 0 ? '女' : '-' }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">手机号</div>
            <div class="detail-value">{{ selectedRegistration.phone || '-' }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">医院</div>
            <div class="detail-value">{{ selectedRegistration.hospital || '-' }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">职务</div>
            <div class="detail-value">{{ selectedRegistration.position || '-' }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">职称</div>
            <div class="detail-value">{{ selectedRegistration.title || '-' }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">培训名称</div>
            <div class="detail-value">{{ selectedRegistration.activity_title || '-' }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">报名时间</div>
            <div class="detail-value">{{ formatDate(selectedRegistration.create_time) }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">状态</div>
            <div class="detail-value">{{ selectedRegistration.status === 1 ? '已报名' : '已取消' }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal" v-if="showCancelModal" @click="closeCancelModal">
      <div class="modal-content" @click.stop style="max-width: 450px;">
        <div class="modal-header">
          <h3 class="modal-title">取消报名确认</h3>
          <button class="modal-close" @click="closeCancelModal">&times;</button>
        </div>
        <div class="modal-body">
          <p style="margin-bottom: 15px; color: #606266;">确定要取消该报名吗？取消后该学员将失去培训资格。</p>
          <div class="form-group">
            <label>学员姓名：<span style="color: #333; font-weight: normal;">{{ selectedRegistration?.name || '' }}</span></label>
          </div>
          <div class="form-group">
            <label>培训名称：<span style="color: #333; font-weight: normal;">{{ selectedRegistration?.activity_title || '' }}</span></label>
          </div>
          <div class="form-group">
            <label>取消原因（选填）</label>
            <textarea class="cancel-reason-input" v-model="cancelReason" placeholder="请输入取消原因..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn" style="background: #fff; border: 1px solid #dcdfe6; color: #606266;" @click="closeCancelModal">取消</button>
          <button class="btn btn-danger" @click="confirmCancel">确认取消报名</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/axios'

export default {
  name: 'AdminRegistrations',
  data() {
    return {
      registrations: [],
      searchKeyword: '',
      currentPage: 1,
      pageSize: 10,
      showDetailModal: false,
      showCancelModal: false,
      selectedRegistration: null,
      cancelReason: '',
      loading: false
    }
  },
  computed: {
    filteredRegistrations() {
      if (!this.searchKeyword) {
        return this.registrations
      }
      return this.registrations.filter(r => 
        (r.name && r.name.includes(this.searchKeyword)) ||
        (r.phone && r.phone.includes(this.searchKeyword)) ||
        (r.hospital && r.hospital.includes(this.searchKeyword))
      )
    },
    paginatedRegistrations() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredRegistrations.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredRegistrations.length / this.pageSize)
    },
    totalCount() {
      return this.registrations.length
    },
    activeCount() {
      return this.registrations.filter(r => r.status === 1).length
    },
    cancelledCount() {
      return this.registrations.filter(r => r.status === 0).length
    }
  },
  mounted() {
    this.loadRegistrations()
  },
  methods: {
    async loadRegistrations() {
      this.loading = true
      try {
        const response = await api.get('/api/admin/medical/registrations')
        this.registrations = response.registrations || []
      } catch (error) {
        console.error('加载报名数据失败:', error)
      } finally {
        this.loading = false
      }
    },
    searchRegistrations() {
      this.currentPage = 1
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return
      this.currentPage = page
    },
    viewDetail(reg) {
      this.selectedRegistration = reg
      this.showDetailModal = true
    },
    closeModal() {
      this.showDetailModal = false
      this.selectedRegistration = null
    },
    showCancelModal(reg) {
      this.selectedRegistration = reg
      this.cancelReason = ''
      this.showCancelModal = true
    },
    closeCancelModal() {
      this.showCancelModal = false
      this.selectedRegistration = null
      this.cancelReason = ''
    },
    async confirmCancel() {
      if (!this.selectedRegistration) return
      
      this.loading = true
      try {
        const cancelReason = this.cancelReason.trim() || '管理员取消'
        
        await api.post(`/api/admin/medical/registrations/${this.selectedRegistration.id}/cancel`, {
          cancel_reason: cancelReason
        })
        
        alert('取消报名成功')
        this.closeCancelModal()
        this.loadRegistrations()
      } catch (error) {
        console.error('取消报名失败:', error)
        alert('取消报名失败，请重试')
      } finally {
        this.loading = false
      }
    },
    exportData() {
      let csv = '\uFEFF姓名,身份证号,性别,手机号,医院,职务,职称,培训名称,报名时间,状态\n'
      this.registrations.forEach(reg => {
        csv += `${reg.name || ''},${reg.id_card || ''},${reg.gender === 1 ? '男' : reg.gender === 0 ? '女' : ''},${reg.phone || ''},${reg.hospital || ''},${reg.position || ''},${reg.title || ''},${reg.activity_title || ''},${this.formatDate(reg.create_time)},${reg.status === 1 ? '已报名' : '已取消'}\n`
      })
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `医护培训报名信息_${new Date().toLocaleDateString()}.csv`
      link.click()
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN')
    }
  }
}
</script>

<style scoped>
.admin-registrations-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.stats-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  flex: 1;
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #409eff;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
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

.status-registered {
  background: #f0f9eb;
  color: #67c23a;
}

.status-cancelled {
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

.detail-row {
  display: flex;
  margin-bottom: 10px;
}

.detail-label {
  width: 100px;
  font-weight: 500;
  color: #606266;
}

.detail-value {
  flex: 1;
  color: #303133;
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

.cancel-reason-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>