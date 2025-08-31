import axios, { type InternalAxiosRequestConfig } from 'axios'

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
