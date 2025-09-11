import { useEffect, useCallback, useRef } from 'react'
import { useQueryState } from 'nuqs'
import type { MapRef } from 'react-map-gl/maplibre'

import type { Coordinate } from '../utils/location.utils'
import type { NavigationState, NavigationActions, NavigationConfig, CameraMode } from '../types/navigation.types'
import { useNavigationStore } from '../stores/navigation.store'

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
  const initializedRef = useRef(false)
  const [from, setFrom] = useQueryState('from', { defaultValue: '' })
  const [to, setTo] = useQueryState('to', { defaultValue: '' })

  const {
    isActive,
    route,
    instructions,
    origin,
    destination,
    currentUserPosition,
    cameraMode,
    routeProgressIndex,
    snappedUserPosition,
    setMapRef,
    setMapboxAccessToken,
    setConfig,
    setOnDestinationReached,
    setOnUrlParamsChange,
    setCameraMode,
    cycleCameraMode,
    startNavigation: storeStartNavigation,
    cancelNavigation: storeCancelNavigation,
    updateUserPosition: storeUpdateUserPosition,
    loadRouteFromURL,
    stopLocationWatch,
  } = useNavigationStore()

  // Set up the store with the provided props - only once
  useEffect(() => {
    if (!initializedRef.current) {
      setMapRef(mapRef)
      setMapboxAccessToken(mapboxAccessToken)
      setConfig(config)
      setOnDestinationReached(onDestinationReached || null)
      setOnUrlParamsChange((from: string, to: string) => {
        console.log('URL params callback called with:', from, to)
        setFrom(from)
        setTo(to)
      })
      initializedRef.current = true
    }
  }, [
    mapRef,
    mapboxAccessToken,
    config,
    onDestinationReached,
    setMapRef,
    setMapboxAccessToken,
    setConfig,
    setOnDestinationReached,
    setOnUrlParamsChange,
    setFrom,
    setTo,
  ])

  // Read query params on mount and auto-start navigation
  useEffect(() => {
    console.log('URL params changed - from:', from, 'to:', to, 'isActive:', isActive, 'route:', !!route)
    if (from && to && !isActive && !route) {
      console.log('Loading route from URL params')
      loadRouteFromURL(from, to)
    }
  }, [from, to, isActive, route, loadRouteFromURL])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopLocationWatch()
    }
  }, [stopLocationWatch])

  const startNavigation = useCallback(
    async (destination: Coordinate) => {
      console.log('Hook startNavigation called with destination:', destination)
      await storeStartNavigation(destination)
      // URL params are now handled by the store callback
    },
    [storeStartNavigation],
  )

  const cancelNavigation = useCallback(() => {
    console.log('Hook cancelNavigation called')
    storeCancelNavigation()
    // URL params are now cleared by the store callback
    console.log('URL params cleared via callback')
  }, [storeCancelNavigation])

  const updateUserPosition = useCallback(
    (position: Coordinate) => {
      storeUpdateUserPosition(position)
    },
    [storeUpdateUserPosition],
  )

  return {
    // State
    isActive,
    route,
    instructions,
    origin,
    destination,
    currentUserPosition,
    cameraMode,
    routeProgressIndex,
    snappedUserPosition,

    // Actions
    startNavigation,
    cancelNavigation,
    updateUserPosition,
    setCameraMode: setCameraMode as (mode: CameraMode) => void,
    cycleCameraMode: cycleCameraMode as () => void,
  }
}
