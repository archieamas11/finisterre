import { Notification } from 'konsta/react'
import { memo } from 'react'

import type { NotificationState } from '@/hooks/map-hooks/useMapNotifications'

/**
 * Props for the MapNotifications component
 */
export interface MapNotificationsProps {
  /** Notification state from useMapNotifications hook */
  notificationState: NotificationState
  /** Callback to close the notification */
  onClose: () => void
}

/**
 * Component for rendering Konsta notifications on the map
 * Used primarily on native platforms for in-app notifications
 *
 * @example
 * ```tsx
 * const { notificationState, closeNotification } = useMapNotifications()
 *
 * <MapNotifications
 *   notificationState={notificationState}
 *   onClose={closeNotification}
 * />
 * ```
 */
function MapNotificationsComponent({
  notificationState,
  onClose,
}: MapNotificationsProps) {
  const { opened, props } = notificationState

  return (
    <Notification
      opened={opened}
      title={props.title}
      subtitle={props.subtitle}
      text={props.text}
      titleRightText={props.titleRightText}
      button
      onClick={onClose}
      className="z-999"
    />
  )
}

export const MapNotifications = memo(MapNotificationsComponent)
MapNotifications.displayName = 'MapNotifications'
