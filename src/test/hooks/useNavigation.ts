import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import type { MapRef } from 'react-map-gl/mapbox'

import { fetchWalkingDirections, type LineStringFeature } from '../directions'
import type { Coordinate } from '../utils/location.utils'
import { hasReachedDestination } from '../utils/location.utils'
import type { NavigationState, NavigationActions, NavigationConfig } from '../types/navigation.types'
import { DEFAULT_NAVIGATION_CONFIG } from '../types/navigation.types'

interface UseNavigationProps {
  mapRef: React.RefObject<MapRef>
  mapboxAccessToken: string
  config?: Partial<NavigationConfig>
  onDestinationReached?: () => void
}

export function useNavigation({
  mapRef,
  mapboxAccessToken,
  config = {},
  onDestinationReached,
}: UseNavigationProps): NavigationState & NavigationActions {
  const finalConfig = useMemo(() => ({ ...DEFAULT_NAVIGATION_CONFIG, ...config }), [config])

  // Navigation state
  const [isActive, setIsActive] = useState(false)
  const [route, setRoute] = useState<LineStringFeature | null>(null)
  const [instructions, setInstructions] = useState<string[]>([])
  const [origin, setOrigin] = useState<Coordinate | null>(null)
  const [destination, setDestination] = useState<Coordinate | null>(null)
  const [currentUserPosition, setCurrentUserPosition] = useState<Coordinate | null>(null)

  // Geolocation watch reference
  const watchIdRef = useRef<number | null>(null)

  // Stop watching user position
  const stopLocationWatch = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
  }, [])

  // Cancel navigation
  const cancelNavigation = useCallback(() => {
    stopLocationWatch()
    setRoute(null)
    setInstructions([])
    setOrigin(null)
    setDestination(null)
    setCurrentUserPosition(null)
    setIsActive(false)
  }, [stopLocationWatch])

  // Start watching user position during navigation
  const startLocationWatch = useCallback(() => {
    if (!('geolocation' in navigator) || watchIdRef.current !== null) {
      return
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const newPosition: Coordinate = [pos.coords.longitude, pos.coords.latitude]
        setCurrentUserPosition(newPosition)
        setOrigin(newPosition)

        // Check if user has reached destination
        if (destination && hasReachedDestination(newPosition, destination, finalConfig.destinationThreshold)) {
          onDestinationReached?.()
          cancelNavigation()
          return
        }

        // Smoothly pan the map to follow the user
        if (mapRef.current && isActive) {
          mapRef.current.easeTo({
            center: newPosition,
            duration: finalConfig.mapPanDuration,
            essential: true,
          })
        }
      },
      (error) => {
        console.warn('Geolocation watch error:', error)
      },
      finalConfig.geolocationOptions,
    )
  }, [mapRef, isActive, destination, finalConfig, onDestinationReached, cancelNavigation])

  // Start navigation to destination
  const startNavigation = useCallback(
    async (destinationCoord: Coordinate) => {
      if (!('geolocation' in navigator)) {
        console.warn('Geolocation not available')
        return
      }

      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
          })
        })

        const originCoord: Coordinate = [position.coords.longitude, position.coords.latitude]
        setCurrentUserPosition(originCoord)

        const directionsResult = await fetchWalkingDirections(originCoord, destinationCoord, mapboxAccessToken)

        if (!directionsResult) {
          console.warn('Failed to fetch directions')
          return
        }

        setRoute(directionsResult.feature)
        setInstructions(directionsResult.steps)
        setOrigin(originCoord)
        setDestination(destinationCoord)
        setIsActive(true)

        // Fit map to show the route
        mapRef.current?.fitBounds([originCoord, destinationCoord], { padding: 60 })

        // Start watching user position
        startLocationWatch()
      } catch (error) {
        console.error('Failed to start navigation:', error)
      }
    },
    [mapboxAccessToken, mapRef, startLocationWatch],
  )

  // Update user position manually
  const updateUserPosition = useCallback((position: Coordinate) => {
    setCurrentUserPosition(position)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopLocationWatch()
    }
  }, [stopLocationWatch])

  return {
    // State
    isActive,
    route,
    instructions,
    origin,
    destination,
    currentUserPosition,

    // Actions
    startNavigation,
    cancelNavigation,
    updateUserPosition,
  }
}
