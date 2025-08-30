import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
})

// Add Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers ?? {}
    // Avoid explicit role property that's the same as implicit/default role
    config.headers.Authorization = `Bearer ${token}`
  }

  // Log API requests for debugging
  console.log('🚀 API Request:', config.method?.toUpperCase(), config.url)

  return config
})

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => {
    // Log successful API responses
    console.log('✅ API Response:', response.config.method?.toUpperCase(), response.config.url, response.status)
    return response
  },
  (error) => {
    // Log API errors
    console.error('❌ API Error:', error.config?.method?.toUpperCase(), error.config?.url, error.response?.status, error.message)

    const status = error?.response?.status
    if (status === 401) {
      // Clear any stored auth, then redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('isAdmin')
      if (typeof window !== 'undefined' && window.location.pathname !== '/') {
        window.location.assign('/')
      }
    }
    return Promise.reject(error)
  },
)
