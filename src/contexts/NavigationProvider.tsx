import type { ValhallaManeuver, ValhallaRouteResponse } from '@/api/valhalla.api'
import type { UserLocation } from '@/hooks/useLocationTracking'
import type { RouteDestination, UseValhallaOptions } from '@/hooks/useValhalla'
import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { parseAsString, useQueryStates } from 'nuqs'
import { toast } from 'sonner'

import { useValhalla } from '@/hooks/useValhalla'
import { isNativePlatform } from '@/utils/platform.utils'
import { NavigationContext } from './contexts'
import { useLocation } from './hooks'

export interface NavigationContextValue {
  // Route state
  route: ValhallaRouteResponse | null
  routeCoordinates: [number, number][]
  remainingCoordinates: [number, number][]
  originalStart: [number, number] | null
  originalEnd: [number, number] | null
  isNavigating: boolean
  isRerouting: boolean
  totalDistance: number | null
  totalTime: number | null
  rerouteCount: number
  error: string | null

  // Navigation state
  navigation: {
    currentManeuver: ValhallaManeuver | null
    nextManeuver: ValhallaManeuver | null
    maneuverIndex: number
    distanceToDestination: number | null
    estimatedTimeRemaining: number | null
  }

  // Actions
  startNavigation: (from: UserLocation, to: RouteDestination) => Promise<void>
  stopNavigation: () => void
  handleDirectionClick: (to: [number, number]) => Promise<void>
  cancelNavigation: () => void
}

interface NavigationProviderProps {
  children: ReactNode
  options?: UseValhallaOptions
  onNavigationStart?: () => void
  onNavigationEnd?: () => void
  onError?: (error: string) => void
}

export function NavigationProvider({ children, options, onNavigationStart, onNavigationEnd, onError }: NavigationProviderProps) {
  const { currentLocation, isTracking, getCurrentLocation, startTracking, requestLocate } = useLocation()

  const {
    route,
    routeCoordinates,
    remainingCoordinates,
    originalStart,
    originalEnd,
    navigation,
    isNavigating,
    isRerouting,
    startNavigation: valhallaStartNavigation,
    stopNavigation: valhallaStopNavigation,
    handleLocationUpdate,
    totalDistance,
    totalTime,
    rerouteCount,
    error: routingError,
  } = useValhalla(options)

  const [query, setQuery] = useQueryStates(
    {
      to: parseAsString,
      from: parseAsString,
      direction: parseAsString,
      lat: parseAsString,
      lng: parseAsString,
    },
    { clearOnDefault: true },
  )

  // Sync current location with routing
  useEffect(() => {
    if (!isNavigating || !currentLocation) return
    handleLocationUpdate(currentLocation)
  }, [currentLocation, isNavigating, handleLocationUpdate])

  // Handle routing errors
  useEffect(() => {
    if (!routingError) return
    const message = 'Unable to get directions. Please try again.'
    onError?.(message)
    if (isNativePlatform()) {
      // Parent will handle Konsta notification
    } else {
      toast.error(message)
    }
  }, [routingError, onError])

  const stopNavigation = useCallback(() => {
    valhallaStopNavigation()
    onNavigationEnd?.()
  }, [valhallaStopNavigation, onNavigationEnd])

  const handleDirectionClick = useCallback(
    async (to: [number, number]) => {
      const [toLat, toLng] = to
      if (!toLat || !toLng) return

      try {
        const from = currentLocation || (await getCurrentLocation())
        if (!from) throw new Error('Could not determine current location')

        await valhallaStartNavigation(from, { latitude: toLat, longitude: toLng })

        setQuery({
          direction: null,
          lat: null,
          lng: null,
          from: `${from.latitude.toFixed(6)},${from.longitude.toFixed(6)}`,
          to: `${toLat.toFixed(6)},${toLng.toFixed(6)}`,
        })

        if (!isTracking) await requestLocate()
        onNavigationStart?.()
      } catch (err: unknown) {
        const errorMsg = `Navigation failed: ${err instanceof Error ? err.message : 'Unknown error'}`
        onError?.(errorMsg)
        if (!isNativePlatform()) {
          toast.error(errorMsg)
        }
        if (!isTracking) await startTracking().catch(() => {})
      }
    },
    [currentLocation, getCurrentLocation, isTracking, valhallaStartNavigation, requestLocate, setQuery, startTracking, onNavigationStart, onError],
  )

  const lastDestSigRef = useRef<string | null>(null)
  const lastCancelledDestRef = useRef<string | null>(null)

  const cancelNavigation = useCallback(() => {
    const currentTo = query.to
    if (currentTo) lastCancelledDestRef.current = currentTo
    lastDestSigRef.current = null
    setQuery({ from: null, to: null })
    stopNavigation()
  }, [stopNavigation, setQuery, query.to])

  // Auto-start navigation from URL params
  useEffect(() => {
    const to = query.to
    if (!to) return
    if (lastDestSigRef.current === to) return
    if (lastCancelledDestRef.current === to) return
    if (isNavigating) return
    const parts = to.split(',')
    if (parts.length !== 2) return
    const a = parseFloat(parts[0])
    const b = parseFloat(parts[1])
    if (isNaN(a) || isNaN(b)) return
    lastDestSigRef.current = to
    lastCancelledDestRef.current = null
    handleDirectionClick([a, b])
  }, [query.to, handleDirectionClick, isNavigating])

  const contextValue = useMemo<NavigationContextValue>(
    () => ({
      route,
      routeCoordinates,
      remainingCoordinates,
      originalStart,
      originalEnd,
      isNavigating,
      isRerouting,
      totalDistance,
      totalTime,
      rerouteCount,
      error: routingError,
      navigation,
      startNavigation: valhallaStartNavigation,
      stopNavigation,
      handleDirectionClick,
      cancelNavigation,
    }),
    [
      route,
      routeCoordinates,
      remainingCoordinates,
      originalStart,
      originalEnd,
      isNavigating,
      isRerouting,
      totalDistance,
      totalTime,
      rerouteCount,
      routingError,
      navigation,
      valhallaStartNavigation,
      stopNavigation,
      handleDirectionClick,
      cancelNavigation,
    ],
  )

  return <NavigationContext.Provider value={contextValue}>{children}</NavigationContext.Provider>
}
