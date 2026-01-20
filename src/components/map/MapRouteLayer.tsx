import type { ValhallaRouteResponse } from '@/api/valhalla.api'
import type { UserLocation } from '@/hooks/useLocationTracking'
import { memo } from 'react'

import { UserLocationMarker } from '@/components/map/UserLocationMarker'
import { ValhallaRoute } from '@/components/map/ValhallaRoute'

/**
 * Props for the MapRouteLayer component
 */
export interface MapRouteLayerProps {
  /** Valhalla route response data */
  route: ValhallaRouteResponse | null
  /** Full route coordinates */
  routeCoordinates: [number, number][]
  /** Remaining route coordinates during navigation */
  remainingCoordinates: [number, number][]
  /** Original start point */
  originalStart: [number, number] | null
  /** Original end point */
  originalEnd: [number, number] | null
  /** Current user location */
  userLocation: UserLocation | null
  /** Whether navigation is active */
  isNavigating: boolean
}

/**
 * Component for rendering the navigation route and user location
 * Shows route polyline when navigating, or just user location marker when not
 *
 * @example
 * ```tsx
 * <MapContainer>
 *   <MapRouteLayer
 *     route={route}
 *     routeCoordinates={routeCoordinates}
 *     remainingCoordinates={remainingCoordinates}
 *     originalStart={originalStart}
 *     originalEnd={originalEnd}
 *     userLocation={currentLocation}
 *     isNavigating={isNavigating}
 *   />
 * </MapContainer>
 * ```
 */
function MapRouteLayerComponent({
  route,
  routeCoordinates,
  remainingCoordinates,
  originalStart,
  originalEnd,
  userLocation,
  isNavigating,
}: MapRouteLayerProps) {
  const hasActiveRoute = route && routeCoordinates.length > 0

  if (hasActiveRoute) {
    return (
      <ValhallaRoute
        route={route}
        routeCoordinates={routeCoordinates}
        remainingCoordinates={remainingCoordinates}
        originalStart={originalStart || undefined}
        originalEnd={originalEnd || undefined}
        userLocation={userLocation}
        isNavigating={isNavigating}
        showMarkers={true}
      />
    )
  }

  // Show user location marker when not navigating
  return <UserLocationMarker userLocation={userLocation} />
}

export const MapRouteLayer = memo(MapRouteLayerComponent)
MapRouteLayer.displayName = 'MapRouteLayer'
