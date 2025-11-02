import { isNativePlatform } from './platform.utils'

const rawConfiguredOrigin = import.meta.env.VITE_PUBLIC_SHARE_ORIGIN as string | undefined

const sanitizeValue = (value: string | undefined | null): string | null => {
  if (!value) return null
  const trimmed = value.trim()
  if (trimmed.length === 0) return null
  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed
}

const fallbackOrigin = sanitizeValue(rawConfiguredOrigin) ?? 'https://www.finisterre.site'

const sanitizeOrigin = (origin: string): string => {
  const sanitized = sanitizeValue(origin)
  if (!sanitized) return fallbackOrigin
  return sanitized
}

export const getShareOrigin = (): string => {
  if (typeof window === 'undefined') return fallbackOrigin

  const nativeOrigin = sanitizeOrigin(window.location.origin)

  if (isNativePlatform()) {
    return fallbackOrigin
  }

  if (nativeOrigin.includes('localhost') || nativeOrigin.includes('127.0.0.1')) {
    return fallbackOrigin
  }

  return nativeOrigin || fallbackOrigin
}
