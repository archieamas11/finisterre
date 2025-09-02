import { useState, useCallback, useEffect, useRef } from 'react'

import {
  getValhallaRoute,
  createPedestrianRouteRequest,
  createAutoRouteRequest,
  decodePolyline,
  isOffRoute,
  type ValhallaRouteResponse,
  type ValhallaManeuver,
  type ValhallaRouteRequest,
} from '@/api/valhalla.api'

import { type UserLocation } from './useLocationTracking'

export interface RouteDestination {
  latitude: number
  longitude: number
  name?: string
}

export interface RouteState {
  isLoading: boolean
  route: ValhallaRouteResponse | null
  routeCoordinates: [number, number][]
  originalStart: [number, number] | null
  originalEnd: [number, number] | null
  remainingCoordinates: [number, number][]
  progressIndex: number
  error: string | null
  isNavigating: boolean
  rerouteCount: number
}

export interface NavigationState {
  currentManeuver: ValhallaManeuver | null
  nextManeuver: ValhallaManeuver | null
  maneuverIndex: number
  distanceToDestination: number | null
  estimatedTimeRemaining: number | null
}

export interface UseValhallaOptions {
  // 🚗 Routing preferences
  costingType?: 'auto' | 'pedestrian' | 'bicycle'
  // 📏 Distance threshold to consider user off-route (meters)
  offRouteThreshold?: number
  // 🔄 Maximum number of automatic reroutes
  maxReroutes?: number
  // ⏱️ Minimum time between reroute attempts (ms)
  rerouteDebounceTime?: number
  // 🎯 Auto-reroute when user goes off route
  enableAutoReroute?: boolean
}

const DEFAULT_OPTIONS: Required<UseValhallaOptions> = {
  costingType: 'pedestrian',
  offRouteThreshold: 50, // 📏 50 meters
  maxReroutes: 5,
  rerouteDebounceTime: 3000, // ⏱️ 3 seconds
  enableAutoReroute: true,
}

/**
 * 🧭 Main hook for Valhalla routing and navigation
 * Handles route calculation, real-time navigation, and automatic rerouting
 */
