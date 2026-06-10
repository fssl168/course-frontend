import axios from 'axios'

// 创建axios实例
const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 页面访问日志上报（异步，不阻塞主流程）
function reportPageView(pageTitle) {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    const data = {
      path: window.location.pathname,
      method: 'GET',
      page_title: pageTitle || document.title,
      referer: document.referrer,
      user_id: user?.id || user?.user_id || null
    }
    // 使用 navigator.sendBeacon 优先（页面卸载时也能发送）
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
      navigator.sendBeacon('/api/access-logs', blob)
    } else {
      // 降级使用 fetch
      fetch('/api/access-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true
      }).catch(() => {})
    }
  } catch (e) {
    // 日志上报失败不影响业务
  }
}

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 从localStorage中获取token
    const token = localStorage.getItem('token')
    // 如果token存在，添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    // 统一返回 response.data（即后端返回的 JSON 对象）
    return response.data
  },
  error => {
    if (error.response && error.response.status === 401) {
      // Token 过期或无效，清除登录状态并跳转到登录页
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // 避免在登录页重复跳转
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    let errorMessage = '网络请求失败'
    if (error.response) {
      const data = error.response.data
      errorMessage = data.error || data.message || '服务器错误'
    }
    const err = new Error(errorMessage)
    throw err
  }
)

export { reportPageView }
export default api
