import { memo, useMemo, useEffect, useRef } from 'react'
import L from 'leaflet'
import { Circle, useMap } from 'react-leaflet'
import ReactLeafletDriftMarker from 'react-leaflet-drift-marker'

import { type UserLocation } from '@/hooks/useLocationTracking'

interface UserLocationMarkerProps {
  userLocation: UserLocation | null
  markerColor?: string
  accuracyColor?: string
  accuracyOpacity?: number
  /** Whether to show heading indicator */
  showHeading?: boolean
  /** Whether to animate marker movement */
  animate?: boolean
  /** Animation duration in ms */
  animationDuration?: number
  /** Whether to follow user on map */
  followUser?: boolean
}

/**
 * High-performance user location marker component
 * Displays current position with accuracy circle and optional heading
 */
function UserLocationMarkerComponent({
  userLocation,
  markerColor = '#2563eb',
  accuracyColor = '#2563eb',
  accuracyOpacity = 0.15,
  showHeading = true,
  animate = true,
  animationDuration = 1000,
  followUser = false,
}: UserLocationMarkerProps) {
  const map = useMap()
  const lastPositionRef = useRef<[number, number] | null>(null)

  // Follow user if enabled
  useEffect(() => {
    if (followUser && userLocation && map) {
      const newPos: [number, number] = [userLocation.latitude, userLocation.longitude]

      // Only pan if moved significantly
      if (lastPositionRef.current) {
        const [lastLat, lastLon] = lastPositionRef.current
        const movedDistance = Math.sqrt(
          Math.pow(userLocation.latitude - lastLat, 2) + Math.pow(userLocation.longitude - lastLon, 2),
        )

        // Pan only if moved more than ~5 meters
        if (movedDistance > 0.00005) {
          map.panTo(newPos, { animate: true, duration: 0.5 })
        }
      }

      lastPositionRef.current = newPos
    }
  }, [userLocation, map, followUser])

  // Create user location icon with optional heading
  const userLocationIcon = useMemo(() => {
    const heading = showHeading && userLocation?.heading != null ? userLocation.heading : null
    const hasHeading = heading !== null && !isNaN(heading)

    return L.divIcon({
      className: 'user-location-marker',
      html: `
        <div role="img" aria-label="Your location" style="position:relative;display:inline-block;width:24px;height:24px;">
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
            <title>Your Location</title>
            <defs>
              <filter id="user-marker-shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
              </filter>
              <radialGradient id="user-marker-pulse" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="${markerColor}" stop-opacity="0.4">
                  <animate attributeName="stop-opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite"/>
                </stop>
                <stop offset="100%" stop-color="${markerColor}" stop-opacity="0">
                  <animate attributeName="stop-opacity" values="0;0;0" dur="2s" repeatCount="indefinite"/>
                </stop>
              </radialGradient>
            </defs>
            
            <!-- Pulse ring -->
            <circle 
              cx="12" 
              cy="12" 
              r="10" 
              fill="url(#user-marker-pulse)">
              <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite"/>
            </circle>
            
            <!-- Outer ring -->
            <circle 
              cx="12" 
              cy="12" 
              r="8" 
              fill="white" 
              stroke="${markerColor}" 
              stroke-width="2.5"
              filter="url(#user-marker-shadow)"
            />
            
            <!-- Inner dot -->
            <circle 
              cx="12" 
              cy="12" 
              r="4" 
              fill="${markerColor}"
            />
            
            ${
              hasHeading
                ? `
            <!-- Heading indicator -->
            <g transform="rotate(${heading}, 12, 12)">
              <path 
                d="M12 2 L15 8 L12 6 L9 8 Z" 
                fill="${markerColor}"
                stroke="white"
                stroke-width="0.5"
              />
            </g>
            `
                : ''
            }
          </svg>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    })
  }, [markerColor, showHeading, userLocation?.heading])

  if (!userLocation) {
    return null
  }

  const position: [number, number] = [userLocation.latitude, userLocation.longitude]
  const accuracy = userLocation.accuracy

  // Cap accuracy circle at reasonable size
  const cappedAccuracy = Math.min(accuracy || 0, 150)

  return (
    <>
      {/* Accuracy circle */}
      {cappedAccuracy > 5 && (
        <Circle
          center={position}
          radius={cappedAccuracy}
          pathOptions={{
            fillColor: accuracyColor,
            color: accuracyColor,
            fillOpacity: accuracyOpacity,
            opacity: accuracyOpacity * 1.5,
            weight: 1,
          }}
        />
      )}

      {/* User location marker with smooth animation */}
      {animate ? (
        <ReactLeafletDriftMarker
          position={position}
          icon={userLocationIcon}
          duration={animationDuration}
          keepAtCenter={false}
        />
      ) : (
        <ReactLeafletDriftMarker position={position} icon={userLocationIcon} duration={0} />
      )}
    </>
  )
}

// Memoize to prevent unnecessary re-renders
export const UserLocationMarker = memo(UserLocationMarkerComponent, (prevProps, nextProps) => {
  // Only re-render if location changed significantly or props changed
  if (prevProps.markerColor !== nextProps.markerColor) return false
  if (prevProps.showHeading !== nextProps.showHeading) return false
  if (prevProps.followUser !== nextProps.followUser) return false

  const prevLoc = prevProps.userLocation
  const nextLoc = nextProps.userLocation

  if (!prevLoc && !nextLoc) return true
  if (!prevLoc || !nextLoc) return false

  // Allow re-render if position changed by more than ~1 meter
  const latDiff = Math.abs(prevLoc.latitude - nextLoc.latitude)
  const lonDiff = Math.abs(prevLoc.longitude - nextLoc.longitude)
  const headingChanged =
    prevProps.showHeading && prevLoc.heading !== nextLoc.heading

  return latDiff < 0.00001 && lonDiff < 0.00001 && !headingChanged
})

UserLocationMarker.displayName = 'UserLocationMarker'
