import type { MapAction } from '@/contexts/MapContext'
import type { UserLocation } from '@/hooks/useLocationTracking'
import type { NavigationState as ValhallaNavigationState } from '@/hooks/useValhalla'
import type { ValhallaRouteResponse } from '@/api/valhalla.api'
import { useCallback, useEffect, useRef } from 'react'
import type L from 'leaflet'
import { parseAsString, useQueryStates } from 'nuqs'

import { VALHALLA_CONFIG } from '@/constants/map.constants'
import { useValhalla } from '@/hooks/useValhalla'
import { isNativePlatform } from '@/utils/platform.utils'

/**
 * Query state for navigation URL parameters
 */
export interface NavigationQuery {
  to: string | null
  from: string | null
  direction: string | null
  lat: string | null
  lng: string | null
}

/**
 * Options for the useMapNavigation hook
 */
export interface UseMapNavigationOptions {
  /** The Leaflet map instance */
  mapInstance: L.Map | null
  /** Current user location */
  currentLocation: UserLocation | null
  /** Whether location tracking is active */
  isTracking: boolean
  /** Get current location function */
  getCurrentLocation: () => Promise<UserLocation>
  /** Start location tracking function */
  startTracking: () => Promise<void>
  /** Request to locate user and center map */
  requestLocate: () => Promise<void>
  /** Suppress auto-centering */
  suppressAutoCenter: () => void
  /** Dispatch function for map state reducer */
  dispatch: React.Dispatch<MapAction>
  /** Notification function for errors */
  notifyError: (message: string, title?: string) => void
  /** Initial direction from props (for deep linking) */
  initialDirection?: { lat: number; lng: number } | null
}

/**
 * Return type for the useMapNavigation hook
 */
export interface UseMapNavigationReturn {
  /** Handle direction click from markers */
  handleDirectionClick: (to: [number, number]) => Promise<void>
  /** Cancel current navigation */
  cancelNavigation: () => void
  /** Current navigation query state */
  query: NavigationQuery
  /** Set navigation query state */
  setQuery: (query: Partial<NavigationQuery>) => void
  /** Whether navigation is currently active */
  isNavigating: boolean
  /** Whether rerouting is in progress */
  isRerouting: boolean
  /** Current route data */
  route: ValhallaRouteResponse | null
  /** Route coordinates */
  routeCoordinates: [number, number][]
  /** Remaining route coordinates */
  remainingCoordinates: [number, number][]
  /** Original start point */
  originalStart: [number, number] | null
  /** Original end point */
  originalEnd: [number, number] | null
  /** Navigation state (current maneuver, etc.) */
  navigation: ValhallaNavigationState
  /** Total distance of route in meters */
  totalDistance: number | null
  /** Total estimated time in seconds */
  totalTime: number | null
  /** Number of reroutes performed */
  rerouteCount: number
  /** Handle location updates during navigation */
  handleLocationUpdate: (location: UserLocation) => void
  /** Routing error if any */
  routingError: string | null
}

/**
 * Hook for managing map navigation
 * Handles route calculation, URL query params, and navigation state
 *
 * @example
 * ```tsx
 * const {
 *   handleDirectionClick,
 *   cancelNavigation,
 *   isNavigating,
 *   route,
 * } = useMapNavigation({
 *   mapInstance,
 *   currentLocation,
 *   isTracking,
 *   getCurrentLocation,
 *   startTracking,
 *   requestLocate,
 *   suppressAutoCenter,
 *   dispatch,
 *   notifyError,
 * })
 *
 * // Start navigation to a point
 * await handleDirectionClick([10.248, 123.798])
 *
 * // Cancel navigation
 * cancelNavigation()
 * ```
 */
