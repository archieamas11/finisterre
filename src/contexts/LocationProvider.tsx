import type { LocationError, UseLocationTrackingOptions, UserLocation } from '@/hooks/useLocationTracking'
import type L from 'leaflet'
import type { ReactNode } from 'react'
import { useCallback, useMemo, useRef } from 'react'

import { useLocationTracking } from '@/hooks/useLocationTracking'
import { LocationContext } from './contexts'

export interface LocationContextValue {
  currentLocation: UserLocation | null
  isTracking: boolean
  error: LocationError | null
  isSupported: boolean
  lastUpdateTime: number | null
  startTracking: () => Promise<void>
  stopTracking: () => Promise<void>
  getCurrentLocation: () => Promise<UserLocation>
  isLocationAvailable: boolean
  locationAge: number | null
  requestLocate: (zoom?: number) => Promise<void>
  setMapInstance: (map: L.Map | null) => void
}

interface LocationProviderProps {
  children: ReactNode
  options?: UseLocationTrackingOptions
}

export function LocationProvider({ children, options }: LocationProviderProps) {
  const {
    currentLocation,
    isTracking,
    error,
    isSupported,
    lastUpdateTime,
    startTracking,
    stopTracking,
    getCurrentLocation,
    isLocationAvailable,
    locationAge,
  } = useLocationTracking(options)

  const mapInstanceRef = useRef<L.Map | null>(null)

  // Allow setting map instance from outside
  const setMapInstance = useCallback((map: L.Map | null) => {
    mapInstanceRef.current = map
  }, [])

  const requestLocate = useCallback(
    async (zoom: number = 18) => {
      const loc = isTracking
        ? currentLocation
        : await getCurrentLocation().catch(() => {
            alert('Unable to get your location. Check GPS permissions.')
            return null
          })

      if (loc && mapInstanceRef.current) {
        startTracking()
        mapInstanceRef.current.flyTo([loc.latitude, loc.longitude], zoom, { animate: true })
      }
    },
    [isTracking, currentLocation, getCurrentLocation, startTracking],
  )

  // Expose internal refs for coordination
  const contextValue = useMemo<LocationContextValue>(
    () => ({
      currentLocation,
      isTracking,
      error,
      isSupported,
      lastUpdateTime,
      startTracking,
      stopTracking,
      getCurrentLocation,
      isLocationAvailable,
      locationAge,
      requestLocate,
      setMapInstance,
    }),
    [
      currentLocation,
      isTracking,
      error,
      isSupported,
      lastUpdateTime,
      startTracking,
      stopTracking,
      getCurrentLocation,
      isLocationAvailable,
      locationAge,
      requestLocate,
      setMapInstance,
    ],
  )

  return <LocationContext.Provider value={contextValue}>{children}</LocationContext.Provider>
}
