import axios, { type InternalAxiosRequestConfig, type AxiosInstance, type AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios'

const DEFAULT_API_URL = 'http://localhost/finisterre_backend/'
const TOKEN_KEY = 'token'
const MAX_RETRIES = 1
const TIMEOUT = 10000

interface ApiError extends Error {
  status?: number | null
  originalError?: AxiosError
}

const isBrowser = typeof window !== 'undefined'

export const api: AxiosInstance = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) || DEFAULT_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
  timeout: TIMEOUT,
})

let inMemoryToken: string | null = null

let onUnauthorized: (() => void) | null = null

export function registerOnUnauthorized(cb: () => void): void {
  onUnauthorized = cb
}

export function setToken(token: string): void {
  inMemoryToken = token

  if (isBrowser) {
    try {
      localStorage.setItem(TOKEN_KEY, token)
    } catch (e) {
      console.warn('Could not persist token to localStorage', e)
    }
  }

  api.defaults.headers.common.Authorization = `Bearer ${token}`
}

export function clearToken(): void {
  inMemoryToken = null

  if (isBrowser) {
    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch (e) {
      console.warn('Could not remove token from localStorage', e)
    }
  }

  delete api.defaults.headers.common.Authorization
}

export function getToken(): string | null {
  if (isBrowser) {
    try {
      return localStorage.getItem(TOKEN_KEY) || inMemoryToken
    } catch {
      return inMemoryToken
    }
  }
  return inMemoryToken
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!config.headers.Authorization) {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  if (import.meta.env.DEV) {
    console.debug('API →', (config.method ?? 'GET').toUpperCase(), config.url)
  }

  return config
})

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const config = error.config as (AxiosRequestConfig & { __retryCount?: number }) | undefined

    if (config && (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout'))) {
      config.__retryCount = config.__retryCount ?? 0

      if (config.__retryCount < MAX_RETRIES) {
        config.__retryCount += 1
        return api(config)
      }
    }

    if (error.response?.status === 401) {
      clearToken()
      onUnauthorized?.()
    }

    const responseData = error.response?.data
    let message = error.message

    if (typeof responseData === 'object' && responseData !== null) {
      if ('message' in responseData && typeof responseData.message === 'string') {
        message = responseData.message
      } else if ('error' in responseData && typeof responseData.error === 'string') {
        message = responseData.error
      }
    }

    const enhancedError = new Error(message) as ApiError
    enhancedError.status = error.response?.status ?? null
    enhancedError.originalError = error

    throw enhancedError
  },
)
