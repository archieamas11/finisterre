/**
 * Map hooks barrel file
 * Re-exports all map-related hooks for convenient importing
 */

export { useMapInstance, MapInstanceBinder } from './useMapInstance'
export type { MapInstanceBinderProps, UseMapInstanceReturn } from './useMapInstance'

export { useMapNotifications } from './useMapNotifications'
export type { NotificationProps, NotificationState, UseMapNotificationsReturn } from './useMapNotifications'

export { useMapLocation } from './useMapLocation'
export type { UseMapLocationOptions, UseMapLocationReturn } from './useMapLocation'

export { useMapNavigation } from './useMapNavigation'
export type { NavigationQuery, UseMapNavigationOptions, UseMapNavigationReturn } from './useMapNavigation'

export { useMapClustering } from './useMapClustering'
export type { UseMapClusteringOptions, UseMapClusteringReturn } from './useMapClustering'

export { useMapSearch } from './useMapSearch'
export type { UseMapSearchOptions, UseMapSearchReturn } from './useMapSearch'
