import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

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
    // 统一处理响应格式
    const data = response.data
    
    // 检查是否是管理后台API的返回格式
    if (data.error) {
      // 管理后台API错误响应
      const error = new Error(data.error || '请求失败')
      throw error
    } else if (data.code === 200) {
      // 普通API成功响应，直接返回data.data
      return data.data
    } else {
      // 其他成功响应，直接返回data
      return data
    }
  },
  error => {
    // 网络错误或其他错误
    let errorMessage = '网络请求失败'
    if (error.response) {
      const data = error.response.data
      errorMessage = data.error || data.message || '服务器错误'
    }
    const err = new Error(errorMessage)
    throw err
  }
)

export default api
