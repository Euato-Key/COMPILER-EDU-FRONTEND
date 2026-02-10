import axios from 'axios'

// 使用相对路径，让 Vite 代理处理跨域
const baseURL = import.meta.env.DEV ? '' : 'http://127.0.0.1:5000'

const instance = axios.create({
  baseURL,
  timeout: 100000, // 超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // 直接返回响应，让调用方处理业务逻辑
    return res
  },
  (err) => {
    // 处理网络错误
    console.error(err.response?.data?.message || '服务异常')
    return Promise.reject(err)
  }
)

export default instance
