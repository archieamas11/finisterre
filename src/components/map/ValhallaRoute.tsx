import L from 'leaflet'
import React from 'react'
import { Polyline, Marker } from 'react-leaflet'

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
}

/**
 * Valhalla route component that renders route polyline and markers
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
}: ValhallaRouteProps) {
  if (!route || routeCoordinates.length === 0) {
    return null
  }

  // Use original coordinates for markers if provided, otherwise fallback to route coordinates
  // Start point is represented by the UserLocationMarker when provided
  const endPoint = originalEnd || routeCoordinates[routeCoordinates.length - 1]

  // End/Destination marker icon
  const endIcon = L.divIcon({
    className: 'custom-destination-marker',
    html: `
      <div role="img" aria-label="Destination" style="position:relative;display:inline-block;width:30px;height:50px;">
        <svg width="28" height="40" viewBox="0 0 24 34" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
          <title>Destination</title>
          <defs>
            <filter id="dest-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.35)"/>
            </filter>
          </defs>
          <path filter="url(#dest-shadow)" d="M12 0C7.03 0 3 3.96 3 8.85c0 6.05 7.35 14.25 8.22 15.2.21.23.53.36.85.36.32 0 .64-.13.85-.36.87-.95 8.22-9.15 8.22-15.2C21 3.96 16.97 0 12 0z" fill="#ef4444"/>
          <circle cx="12" cy="9" r="3.2" fill="#fff"/>
        </svg>
      </div>
    `,
    iconAnchor: [15, 30],
  })

  // Create complete polyline coordinates that connect original points to snapped route
  const completePolylineCoordinates = React.useMemo(() => {
    // Use remaining coordinates during navigation for dynamic progress, otherwise use full route
    const baseCoords = isNavigating && remainingCoordinates && remainingCoordinates.length > 0 ? remainingCoordinates : routeCoordinates

    const coords = [...baseCoords]

    // If we have original coordinates, create connection lines
    // Only add original start when not navigating (to avoid connecting to old start position)
    if (originalStart && originalStart !== routeCoordinates[0] && !isNavigating) {
      // Add original start at the beginning to connect to first route point
      coords.unshift(originalStart)
    }

    if (originalEnd && originalEnd !== coords[coords.length - 1]) {
      // Add original end at the end to connect from last route point
      coords.push(originalEnd)
    }

    return coords
  }, [routeCoordinates, remainingCoordinates, isNavigating, originalStart, originalEnd])

  return (
    <>
      {isNavigating && (
        <Polyline
          pane="route-pane"
          positions={completePolylineCoordinates}
          pathOptions={{
            color: '#3b82f6',
            opacity: 1,
            weight: 6,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />
      )}
      {showMarkers && userLocation && <UserLocationMarker userLocation={userLocation} />}
      {showMarkers && endPoint && <Marker pane="end-icon" position={endPoint} icon={endIcon} zIndexOffset={1000} interactive={false} />}
    </>
  )
}