export function useMapNavigation({
  mapInstance,
  currentLocation,
  isTracking,
  getCurrentLocation,
  startTracking,
  requestLocate,
  suppressAutoCenter,
  dispatch,
  notifyError,
  initialDirection,
}: UseMapNavigationOptions): UseMapNavigationReturn {
  const {
    route,
    routeCoordinates,
    remainingCoordinates,
    originalStart,
    originalEnd,
    navigation,
    isNavigating,
    isRerouting,
    startNavigation,
    stopNavigation,
    handleLocationUpdate,
    totalDistance,
    totalTime,
    rerouteCount,
    error: routingError,
  } = useValhalla(VALHALLA_CONFIG)

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

  // Track destinations to prevent duplicate navigation
  const lastDestSigRef = useRef<string | null>(null)
  const lastCancelledDestRef = useRef<string | null>(null)
  const lastInitDirRef = useRef<string | null>(null)

  /**
   * Cancel current navigation and reset state
   */
  const cancelNavigation = useCallback(() => {
    const currentTo = query.to
    if (currentTo) lastCancelledDestRef.current = currentTo
    lastDestSigRef.current = null
    setQuery({ from: null, to: null })
    stopNavigation()
    dispatch({ type: 'SET_NAV_OPEN', value: false })
    dispatch({ type: 'SET_DIRECTION_LOADING', value: false })
    suppressAutoCenter()
  }, [stopNavigation, setQuery, query.to, dispatch, suppressAutoCenter])

  /**
   * Handle direction click from markers
   * Starts navigation from current location to destination
   */
  const handleDirectionClick = useCallback(
    async (to: [number, number]) => {
      const [toLat, toLng] = to
      if (!toLat || !toLng) return

      dispatch({ type: 'SET_DIRECTION_LOADING', value: true })
      dispatch({ type: 'SET_NAV_OPEN', value: false })

      try {
        const from = currentLocation || (await getCurrentLocation())
        if (!from) throw new Error('Could not determine current location')

        await startNavigation(from, { latitude: toLat, longitude: toLng })

        setQuery({
          direction: null,
          lat: null,
          lng: null,
          from: `${from.latitude.toFixed(6)},${from.longitude.toFixed(6)}`,
          to: `${toLat.toFixed(6)},${toLng.toFixed(6)}`,
        })

        if (!isTracking) await requestLocate()
        dispatch({ type: 'SET_NAV_OPEN', value: true })
      } catch (err: unknown) {
        notifyError(`Navigation failed: ${err instanceof Error ? err.message : 'Unknown error'}`, 'Navigation Error')
        if (!isTracking) await startTracking().catch(() => { })
      } finally {
        dispatch({ type: 'SET_DIRECTION_LOADING', value: false })
      }
    },
    [currentLocation, getCurrentLocation, isTracking, startNavigation, requestLocate, setQuery, startTracking, dispatch, notifyError],
  )

  // Handle navigation from URL query params
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

  // Auto-locate when nav params are present
  useEffect(() => {
    if (!mapInstance) return
    if (isNavigating) return

    const hasNavParam = Boolean(query.to || query.from)
    if (!hasNavParam) return

    void requestLocate()
  }, [mapInstance, query.to, query.from, requestLocate, isNavigating])

  // Handle initial direction from props (deep linking on native)
  useEffect(() => {
    if (!initialDirection || !isNativePlatform()) return

    const sig = `${initialDirection.lat},${initialDirection.lng}`
    if (lastInitDirRef.current === sig) return
    if (isNavigating) return

    lastInitDirRef.current = sig
    requestAnimationFrame(() => handleDirectionClick([initialDirection.lat, initialDirection.lng]))
  }, [initialDirection, handleDirectionClick, isNavigating])

  return {
    handleDirectionClick,
    cancelNavigation,
    query,
    setQuery,
    isNavigating,
    isRerouting,
    route,
    routeCoordinates,
    remainingCoordinates,
    originalStart,
    originalEnd,
    navigation,
    totalDistance,
    totalTime,
    rerouteCount,
    handleLocationUpdate,
    routingError,
  }
}
