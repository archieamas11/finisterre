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
  return Capacitor.isNativePlatform()
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
