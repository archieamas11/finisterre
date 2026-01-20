import type {
  ValhallaManeuver,
  ValhallaRouteRequest,
  ValhallaRouteResponse,
} from '@/api/valhalla.api'
import { useCallback, useEffect, useRef, useState } from 'react'

import {
  createAutoRouteRequest,
  createPedestrianRouteRequest,
  createBicycleRouteRequest,
  decodePolyline,
  getValhallaRoute,
  isOffRoute,
  findClosestPointOnRoute,
  calculateRemainingDistance,
  estimateRemainingTime,
  calculateDistance,
  isDestinationManeuver,
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
  distanceToManeuver: number | null
  distanceToDestination: number | null
  estimatedTimeRemaining: number | null
  // Pre-announcement for upcoming turns
  shouldAnnounce: boolean
  announcementDistance: 'far' | 'approaching' | 'now' | null
}

export interface UseValhallaOptions {
  costingType?: 'auto' | 'pedestrian' | 'bicycle'
  offRouteThreshold?: number
  maxReroutes?: number
  rerouteDebounceTime?: number
  enableAutoReroute?: boolean
  // Pre-announcement thresholds (in meters)
  farAnnouncementDistance?: number
  approachingAnnouncementDistance?: number
  nowAnnouncementDistance?: number
}

const DEFAULT_OPTIONS: Required<UseValhallaOptions> = {
  costingType: 'pedestrian',
  offRouteThreshold: 35, // Reduced for pedestrian accuracy
  maxReroutes: 5,
  rerouteDebounceTime: 5000,
  enableAutoReroute: true,
  farAnnouncementDistance: 200,
  approachingAnnouncementDistance: 50,
  nowAnnouncementDistance: 15,
}

