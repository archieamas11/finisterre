import L from 'leaflet'
import React from 'react'
import { Polyline, Marker, useMap, Pane } from 'react-leaflet'

import { type ValhallaRouteResponse } from '@/api/valhalla.api'
import { UserLocationMarker } from '@/components/map/UserLocationMarker'
import { type UserLocation } from '@/hooks/useLocationTracking'
interface ValhallaRouteProps {
  route: ValhallaRouteResponse | null
  routeCoordinates: [number, number][]
  // 🎯 Dynamic coordinates showing remaining route during navigation
  remainingCoordinates?: [number, number][]
  isNavigating?: boolean
  // 📍 Original coordinates (not snapped to roads)
  originalStart?: [number, number]
  originalEnd?: [number, number]
  // 👤 User location to render as the start marker
  userLocation?: UserLocation | null
  // 🎨 Styling options
  routeColor?: string
  routeWeight?: number
  routeOpacity?: number
  // 🎯 Show start/end markers
  showMarkers?: boolean
  // 🔄 Auto-fit bounds to route
  fitBounds?: boolean
}

/**
 * 🗺️ Valhalla route component that renders route polyline and markers
 */
export function ValhallaRoute({
  route,
  routeCoordinates,
  remainingCoordinates,
  isNavigating = false,
  originalStart,
  originalEnd,
  userLocation,
  routeColor = '#3b82f6',
  routeWeight = 5,
  routeOpacity = 0.8,
  showMarkers = true,
  fitBounds = true
}: ValhallaRouteProps) {
  const map = useMap()

  // Animation state: number of points currently rendered (for snake animation)
  const [visibleIndex, setVisibleIndex] = React.useState<number>(0)
  const animationRef = React.useRef<number | null>(null)
  const timeoutRef = React.useRef<number | null>(null)

  if (!route || routeCoordinates.length === 0) {
    return null
  }

  // 🎯 Use original coordinates for markers if provided, otherwise fallback to route coordinates
  // Start point is represented by the UserLocationMarker when provided
  const endPoint = originalEnd || routeCoordinates[routeCoordinates.length - 1]

  // 🗺️ For bounds fitting, include original coordinates if available
  const boundsCoordinates = React.useMemo(() => {
    const coords = [...routeCoordinates]
    if (originalStart && originalStart !== routeCoordinates[0]) {
      coords.unshift(originalStart)
    }
    if (
      originalEnd &&
      originalEnd !== routeCoordinates[routeCoordinates.length - 1]
    ) {
      coords.push(originalEnd)
    }
    return coords
  }, [routeCoordinates, originalStart, originalEnd, route])

  // 🎯 Auto-fit map bounds to route (including original coordinates)
  React.useEffect(() => {
    if (fitBounds && boundsCoordinates.length > 0) {
      try {
        const bounds = L.latLngBounds(boundsCoordinates)
        map.fitBounds(bounds, { padding: [20, 20] })
      } catch {
        // 🤫 Silently ignore bounds errors to avoid noisy logs in UI
      }
    }
  }, [boundsCoordinates, fitBounds, map])

  // 🎨 Dynamic styling based on navigation state
  const polylineColor = isNavigating ? '#3b82f6' : routeColor
  const polylineOpacity = isNavigating ? 0.9 : routeOpacity

  // 🎯 End/Destination marker icon
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
    iconAnchor: [15, 30]
  })

  // 🔗 Create complete polyline coordinates that connect original points to snapped route
  const completePolylineCoordinates = React.useMemo(() => {
    // 🎯 Use remaining coordinates during navigation for dynamic progress, otherwise use full route
    const baseCoords =
      isNavigating && remainingCoordinates && remainingCoordinates.length > 0
        ? remainingCoordinates
        : routeCoordinates

    const coords = [...baseCoords]

    // 🎯 If we have original coordinates, create connection lines
    // Only add original start when not navigating (to avoid connecting to old start position)
    if (
      originalStart &&
      originalStart !== routeCoordinates[0] &&
      !isNavigating
    ) {
      // Add original start at the beginning to connect to first route point
      coords.unshift(originalStart)
    }

    if (originalEnd && originalEnd !== coords[coords.length - 1]) {
      // Add original end at the end to connect from last route point
      coords.push(originalEnd)
    }

    return coords
  }, [
    routeCoordinates,
    remainingCoordinates,
    isNavigating,
    originalStart,
    originalEnd
  ])

  // Build the array of coordinates to animate (lat,lng)
  const animCoords = React.useMemo(
    () => completePolylineCoordinates,
    [completePolylineCoordinates]
  )

  // Animation: progressively reveal the polyline and move a head marker
  React.useEffect(() => {
    // Reset when route changes or navigation toggles
    setVisibleIndex(isNavigating ? 1 : animCoords.length)

    // If not navigating, no animation needed
    if (!isNavigating || animCoords.length === 0) {
      return
    }

    let idx = 1
    const speedPerPointMs = 30 // configurable speed (ms per point)

    function step() {
      if (idx >= animCoords.length) {
        // finish animation, place head at final point
        setVisibleIndex(animCoords.length)
        return
      }

      setVisibleIndex(idx)
      idx += 1
      // request animation frame for smoother movement between points
      animationRef.current = window.setTimeout(step, speedPerPointMs)
    }

    // small delay to let map settle before animating
    timeoutRef.current = window.setTimeout(() => {
      step()
    }, 120)

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
        animationRef.current = null
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [isNavigating, animCoords])

  return (
    <>
      <Pane name="route-pane" style={{ zIndex: 2000 }}>
        {/* 🗺️ Background full route (faint) for context when animating */}
        {isNavigating && (
          <Polyline
            positions={completePolylineCoordinates}
            pathOptions={{
              color: '#FFFF',
              opacity: 0.2,
              lineCap: 'round',
              lineJoin: 'round'
            }}
          />
        )}

        {/* 🗺️ Animated visible polyline (snake) */}
        <Polyline
          positions={completePolylineCoordinates.slice(0, visibleIndex || 1)}
          pathOptions={{
            color: polylineColor,
            weight: routeWeight,
            opacity: polylineOpacity,
            lineCap: 'round',
            lineJoin: 'round'
          }}
        />
      </Pane>
      {/* 🎯 Start (user location) and end markers */}
      {showMarkers && userLocation && (
        <UserLocationMarker
          userLocation={userLocation}
          centerOnFirst={false}
          showAccuracyCircle={isNavigating}
          enableAnimation
        />
      )}
      {showMarkers && endPoint && (
        <Marker
          position={endPoint}
          icon={endIcon}
          zIndexOffset={1000}
          interactive={false}
        ></Marker>
      )}
    </>
  )
}
