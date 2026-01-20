import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { NOTIFICATION_TIMEOUT } from '@/constants/map.constants'
import { isNativePlatform } from '@/utils/platform.utils'

/**
 * Props for the Konsta notification component
 */
export interface NotificationProps {
  title?: string
  subtitle?: string
  text?: string
  titleRightText?: string
}

/**
 * Notification state containing visibility and content
 */
export interface NotificationState {
  opened: boolean
  props: NotificationProps
}

/**
 * Return type for the useMapNotifications hook
 */
export interface UseMapNotificationsReturn {
  /** Show a notification with custom props (uses Konsta on native, toast on web) */
  notify: (props: NotificationProps) => void
  /** Show an error notification */
  notifyError: (message: string, title?: string) => void
  /** Show a success notification */
  notifySuccess: (message: string, title?: string) => void
  /** Show an info notification */
  notifyInfo: (message: string, title?: string) => void
  /** Current notification state for Konsta component */
  notificationState: NotificationState
  /** Close the current notification */
  closeNotification: () => void
}

/**
 * Hook for managing map notifications across platforms
 * Automatically handles platform detection to show Konsta notifications
 * on native platforms and toast notifications on web
 *
 * @example
 * ```tsx
 * const { notify, notifyError, notificationState, closeNotification } = useMapNotifications()
 *
 * // Show error
 * notifyError('Failed to get location')
 *
 * // Show custom notification
 * notify({ title: 'Found!', text: 'Lot found in Block A', titleRightText: 'now' })
 *
 * // In JSX (for Konsta notification rendering)
 * <Notification
 *   opened={notificationState.opened}
 *   {...notificationState.props}
 *   onClick={closeNotification}
 * />
 * ```
 */
export function useMapNotifications(): UseMapNotificationsReturn {
  const [opened, setOpened] = useState(false)
  const [props, setProps] = useState<NotificationProps>({})

  // Auto-dismiss notification after timeout
  useEffect(() => {
    if (!opened) return

    const timer = setTimeout(() => {
      setOpened(false)
    }, NOTIFICATION_TIMEOUT)

    return () => clearTimeout(timer)
  }, [opened])

  /**
   * Show a notification with custom props
   * Uses Konsta on native platforms, toast on web
   */
  const notify = useCallback((notificationProps: NotificationProps) => {
    if (isNativePlatform()) {
      setProps(notificationProps)
      setOpened(true)
    } else {
      // On web, show toast with text or title as message
      const message = notificationProps.text || notificationProps.title || ''
      if (message) {
        toast(message)
      }
    }
  }, [])

  /**
   * Show an error notification
   */
  const notifyError = useCallback((message: string, title = 'Error') => {
    if (isNativePlatform()) {
      setProps({
        title,
        text: message,
        titleRightText: 'now',
      })
      setOpened(true)
    } else {
      toast.error(message)
    }
  }, [])

  /**
   * Show a success notification
   */
  const notifySuccess = useCallback((message: string, title = 'Success') => {
    if (isNativePlatform()) {
      setProps({
        title,
        text: message,
        titleRightText: 'now',
      })
      setOpened(true)
    } else {
      toast.success(message)
    }
  }, [])

  /**
   * Show an info notification
   */
  const notifyInfo = useCallback((message: string, title = 'Info') => {
    if (isNativePlatform()) {
      setProps({
        title,
        text: message,
        titleRightText: 'now',
      })
      setOpened(true)
    } else {
      toast.info(message)
    }
  }, [])

  /**
   * Close the current notification
   */
  const closeNotification = useCallback(() => {
    setOpened(false)
  }, [])

  return {
    notify,
    notifyError,
    notifySuccess,
    notifyInfo,
    notificationState: {
      opened,
      props,
    },
    closeNotification,
  }
}
