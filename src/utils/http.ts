// 封装axios，确保本地网络请求与即将到来的限制兼容

import axios from 'axios'

// 创建axios实例
const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000, // 延长超时时间，提高兼容性
  headers: {
    // 设置标准请求头，确保兼容性
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // 允许携带凭证，确保跨域请求兼容性
  withCredentials: true,
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('github_token')
    
    // 如果有token，添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 确保请求方法符合标准
    if (!config.method) {
      config.method = 'get'
    }
    
    // 确保URL格式正确
    if (config.url && !config.url.startsWith('http') && !config.url.startsWith('/')) {
      config.url = `/${config.url}`
    }
    
    return config
  },
  (error) => {
    // 处理请求错误
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    // 直接返回响应数据，简化使用
    return response
  },
  (error) => {
    // 处理响应错误
    console.error('响应错误:', error)
    
    // 处理不同类型的错误
    if (error.response) {
      // 服务器返回错误状态码
      console.error('错误状态码:', error.response.status)
      console.error('错误数据:', error.response.data)
      
      // 处理401未授权错误
      if (error.response.status === 401) {
        // 清除本地存储的token
        localStorage.removeItem('github_token')
        localStorage.removeItem('user')
        
        // 重定向到登录页面
        window.location.href = window.location.origin + '/#/login'
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error('没有收到响应:', error.request)
    } else {
      // 请求配置错误
      console.error('请求配置错误:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export { http }