export function useValhalla(options: UseValhallaOptions = {}) {
  const optionsRef = useRef({ ...DEFAULT_OPTIONS, ...options })
  const [routeState, setRouteState] = useState<RouteState>({
    isLoading: false,
    route: null,
    routeCoordinates: [],
    originalStart: null,
    originalEnd: null,
    remainingCoordinates: [],
    progressIndex: 0,
    error: null,
    isNavigating: false,
    rerouteCount: 0,
  })

  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentManeuver: null,
    nextManeuver: null,
    maneuverIndex: 0,
    distanceToDestination: null,
    estimatedTimeRemaining: null,
  })

  const destinationRef = useRef<RouteDestination | null>(null)
  const lastRerouteTimeRef = useRef<number>(0)
  const isReroutingRef = useRef<boolean>(false)

  // 🔄 Update options ref when options change
  useEffect(() => {
    optionsRef.current = { ...DEFAULT_OPTIONS, ...options }
  }, [options])

  // 🗺️ Calculate route to destination
  const calculateRoute = useCallback(async (from: { latitude: number; longitude: number }, to: RouteDestination, forceRecalculate: boolean = false) => {
    console.log('🧭 Starting route calculation:', { from, to, forceRecalculate, costingType: optionsRef.current.costingType })

    try {
      // 🎯 Store original coordinates before API call
      const originalStart: [number, number] = [from.latitude, from.longitude]
      const originalEnd: [number, number] = [to.latitude, to.longitude]

      setRouteState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        rerouteCount: forceRecalculate ? prev.rerouteCount + 1 : 0,
        originalStart,
        originalEnd,
      }))

      destinationRef.current = to

      // 🎯 Create appropriate route request based on costing type
      let request: ValhallaRouteRequest
      if (optionsRef.current.costingType === 'auto') {
        request = createAutoRouteRequest({ lat: from.latitude, lon: from.longitude }, { lat: to.latitude, lon: to.longitude })
      } else {
        request = createPedestrianRouteRequest({ lat: from.latitude, lon: from.longitude }, { lat: to.latitude, lon: to.longitude })
      }

      console.log('🚀 Sending Valhalla request:', request)
      const response = await getValhallaRoute(request)
      console.log('✅ Valhalla response received:', {
        legs: response.trip.legs.length,
        totalDistance: response.trip.summary.length,
        totalTime: response.trip.summary.time,
      })

      // 📍 Decode route coordinates from the first leg
      let coordinates: [number, number][] = []
      if (response.trip.legs.length > 0) {
        coordinates = decodePolyline(response.trip.legs[0].shape)
      }

      console.log({
        originalStart,
        originalEnd,
        snappedStart: coordinates[0],
        snappedEnd: coordinates[coordinates.length - 1],
        coordinatesCount: coordinates.length,
      })

      setRouteState((prev) => ({
        ...prev,
        isLoading: false,
        route: response,
        routeCoordinates: coordinates,
        remainingCoordinates: coordinates, // 🎯 Initially show full route
        progressIndex: 0,
        error: null,
      }))

      // 🧭 Initialize navigation state
      if (response.trip.legs.length > 0 && response.trip.legs[0].maneuvers.length > 0) {
        const maneuvers = response.trip.legs[0].maneuvers
        setNavigationState({
          currentManeuver: maneuvers[0] || null,
          nextManeuver: maneuvers[1] || null,
          maneuverIndex: 0,
          distanceToDestination: response.trip.summary.length,
          estimatedTimeRemaining: response.trip.summary.time,
        })
      }

      return response
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to calculate route'
      console.error('🚫 Route calculation failed:', {
        error,
        from: { latitude: from.latitude, longitude: from.longitude },
        to: { latitude: to.latitude, longitude: to.longitude },
        costingType: optionsRef.current.costingType,
        errorMessage,
      })

      setRouteState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        route: null,
        routeCoordinates: [],
      }))

      throw error
    }
  }, [])

  // 🎯 Start navigation to destination
  const startNavigation = useCallback(
    async (from: { latitude: number; longitude: number }, to: RouteDestination) => {
      try {
        await calculateRoute(from, to)
        setRouteState((prev) => ({ ...prev, isNavigating: true }))
      } catch (error) {
        console.error('🚫 Failed to start navigation:', error)
        throw error
      }
    },
    [calculateRoute],
  )

  // 🛑 Stop navigation
  const stopNavigation = useCallback(() => {
    setRouteState((prev) => ({
      ...prev,
      isNavigating: false,
      route: null,
      routeCoordinates: [],
      originalStart: null,
      originalEnd: null,
      remainingCoordinates: [],
      progressIndex: 0,
      error: null,
      rerouteCount: 0,
    }))
    setNavigationState({
      currentManeuver: null,
      nextManeuver: null,
      maneuverIndex: 0,
      distanceToDestination: null,
      estimatedTimeRemaining: null,
    })
    destinationRef.current = null
    isReroutingRef.current = false
  }, [])

  // 🔄 Handle automatic rerouting
  const checkAndReroute = useCallback(
    async (userLocation: UserLocation) => {
      if (
        !routeState.isNavigating ||
        !destinationRef.current ||
        isReroutingRef.current ||
        !optionsRef.current.enableAutoReroute ||
        routeState.rerouteCount >= optionsRef.current.maxReroutes
      ) {
        return
      }

      // ⏱️ Check reroute debounce time
      const now = Date.now()
      if (now - lastRerouteTimeRef.current < optionsRef.current.rerouteDebounceTime) {
        return
      }

      // 🎯 Check if user is off route
      if (isOffRoute(userLocation.latitude, userLocation.longitude, routeState.routeCoordinates, optionsRef.current.offRouteThreshold)) {
        console.log('🔄 User is off route, recalculating...')

        isReroutingRef.current = true
        lastRerouteTimeRef.current = now

        try {
          await calculateRoute(
            {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            },
            destinationRef.current,
            true, // 🔄 Force recalculate
          )
        } catch (error) {
          console.error('🚫 Rerouting failed:', error)
        } finally {
          isReroutingRef.current = false
        }
      }
    },
    [routeState.isNavigating, routeState.routeCoordinates, routeState.rerouteCount, calculateRoute],
  )

  // 📍 Update route progress based on user location (for dynamic polyline)
  const updateRouteProgress = useCallback(
    (userLocation: UserLocation) => {
      if (!routeState.routeCoordinates.length || !routeState.isNavigating) return

      const coordinates = routeState.routeCoordinates
      let closestIndex = routeState.progressIndex
      let closestDistance = Infinity

      // 🔍 Find the closest point on the route to the user's current location
      // Start from current progress index to avoid going backwards
      const startIndex = Math.max(0, routeState.progressIndex - 2)
      for (let i = startIndex; i < coordinates.length; i++) {
        const [routeLat, routeLon] = coordinates[i]
        const distance = Math.sqrt(Math.pow(userLocation.latitude - routeLat, 2) + Math.pow(userLocation.longitude - routeLon, 2))

        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = i
        }
      }

      // 🎯 Only update if we've made significant progress forward
      if (closestIndex > routeState.progressIndex || closestDistance < 0.0001) {
        // ~10 meters threshold
        const remainingCoordinates = coordinates.slice(closestIndex)

        setRouteState((prev) => ({
          ...prev,
          progressIndex: closestIndex,
          remainingCoordinates,
        }))
      }
    },
    [routeState.routeCoordinates, routeState.isNavigating, routeState.progressIndex],
  )

  // 🧭 Update navigation progress based on user location
  const updateNavigationProgress = useCallback(
    (userLocation: UserLocation) => {
      if (!routeState.route || !routeState.isNavigating) return

      // 🎯 Find closest maneuver based on user location
      const maneuvers = routeState.route.trip.legs[0]?.maneuvers || []
      if (maneuvers.length === 0) return

      // 🔍 Simple logic: advance to next maneuver if user is close to it
      // In a production app, you'd use more sophisticated logic here
      const coordinates = routeState.routeCoordinates
      if (coordinates.length === 0) return

      let closestDistance = Infinity
      // read current maneuver index from navigationState for comparison
      let closestIndex = navigationState.maneuverIndex

      for (let i = Math.max(0, navigationState.maneuverIndex - 1); i < maneuvers.length; i++) {
        const maneuver = maneuvers[i]
        if (maneuver.begin_shape_index < coordinates.length) {
          const [maneuverLat, maneuverLon] = coordinates[maneuver.begin_shape_index]
          const distance = Math.sqrt(Math.pow(userLocation.latitude - maneuverLat, 2) + Math.pow(userLocation.longitude - maneuverLon, 2))

          if (distance < closestDistance) {
            closestDistance = distance
            closestIndex = i
          }
        }
      }

      // 📍 Update navigation state if we've progressed
      if (closestIndex !== navigationState.maneuverIndex) {
        setNavigationState((prev) => ({
          currentManeuver: maneuvers[closestIndex] || null,
          nextManeuver: maneuvers[closestIndex + 1] || null,
          maneuverIndex: closestIndex,
          // preserve previous distance/time until a real calculation is implemented
          distanceToDestination: prev.distanceToDestination,
          estimatedTimeRemaining: prev.estimatedTimeRemaining,
        }))
      }
    },
    [routeState.route, routeState.isNavigating, routeState.routeCoordinates, navigationState.maneuverIndex],
  )

  // 📍 Main function to handle location updates during navigation
  const handleLocationUpdate = useCallback(
    async (userLocation: UserLocation) => {
      if (routeState.isNavigating) {
        updateRouteProgress(userLocation)
        updateNavigationProgress(userLocation)
        await checkAndReroute(userLocation)
      }
    },
    [routeState.isNavigating, updateRouteProgress, updateNavigationProgress, checkAndReroute],
  )

  return {
    // 🗺️ Route state
    ...routeState,

    // 🧭 Navigation state
    navigation: navigationState,

    // 🎯 Actions
    calculateRoute,
    startNavigation,
    stopNavigation,
    handleLocationUpdate,

    // 🔧 Utils
    isRerouting: isReroutingRef.current,
    destination: destinationRef.current,

    // 📊 Statistics
    hasRoute: routeState.route !== null,
    totalDistance: routeState.route?.trip.summary.length || null,
    totalTime: routeState.route?.trip.summary.time || null,
  }
}
