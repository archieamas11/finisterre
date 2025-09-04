import { Capacitor } from '@capacitor/core'
import { Geolocation, type Position } from '@capacitor/geolocation'
import { useState, useEffect, useRef, useCallback } from 'react'

export interface UserLocation {
  latitude: number
  longitude: number
  accuracy: number
  altitude?: number
  altitudeAccuracy?: number
  heading?: number
  speed?: number
  timestamp: number
}

export interface LocationError {
  code: number
  message: string
  timestamp: number
}

export interface UseLocationTrackingOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
  // 🎯 Distance threshold in meters to trigger location updates
  distanceFilter?: number
}

export interface LocationTrackingState {
  currentLocation: UserLocation | null
  isTracking: boolean
  error: LocationError | null
  isSupported: boolean
  lastUpdateTime: number | null
}

const DEFAULT_OPTIONS: Required<UseLocationTrackingOptions> = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 5000,
  distanceFilter: 5, // 📏 5 meters minimum distance
}

/**
 * 📍 Custom hook for tracking user location with high accuracy
 * Provides real-time location updates with error handling and distance filtering
 */
export function useLocationTracking(options: UseLocationTrackingOptions = {}) {
  const [state, setState] = useState<LocationTrackingState>({
    currentLocation: null,
    isTracking: false,
    error: null,
    isSupported: typeof navigator !== 'undefined' && 'geolocation' in navigator,
    lastUpdateTime: null,
  })

  const watchIdRef = useRef<string | number | null>(null)
  const lastLocationRef = useRef<UserLocation | null>(null)
  const optionsRef = useRef({ ...DEFAULT_OPTIONS, ...options })

  // 🔄 Update options ref when options change
  useEffect(() => {
    optionsRef.current = { ...DEFAULT_OPTIONS, ...options }
  }, [options])

  // 🧭 Calculate distance between two locations
  const calculateDistance = useCallback((loc1: UserLocation, loc2: UserLocation): number => {
    const R = 6371000 // 🌍 Earth's radius in meters
    const dLat = ((loc2.latitude - loc1.latitude) * Math.PI) / 180
    const dLon = ((loc2.longitude - loc1.longitude) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((loc1.latitude * Math.PI) / 180) * Math.cos((loc2.latitude * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }, [])

  // ✅ Handle successful location updates
  const onLocationSuccess = useCallback(
    (position: GeolocationPosition | Position) => {
      // Handle both browser and Capacitor position formats
      const coords = 'coords' in position ? position.coords : position

      const newLocation: UserLocation = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
        altitude: coords.altitude ?? undefined,
        altitudeAccuracy: coords.altitudeAccuracy ?? undefined,
        heading: coords.heading ?? undefined,
        speed: coords.speed ?? undefined,
        timestamp: position.timestamp,
      }

      // 🎯 Apply distance filter
      const lastLocation = lastLocationRef.current
      if (lastLocation && optionsRef.current.distanceFilter > 0) {
        const distance = calculateDistance(lastLocation, newLocation)
        if (distance < optionsRef.current.distanceFilter) {
          return // 🚫 Skip update if moved distance is below threshold
        }
      }

      lastLocationRef.current = newLocation
      setState((prev) => ({
        ...prev,
        currentLocation: newLocation,
        error: null,
        lastUpdateTime: Date.now(),
      }))
    },
    [calculateDistance],
  )

  // ❌ Handle location errors
  const onLocationError = useCallback(async (error: GeolocationPositionError) => {
    const locationError: LocationError = {
      code: error.code,
      message: error.message,
      timestamp: Date.now(),
    }

    console.warn('🚫 Location tracking error:', locationError)

    setState((prev) => ({
      ...prev,
      error: locationError,
      isTracking: false,
    }))

    // 🧹 Clear watch if there's an error
    if (watchIdRef.current !== null) {
      if (Capacitor.isNativePlatform()) {
        await Geolocation.clearWatch({ id: watchIdRef.current as string })
      } else {
        navigator.geolocation.clearWatch(watchIdRef.current as number)
      }
      watchIdRef.current = null
    }
  }, [])

  // 🚀 Start location tracking
  const startTracking = useCallback(async () => {
    if (!state.isSupported) {
      setState((prev) => ({
        ...prev,
        error: {
          code: -1,
          message: 'Geolocation is not supported by this device',
          timestamp: Date.now(),
        },
      }))
      return
    }

    if (watchIdRef.current !== null) {
      return // 🔄 Already tracking
    }

    setState((prev) => ({ ...prev, isTracking: true, error: null }))

    const geolocationOptions: PositionOptions = {
      enableHighAccuracy: optionsRef.current.enableHighAccuracy,
      timeout: optionsRef.current.timeout,
      maximumAge: optionsRef.current.maximumAge,
    }

    try {
      if (Capacitor.isNativePlatform()) {
        // Use Capacitor Geolocation for native apps
        const permission = await Geolocation.checkPermissions()
        if (permission.location !== 'granted') {
          const request = await Geolocation.requestPermissions()
          if (request.location !== 'granted') {
            throw new Error('Location permission denied')
          }
        }

        // Start watching position with Capacitor
        const watchId = await Geolocation.watchPosition(geolocationOptions, (position, error) => {
          if (position) {
            onLocationSuccess(position)
          } else if (error) {
            onLocationError({
              code: error.code || -1,
              message: error.message || 'Unknown geolocation error',
            } as GeolocationPositionError)
          }
        })
        watchIdRef.current = watchId
      } else {
        // Use browser geolocation for web
        watchIdRef.current = navigator.geolocation.watchPosition(onLocationSuccess, onLocationError, geolocationOptions)
      }
    } catch (error) {
      console.error('🚫 Failed to start location tracking:', error)
      setState((prev) => ({
        ...prev,
        isTracking: false,
        error: {
          code: -1,
          message: error instanceof Error ? error.message : 'Failed to start tracking',
          timestamp: Date.now(),
        },
      }))
    }
  }, [state.isSupported, onLocationSuccess, onLocationError])

  // 🛑 Stop location tracking
  const stopTracking = useCallback(async () => {
    if (watchIdRef.current !== null) {
      if (Capacitor.isNativePlatform()) {
        // Use Capacitor to clear watch
        await Geolocation.clearWatch({ id: watchIdRef.current as string })
      } else {
        // Use browser geolocation to clear watch
        navigator.geolocation.clearWatch(watchIdRef.current as number)
      }
      watchIdRef.current = null
    }
    setState((prev) => ({ ...prev, isTracking: false }))
  }, [])

  // 📍 Get current location once (without watching)
  const getCurrentLocation = useCallback(async (): Promise<UserLocation> => {
    if (!state.isSupported) {
      throw new Error('Geolocation is not supported by this device')
    }

    const geolocationOptions: PositionOptions = {
      enableHighAccuracy: optionsRef.current.enableHighAccuracy,
      timeout: optionsRef.current.timeout,
      maximumAge: optionsRef.current.maximumAge,
    }

    if (Capacitor.isNativePlatform()) {
      // Use Capacitor Geolocation for native apps
      const permission = await Geolocation.checkPermissions()
      if (permission.location !== 'granted') {
        const request = await Geolocation.requestPermissions()
        if (request.location !== 'granted') {
          throw new Error('Location permission denied')
        }
      }

      const position = await Geolocation.getCurrentPosition(geolocationOptions)
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude ?? undefined,
        altitudeAccuracy: position.coords.altitudeAccuracy ?? undefined,
        heading: position.coords.heading ?? undefined,
        speed: position.coords.speed ?? undefined,
        timestamp: position.timestamp,
      }
    } else {
      // Use browser geolocation for web
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location: UserLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude ?? undefined,
              altitudeAccuracy: position.coords.altitudeAccuracy ?? undefined,
              heading: position.coords.heading ?? undefined,
              speed: position.coords.speed ?? undefined,
              timestamp: position.timestamp,
            }
            resolve(location)
          },
          (error) => reject(new Error(error.message)),
          geolocationOptions,
        )
      })
    }
  }, [state.isSupported])

  // 🧹 Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        if (Capacitor.isNativePlatform()) {
          Geolocation.clearWatch({ id: watchIdRef.current as string }).catch(console.error)
        } else {
          navigator.geolocation.clearWatch(watchIdRef.current as number)
        }
        watchIdRef.current = null
      }
    }
  }, [])

  return {
    ...state,
    startTracking,
    stopTracking,
    getCurrentLocation,
    // 🎯 Convenience getters
    isLocationAvailable: state.currentLocation !== null,
    locationAge: state.currentLocation ? Date.now() - state.currentLocation.timestamp : null,
  }
}
