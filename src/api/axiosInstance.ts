import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
  timeout: 10000, // 10 seconds timeout
})

// Add Authorization header if token exists
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }

  // Log API requests in development
  if (import.meta.env.DEV) {
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url)
  }

  return config
})

// Handle responses and errors globally
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful API responses in development
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', response.config.method?.toUpperCase(), response.config.url, response.status)
    }
    return response
  },
  (error: AxiosError) => {
    // Log API errors in development
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', error.config?.method?.toUpperCase(), error.config?.url, error.response?.status, error.message)
    }

    const status = error?.response?.status
    if (status === 401) {
      // Clear stored auth data
      localStorage.removeItem('token')
      localStorage.removeItem('isAdmin')

      // Redirect to login if not already there
      if (typeof window !== 'undefined' && window.location.pathname !== '/') {
        window.location.href = '/'
      }
    }

    return Promise.reject(error)
  },
)
