import { useCallback, useEffect, useRef } from 'react'
import type L from 'leaflet'

import { LOCATION_TRACKING_CONFIG, MAP_ZOOM } from '@/constants/map.constants'
import { useLocationTracking, type LocationError, type UserLocation } from '@/hooks/useLocationTracking'

/**
 * Options for the useMapLocation hook
 */
export interface UseMapLocationOptions {
  /** The Leaflet map instance */
  mapInstance: L.Map | null
  /** Whether navigation is currently active */
  isNavigating: boolean
  /** Callback when location updates during navigation */
  onLocationUpdate?: (location: UserLocation) => void
}

/**
 * Return type for the useMapLocation hook
 */
export interface UseMapLocationReturn {
  /** Current user location */
  currentLocation: UserLocation | null
  /** Whether location tracking is active */
  isTracking: boolean
  /** Location error if any */
  locationError: LocationError | null
  /** Start location tracking */
  startTracking: () => Promise<void>
  /** Stop location tracking */
  stopTracking: () => Promise<void>
  /** Get current location once */
  getCurrentLocation: () => Promise<UserLocation>
  /** Request to locate user and center map */
  requestLocate: (zoom?: number) => Promise<void>
  /** Suppress auto-centering temporarily (e.g., after cancelling navigation) */
  suppressAutoCenter: () => void
}

/**
 * Hook for managing user location on the map
 * Wraps useLocationTracking with map-specific functionality like
 * auto-centering and navigation location updates
 *
 * @example
 * ```tsx
 * const { currentLocation, requestLocate, isTracking } = useMapLocation({
 *   mapInstance,
 *   isNavigating,
 *   onLocationUpdate: handleLocationUpdate,
 * })
 *
 * // Center map on user location
 * await requestLocate()
 *
 * // Center at specific zoom
 * await requestLocate(20)
 * ```
 */
export function useMapLocation({
  mapInstance,
  isNavigating,
  onLocationUpdate,
}: UseMapLocationOptions): UseMapLocationReturn {
  const {
    currentLocation,
    startTracking,
    stopTracking,
    getCurrentLocation,
    isTracking,
    error: locationError,
  } = useLocationTracking(LOCATION_TRACKING_CONFIG)

  // Track if we've done initial centering
  const hasCenteredRef = useRef(false)
  // Temporarily suppress auto-centering
  const suppressAutoCenterRef = useRef(false)

  /**
   * Suppress auto-centering temporarily
   * Useful when user cancels navigation and we don't want to snap back
   */
  const suppressAutoCenter = useCallback(() => {
    suppressAutoCenterRef.current = true
    setTimeout(() => {
      suppressAutoCenterRef.current = false
    }, 2000)
  }, [])

  // Handle location updates during navigation
  useEffect(() => {
    if (!isNavigating || !currentLocation || !onLocationUpdate) return
    onLocationUpdate(currentLocation)
  }, [currentLocation, isNavigating, onLocationUpdate])

  // Cleanup tracking on unmount
  useEffect(() => {
    return () => {
      stopTracking()
    }
  }, [stopTracking])

  // Auto-center map on first location update (when not navigating)
  useEffect(() => {
    if (!currentLocation || !mapInstance) return
    if (hasCenteredRef.current) return

    if (suppressAutoCenterRef.current) {
      suppressAutoCenterRef.current = false
      return
    }

    // Don't auto-center during navigation
    if (isNavigating) {
      return
    }

    hasCenteredRef.current = true
    mapInstance.flyTo([currentLocation.latitude, currentLocation.longitude])

    // Reset after a delay to allow future auto-centering
    const timer = setTimeout(() => {
      hasCenteredRef.current = false
    }, 1000)

    return () => clearTimeout(timer)
  }, [currentLocation, mapInstance, isNavigating])

  /**
   * Request to locate user and center the map
   * Starts tracking if not already tracking
   */
  const requestLocate = useCallback(
    async (zoom: number = MAP_ZOOM.LOCATE) => {
      const loc = isTracking
        ? currentLocation
        : await getCurrentLocation().catch(() => {
            alert('Unable to get your location. Check GPS permissions.')
            return null
          })

      if (loc && mapInstance && !isNavigating) {
        startTracking()
        mapInstance.flyTo([loc.latitude, loc.longitude], zoom, { animate: true })
      }
    },
    [isTracking, currentLocation, getCurrentLocation, startTracking, mapInstance, isNavigating],
  )

  return {
    currentLocation,
    isTracking,
    locationError,
    startTracking,
    stopTracking,
    getCurrentLocation,
    requestLocate,
    suppressAutoCenter,
  }
}
