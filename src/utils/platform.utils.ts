import { Capacitor } from '@capacitor/core'

/**
 * Platform detection utilities
 */

/**
 * Check if the app is running on Android
 * @returns true if running on Android, false otherwise
 */
export const isAndroid = (): boolean => {
  return Capacitor.getPlatform() === 'android'
}

/**
 * Check if the app is running on iOS
 * @returns true if running on iOS, false otherwise
 */
export const isIOS = (): boolean => {
  return Capacitor.getPlatform() === 'ios'
}

/**
 * Check if the app is running on a native mobile platform
 * @returns true if running on Android or iOS, false if running on web
 */
export const isNativePlatform = (): boolean => {
  // Use getPlatform because it is stable across Capacitor versions.
  // Some builds report false for Capacitor.isNativePlatform() early in lifecycle.
  const platform = Capacitor.getPlatform()
  if (platform === 'android' || platform === 'ios') return true
  // Heuristic fallbacks if Capacitor failed to classify yet.
  if (typeof window !== 'undefined') {
    interface CapacitorWindow {
      Capacitor?: { platform?: string; isNative?: boolean }
    }
    const w = window as unknown as CapacitorWindow
    // Capacitor v5/v6 may expose a native bridge object on Android/iOS
    if (w.Capacitor?.platform === 'android' || w.Capacitor?.platform === 'ios') return true
    if (w.Capacitor?.isNative) return true
    // URL scheme used by Capacitor
    if (window.location.protocol === 'capacitor:') return true
  }
  return false
}

/**
 * Check if the app is running on web
 * @returns true if running on web, false if running on native platform
 */
export const isWeb = (): boolean => {
  return Capacitor.getPlatform() === 'web'
}

/**
 * Get the current platform
 * @returns 'android' | 'ios' | 'web'
 */
export const getPlatform = (): string => {
  return Capacitor.getPlatform()
}
