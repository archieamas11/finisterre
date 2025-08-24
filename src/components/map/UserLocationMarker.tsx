import L from 'leaflet'
import React from 'react'
import { Circle, useMap } from 'react-leaflet'
import ReactLeafletDriftMarker from 'react-leaflet-drift-marker'

import { type UserLocation } from '@/hooks/useLocationTracking'

interface UserLocationMarkerProps {
  userLocation: UserLocation | null
  // 🎨 Styling options
  markerColor?: string
  accuracyColor?: string
  accuracyOpacity?: number
  // 📍 Auto-center map on first location
  centerOnFirst?: boolean
  // 🎯 Show accuracy circle
  showAccuracyCircle?: boolean
  // 🔄 Animation options
  enableAnimation?: boolean
}

/**
 * 📍 User location marker component that displays current position with accuracy circle
 */
export function UserLocationMarker({
  userLocation,
  markerColor = '#2563eb',
  accuracyColor = '#2563eb',
  accuracyOpacity = 0.2,
  centerOnFirst = true,
  showAccuracyCircle = true,
  enableAnimation = true,
}: UserLocationMarkerProps) {
  const map = useMap()
  const [hasInitiallyFocused, setHasInitiallyFocused] = React.useState(false)

  // 🎯 Center map on user location when first found
  React.useEffect(() => {
    if (userLocation && centerOnFirst && !hasInitiallyFocused) {
      map.setView([userLocation.latitude, userLocation.longitude], 16, {
        animate: enableAnimation,
      })
      setHasInitiallyFocused(true)
    }
  }, [userLocation, centerOnFirst, hasInitiallyFocused, map, enableAnimation])

  if (!userLocation) {
    return null
  }

  // 📍 Create custom user location icon
  const userLocationIcon = L.divIcon({
    className: 'user-location-marker',
    html: `
      <div role="img" aria-label="Your location" style="position:relative;display:inline-block;width:20px;height:20px;">
        <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
          <title>Your Location</title>
          <defs>
            <filter id="user-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.3)"/>
            </filter>
          </defs>
          <!-- Outer ring -->
          <circle 
            cx="10" 
            cy="10" 
            r="8" 
            fill="white" 
            stroke="${markerColor}" 
            stroke-width="2"
            filter="url(#user-shadow)"
            ${
              enableAnimation
                ? `opacity="0.8">
              <animate attributeName="r" values="8;10;8" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite"/>
            `
                : `>`
            }
          </circle>
          <!-- Inner dot -->
          <circle 
            cx="10" 
            cy="10" 
            r="4" 
            fill="${markerColor}" 
          />
        </svg>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })

  const position: [number, number] = [userLocation.latitude, userLocation.longitude]
  const accuracy = userLocation.accuracy

  return (
    <>
      {/* 🎯 Accuracy circle */}
      {showAccuracyCircle && accuracy && (
        <Circle
          center={position}
          radius={accuracy}
          pathOptions={{
            fillColor: accuracyColor,
            color: accuracyColor,
            fillOpacity: accuracyOpacity,
            opacity: accuracyOpacity * 2,
            weight: 1,
          }}
        />
      )}

      {/* 📍 User location marker */}
      <ReactLeafletDriftMarker position={position} icon={userLocationIcon} duration={1000} />
    </>
  )
}