/**
 * High-performance hook for Valhalla routing and navigation
 * Optimized for fast route calculation and smooth real-time updates
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
  const routeStateRef = useRef(routeState)

  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentManeuver: null,
    nextManeuver: null,
    maneuverIndex: 0,
    distanceToManeuver: null,
    distanceToDestination: null,
    estimatedTimeRemaining: null,
    shouldAnnounce: false,
    announcementDistance: null,
  })
  const navigationStateRef = useRef(navigationState)

  const destinationRef = useRef<RouteDestination | null>(null)
  const lastRerouteTimeRef = useRef<number>(0)
  const isReroutingRef = useRef<boolean>(false)
  const lastAnnouncedManeuverRef = useRef<number>(-1)
  const lastAnnouncementDistanceRef = useRef<'far' | 'approaching' | 'now' | null>(null)

  // Sync refs with state
  useEffect(() => {
    routeStateRef.current = routeState
  }, [routeState])

  useEffect(() => {
    navigationStateRef.current = navigationState
  }, [navigationState])

  useEffect(() => {
    optionsRef.current = { ...DEFAULT_OPTIONS, ...options }
  }, [options])

  /**
   * Calculate route to destination with retry logic
   */
  const calculateRoute = useCallback(
    async (
      from: { latitude: number; longitude: number },
      to: RouteDestination,
      forceRecalculate: boolean = false,
    ) => {
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

      try {
        // Create appropriate route request
        let request: ValhallaRouteRequest
        const costing = optionsRef.current.costingType

        if (costing === 'auto') {
          request = createAutoRouteRequest(
            { lat: from.latitude, lon: from.longitude },
            { lat: to.latitude, lon: to.longitude },
          )
        } else if (costing === 'bicycle') {
          request = createBicycleRouteRequest(
            { lat: from.latitude, lon: from.longitude },
            { lat: to.latitude, lon: to.longitude },
          )
        } else {
          request = createPedestrianRouteRequest(
            { lat: from.latitude, lon: from.longitude },
            { lat: to.latitude, lon: to.longitude },
          )
        }

        const response = await getValhallaRoute(request, 2)

        // Decode route coordinates
        let coordinates: [number, number][] = []
        if (response.trip.legs.length > 0) {
          coordinates = decodePolyline(response.trip.legs[0].shape)
        }

        setRouteState((prev) => ({
          ...prev,
          isLoading: false,
          route: response,
          routeCoordinates: coordinates,
          remainingCoordinates: coordinates,
          progressIndex: 0,
          error: null,
        }))

        // Initialize navigation state with first maneuver
        if (response.trip.legs.length > 0 && response.trip.legs[0].maneuvers.length > 0) {
          const maneuvers = response.trip.legs[0].maneuvers
          const firstManeuver = maneuvers[0]
          const distanceToDestination = response.trip.summary.length * 1000 // Convert km to m

          setNavigationState({
            currentManeuver: firstManeuver,
            nextManeuver: maneuvers[1] || null,
            maneuverIndex: 0,
            distanceToManeuver: firstManeuver.length * 1000,
            distanceToDestination,
            estimatedTimeRemaining: response.trip.summary.time,
            shouldAnnounce: true,
            announcementDistance: 'far',
          })

          // Reset announcement tracking
          lastAnnouncedManeuverRef.current = -1
          lastAnnouncementDistanceRef.current = null
        }

        return response
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to calculate route'

        setRouteState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
          route: null,
          routeCoordinates: [],
        }))

        throw error
      }
    },
    [],
  )

  /**
   * Start navigation to destination
   */
  const startNavigation = useCallback(
    async (from: { latitude: number; longitude: number }, to: RouteDestination) => {
      try {
        await calculateRoute(from, to)
        setRouteState((prev) => ({ ...prev, isNavigating: true }))
      } catch (error) {
        console.error('Failed to start navigation:', error)
        throw error
      }
    },
    [calculateRoute],
  )

  /**
   * Stop navigation and clear state
   */
  const stopNavigation = useCallback(() => {
    setRouteState({
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

    setNavigationState({
      currentManeuver: null,
      nextManeuver: null,
      maneuverIndex: 0,
      distanceToManeuver: null,
      distanceToDestination: null,
      estimatedTimeRemaining: null,
      shouldAnnounce: false,
      announcementDistance: null,
    })

    destinationRef.current = null
    isReroutingRef.current = false
    lastAnnouncedManeuverRef.current = -1
    lastAnnouncementDistanceRef.current = null
  }, [])

  /**
   * Check if reroute is needed and perform it
   */
  const checkAndReroute = useCallback(
    async (userLocation: UserLocation) => {
      const rs = routeStateRef.current
      const opts = optionsRef.current

      if (
        !rs.isNavigating ||
        !destinationRef.current ||
        isReroutingRef.current ||
        !opts.enableAutoReroute ||
        rs.rerouteCount >= opts.maxReroutes
      ) {
        return
      }

      const now = Date.now()
      if (now - lastRerouteTimeRef.current < opts.rerouteDebounceTime) {
        return
      }

      const offRouteResult = isOffRoute(
        userLocation.latitude,
        userLocation.longitude,
        rs.routeCoordinates,
        opts.offRouteThreshold,
        userLocation.heading,
        rs.progressIndex,
      )

      if (offRouteResult.isOff) {
        console.log(`User is ${offRouteResult.distance.toFixed(0)}m off route, rerouting...`)
        isReroutingRef.current = true
        lastRerouteTimeRef.current = now

        try {
          await calculateRoute(
            { latitude: userLocation.latitude, longitude: userLocation.longitude },
            destinationRef.current,
            true,
          )
        } catch (error) {
          console.error('Rerouting failed:', error)
        } finally {
          isReroutingRef.current = false
        }
      }
    },
    [calculateRoute],
  )

  /**
   * Update route progress based on user location
   * Optimized with spatial search and batched updates
   */
  const updateRouteProgress = useCallback((userLocation: UserLocation) => {
    const rs = routeStateRef.current
    if (!rs.routeCoordinates.length || !rs.isNavigating) return

    const result = findClosestPointOnRoute(
      userLocation.latitude,
      userLocation.longitude,
      rs.routeCoordinates,
      rs.progressIndex,
    )

    // Only update if progress moved forward or user is much closer to a different point
    if (result.index > rs.progressIndex || (result.index !== rs.progressIndex && result.distance < 10)) {
      const remainingCoordinates = rs.routeCoordinates.slice(result.index)

      setRouteState((prev) => ({
        ...prev,
        progressIndex: result.index,
        remainingCoordinates,
      }))
    }
  }, [])

  /**
   * Update navigation state with maneuver tracking
   * Includes pre-announcement distance calculations
   */
  const updateNavigationProgress = useCallback((userLocation: UserLocation) => {
    const rs = routeStateRef.current
    const ns = navigationStateRef.current
    const opts = optionsRef.current

    if (!rs.route || !rs.isNavigating) return

    const maneuvers = rs.route.trip.legs[0]?.maneuvers || []
    if (maneuvers.length === 0) return

    const coordinates = rs.routeCoordinates
    if (coordinates.length === 0) return

    // Calculate remaining distance
    const remainingDistanceM = calculateRemainingDistance(coordinates, rs.progressIndex)
    const estimatedTime = estimateRemainingTime(remainingDistanceM)

    // Find current maneuver based on progress
    let currentManeuverIndex = ns.maneuverIndex
    let distanceToCurrentManeuver = Infinity

    // Check if we've passed the current maneuver
    for (let i = Math.max(0, ns.maneuverIndex); i < maneuvers.length; i++) {
      const maneuver = maneuvers[i]

      if (maneuver.begin_shape_index <= rs.progressIndex && maneuver.end_shape_index >= rs.progressIndex) {
        // User is within this maneuver's segment
        currentManeuverIndex = i

        // Calculate distance to the end of this maneuver (start of next)
        if (maneuver.end_shape_index < coordinates.length) {
          const [endLat, endLon] = coordinates[maneuver.end_shape_index]
          distanceToCurrentManeuver = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            endLat,
            endLon,
          )
        }
        break
      } else if (maneuver.begin_shape_index > rs.progressIndex) {
        // Haven't reached this maneuver yet
        const [startLat, startLon] = coordinates[maneuver.begin_shape_index]
        const dist = calculateDistance(userLocation.latitude, userLocation.longitude, startLat, startLon)
        if (dist < distanceToCurrentManeuver) {
          distanceToCurrentManeuver = dist
          currentManeuverIndex = i
        }
        break
      }
    }

    // Determine announcement state
    let shouldAnnounce = false
    let announcementDistance: 'far' | 'approaching' | 'now' | null = null

    const nextManeuver = maneuvers[currentManeuverIndex + 1] || null
    const currentManeuver = maneuvers[currentManeuverIndex] || null

    // Check if we need to announce the next turn
    if (nextManeuver && !isDestinationManeuver(nextManeuver.type)) {
      const nextManeuverStart = coordinates[nextManeuver.begin_shape_index]
      if (nextManeuverStart) {
        const distToNext = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          nextManeuverStart[0],
          nextManeuverStart[1],
        )

        if (distToNext <= opts.nowAnnouncementDistance) {
          announcementDistance = 'now'
        } else if (distToNext <= opts.approachingAnnouncementDistance) {
          announcementDistance = 'approaching'
        } else if (distToNext <= opts.farAnnouncementDistance) {
          announcementDistance = 'far'
        }

        // Only announce if this is a new announcement or distance category changed
        if (
          announcementDistance &&
          (currentManeuverIndex !== lastAnnouncedManeuverRef.current ||
            announcementDistance !== lastAnnouncementDistanceRef.current)
        ) {
          shouldAnnounce = true
          lastAnnouncedManeuverRef.current = currentManeuverIndex
          lastAnnouncementDistanceRef.current = announcementDistance
        }
      }
    }

    // Check for arrival
    if (currentManeuver && isDestinationManeuver(currentManeuver.type) && distanceToCurrentManeuver < 20) {
      shouldAnnounce = true
      announcementDistance = 'now'
    }

    // Batch update navigation state
    setNavigationState({
      currentManeuver,
      nextManeuver,
      maneuverIndex: currentManeuverIndex,
      distanceToManeuver: distanceToCurrentManeuver,
      distanceToDestination: remainingDistanceM,
      estimatedTimeRemaining: estimatedTime,
      shouldAnnounce,
      announcementDistance,
    })
  }, [])

  /**
   * Main handler for location updates during navigation
   * Orchestrates all navigation updates efficiently
   */
  const handleLocationUpdate = useCallback(
    async (userLocation: UserLocation) => {
      if (!routeStateRef.current.isNavigating) return

      // Update progress first (fast, synchronous)
      updateRouteProgress(userLocation)

      // Then update navigation state (includes distance calculations)
      updateNavigationProgress(userLocation)

      // Finally check for reroute (async, debounced)
      await checkAndReroute(userLocation)
    },
    [updateRouteProgress, updateNavigationProgress, checkAndReroute],
  )

  return {
    // Route state
    ...routeState,

    // Navigation state
    navigation: navigationState,

    // Actions
    calculateRoute,
    startNavigation,
    stopNavigation,
    handleLocationUpdate,

    // Utils
    isRerouting: isReroutingRef.current,
    destination: destinationRef.current,

    // Statistics
    hasRoute: routeState.route !== null,
    totalDistance: routeState.route?.trip.summary.length || null,
    totalTime: routeState.route?.trip.summary.time || null,
  }
}

