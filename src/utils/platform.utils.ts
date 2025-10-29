import { Capacitor } from '@capacitor/core'

export const isAndroid = (): boolean => {
  return Capacitor.getPlatform() === 'android'
}

export const isIOS = (): boolean => {
  return Capacitor.getPlatform() === 'ios'
}

export const isNativePlatform = (): boolean => {
  const platform = Capacitor.getPlatform()
  if (platform === 'android' || platform === 'ios') return true
  if (typeof window !== 'undefined') {
    interface CapacitorWindow {
      Capacitor?: { platform?: string; isNative?: boolean }
    }
    const w = window as unknown as CapacitorWindow
    if (w.Capacitor?.platform === 'android' || w.Capacitor?.platform === 'ios') return true
    if (w.Capacitor?.isNative) return true
    if (window.location.protocol === 'capacitor:') return true
  }
  return false
}

export const isWeb = (): boolean => {
  return Capacitor.getPlatform() === 'web'
}

export const getPlatform = (): string => {
  return Capacitor.getPlatform()
}
