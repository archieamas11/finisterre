import axios, { type InternalAxiosRequestConfig, type AxiosInstance, type AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios'

// Fallback base URL when env var is missing (keeps behavior predictable)
const DEFAULT_API_URL = 'http://localhost/finisterre_backend'

export const api: AxiosInstance = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) || DEFAULT_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
  timeout: 10000, // 10 seconds timeout
})

let onUnauthorized: (() => void) | null = null

export function registerOnUnauthorized(cb: () => void) {
  onUnauthorized = cb
}

export function setToken(token: string) {
  try {
    localStorage.setItem('token', token)
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } catch (e) {
    // localStorage can throw in some environments (privacy mode)
    console.warn('Could not persist token to localStorage', e)
  }
}

export function clearToken() {
  try {
    localStorage.removeItem('token')
    delete api.defaults.headers.common.Authorization
  } catch (e) {
    console.warn('Could not remove token from localStorage', e)
  }
}

// Attach Authorization header from localStorage for each request (defensive)
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (token) {
    config.headers = config.headers ?? {}
    // only set if not already provided
    if (!('Authorization' in config.headers)) {
      ;(config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
    }
  }

  if (import.meta.env.DEV) {
    // Log method and url concisely
    // eslint-disable-next-line no-console
    console.debug('API →', (config.method ?? 'GET').toUpperCase(), config.url)
  }

  return config
})

// Response interceptor: centralize error handling & basic retry for timeouts
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    // If request timed out, try one retry automatically
    const config = error.config as AxiosRequestConfig & { __retryCount?: number }

    const isTimeout = error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')
    if (isTimeout) {
      config.__retryCount = config.__retryCount ?? 0
      if (config.__retryCount < 1) {
        config.__retryCount += 1
        return api(config)
      }
    }

    // Handle 401 Unauthorized centrally
    if (error.response?.status === 401) {
      // call registered callback if present (e.g., to redirect to login)
      if (onUnauthorized) onUnauthorized()
      // also clear token by default; log if it fails
      try {
        clearToken()
      } catch (e) {
        console.warn('clearToken failed', e)
      }
    }

    // Attach a normalized message for callers
    const respData: unknown = error.response?.data

    function hasMessage(o: unknown): o is { message: string } {
      if (typeof o !== 'object' || o === null) return false
      const temp = o as { [k: string]: unknown }
      return Object.prototype.hasOwnProperty.call(temp, 'message') && typeof temp.message === 'string'
    }

    const message = hasMessage(respData) ? (respData as { message: string }).message : error.message
    const normalized = {
      message,
      status: error.response?.status ?? null,
      originalError: error,
    }

    // Throw a proper Error object with attached metadata
    interface ErrorWithMeta extends Error {
      status?: number | null
      originalError?: AxiosError
    }

    const thrown = new Error(normalized.message) as ErrorWithMeta
    thrown.status = normalized.status
    thrown.originalError = normalized.originalError
    throw thrown
  },
)
