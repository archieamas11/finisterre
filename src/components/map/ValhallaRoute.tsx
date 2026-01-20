import React from 'react'
import L from 'leaflet'
import { Marker, Polyline, useMap } from 'react-leaflet'

import { type ValhallaRouteResponse } from '@/api/valhalla.api'
import { UserLocationMarker } from '@/components/map/UserLocationMarker'
import { type UserLocation } from '@/hooks/useLocationTracking'

interface ValhallaRouteProps {
  route: ValhallaRouteResponse | null
  routeCoordinates: [number, number][]
  remainingCoordinates?: [number, number][]
  isNavigating?: boolean
  originalStart?: [number, number]
  originalEnd?: [number, number]
  userLocation?: UserLocation | null
  showMarkers?: boolean
  /** Whether to auto-fit map bounds to route */
  fitBounds?: boolean
  /** Route line color */
  routeColor?: string
  /** Traveled route color (dimmed) */
  traveledColor?: string
  /** Route line weight */
  routeWeight?: number
}

/**
 * High-performance Valhalla route component
 * Renders route polyline with traveled/remaining sections and markers
 */
export function ValhallaRoute({
  route,
  routeCoordinates,
  remainingCoordinates,
  isNavigating = false,
  originalStart,
  originalEnd,
  userLocation,
  showMarkers = true,
  fitBounds = false,
  routeColor = '#3b82f6',
  traveledColor = '#94a3b8',
  routeWeight = 6,
}: ValhallaRouteProps) {
  const map = useMap()

  // Fit bounds to route on initial load
  React.useEffect(() => {
    if (fitBounds && routeCoordinates.length > 0 && map) {
      const bounds = L.latLngBounds(routeCoordinates)
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [fitBounds, routeCoordinates, map])

  if (!route || routeCoordinates.length === 0) {
    return null
  }

  const endPoint = originalEnd || routeCoordinates[routeCoordinates.length - 1]

  // Calculate traveled portion
  const traveledCoordinates = React.useMemo(() => {
    if (!isNavigating || !remainingCoordinates || remainingCoordinates.length === 0) {
      return []
    }

    const remainingStartIndex = routeCoordinates.findIndex(
      (coord) => coord[0] === remainingCoordinates[0][0] && coord[1] === remainingCoordinates[0][1],
    )

    if (remainingStartIndex <= 0) return []

    return routeCoordinates.slice(0, remainingStartIndex + 1)
  }, [routeCoordinates, remainingCoordinates, isNavigating])

  // Build remaining route coordinates with connections to original points
  const displayCoordinates = React.useMemo(() => {
    const baseCoords =
      isNavigating && remainingCoordinates && remainingCoordinates.length > 0
        ? remainingCoordinates
        : routeCoordinates

    const coords = [...baseCoords]

    // Connect to original start when not navigating
    if (originalStart && !isNavigating && routeCoordinates[0]) {
      const [startLat, startLon] = routeCoordinates[0]
      const [origLat, origLon] = originalStart
      if (Math.abs(startLat - origLat) > 0.00001 || Math.abs(startLon - origLon) > 0.00001) {
        coords.unshift(originalStart)
      }
    }

    // Connect to original end
    if (originalEnd && coords.length > 0) {
      const lastCoord = coords[coords.length - 1]
      const [lastLat, lastLon] = lastCoord
      const [endLat, endLon] = originalEnd
      if (Math.abs(lastLat - endLat) > 0.00001 || Math.abs(lastLon - endLon) > 0.00001) {
        coords.push(originalEnd)
      }
    }

    return coords
  }, [routeCoordinates, remainingCoordinates, isNavigating, originalStart, originalEnd])

  // Memoized destination icon
  const endIcon = React.useMemo(
    () =>
      L.divIcon({
        className: 'custom-destination-marker',
        html: `
          <div role="img" aria-label="Destination" style="position:relative;display:inline-block;width:30px;height:50px;">
            <svg width="28" height="40" viewBox="0 0 24 34" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
              <title>Destination</title>
              <defs>
                <filter id="dest-shadow-${route.id || 'default'}" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.35)"/>
                </filter>
              </defs>
              <path filter="url(#dest-shadow-${route.id || 'default'})" d="M12 0C7.03 0 3 3.96 3 8.85c0 6.05 7.35 14.25 8.22 15.2.21.23.53.36.85.36.32 0 .64-.13.85-.36.87-.95 8.22-9.15 8.22-15.2C21 3.96 16.97 0 12 0z" fill="#ef4444"/>
              <circle cx="12" cy="9" r="3.2" fill="#fff"/>
            </svg>
          </div>
        `,
        iconAnchor: [15, 40],
        iconSize: [30, 50],
      }),
    [route.id],
  )

  return (
    <>
      {/* Traveled portion (dimmed) */}
      {isNavigating && traveledCoordinates.length > 1 && (
        <Polyline
          pane="route-pane"
          positions={traveledCoordinates}
          pathOptions={{
            color: traveledColor,
            opacity: 0.5,
            weight: routeWeight - 1,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />
      )}

      {/* Main route / remaining portion */}
      {displayCoordinates.length > 1 && (
        <Polyline
          pane="route-pane"
          positions={displayCoordinates}
          pathOptions={{
            color: routeColor,
            opacity: 1,
            weight: routeWeight,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />
      )}

      {/* Route outline for better visibility */}
      {displayCoordinates.length > 1 && (
        <Polyline
          pane="route-pane"
          positions={displayCoordinates}
          pathOptions={{
            color: '#1e3a5f',
            opacity: 0.3,
            weight: routeWeight + 3,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />
      )}

      {/* User location marker */}
      {showMarkers && userLocation && <UserLocationMarker userLocation={userLocation} />}

      {/* Destination marker */}
      {showMarkers && endPoint && (
        <Marker
          pane="end-icon"
          position={endPoint}
          icon={endIcon}
          zIndexOffset={1000}
          interactive={false}
        />
      )}
    </>
  )
}
