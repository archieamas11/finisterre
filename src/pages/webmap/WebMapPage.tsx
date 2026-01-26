/**
 * WebMapPage - Main map page component
 *
 * This component orchestrates the interactive cemetery map with features including:
 * - Location tracking and navigation
 * - Plot search and filtering
 * - Marker clustering by block/category
 * - Route display and turn-by-turn directions
 */

import 'leaflet/dist/leaflet.css'
import '@maptiler/leaflet-maptilersdk'

import type { ConvertedMarker } from '@/types/map.types'
import { lazy, memo, Suspense, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { MapContainer } from 'react-leaflet'

import FloatingChatWidget from '@/components/FloatingChatWidget'
import { MapLoadingState } from '@/components/map/MapLoadingState'
import { MapMarkersLayer } from '@/components/map/MapMarkersLayer'
import { MapNotifications } from '@/components/map/MapNotifications'
import { MapRouteLayer } from '@/components/map/MapRouteLayer'
import { MapTileLayer } from '@/components/map/MapTileLayer'
import {
  DEFAULT_MAP_BOUNDS,
  MAP_ZOOM,
  TILE_LAYER_OPTIONS,
  type TileLayerKey,
  LOCATION_TRACKING_CONFIG,
  VALHALLA_CONFIG,
} from '@/constants/map.constants'
import { LocateContext, MapDispatchContext, MapStateContext } from '@/contexts/MapContext'
import { MapInstanceBinder } from '@/hooks/map-hooks/useMapInstance'
import { useMapNotifications } from '@/hooks/map-hooks/useMapNotifications'
import { usePlots } from '@/hooks/plots-hooks/plot.hooks'
import { useLocationTracking } from '@/hooks/useLocationTracking'
import { useMarkersOffline } from '@/hooks/useMarkersOffline'
import { convertUserPlotToMarker, useUserOwnedPlots } from '@/hooks/user-hooks/useUserOwnedPlots'
import { useValhalla } from '@/hooks/useValhalla'
import { groupMarkersByKey } from '@/lib/clusterUtils'
import { MapLegend } from '@/components/webmap/MapLegend'
import MapNavigation from '@/components/webmap/MapNavigation'
import { mapReducer, initialMapState } from '@/reducers/mapReducer'
import { convertPlotToMarker } from '@/types/map.types'
import { isNativePlatform } from '@/utils/platform.utils'
import { searchLotById } from '@/api/plots.api'

const NavigationInstructions = lazy(() => import('@/components/map/NavigationInstructions'))
const MemoizedNavigationInstructions = memo(NavigationInstructions)

/**
 * Props for the WebMapPage component
 */
interface WebMapPageProps {
  /** Callback when back button is clicked */
  onBack?: () => void
  /** Initial direction for deep linking (native platforms) */
  initialDirection?: { lat: number; lng: number } | null
}

/**
 * Main map page component
 */
export default function WebMapPage({ onBack, initialDirection }: WebMapPageProps) {
  // ============= Data Fetching =============
  const { isLoading: isPlotsLoading, data: plotsData } = usePlots()
  const { data: cachedPlots, isLoading: isCacheLoading } = useMarkersOffline()
  const plotsDataToUse = cachedPlots && cachedPlots.length > 0 ? cachedPlots : plotsData
  const isLoading = !plotsDataToUse && (isPlotsLoading || isCacheLoading)
  const { data: userPlotsData } = useUserOwnedPlots()

  // Convert plot data to markers
  const markers = useMemo(
    () => plotsDataToUse?.map(convertPlotToMarker) || [],
    [plotsDataToUse],
  )

  const userMarkers = useMemo(() => {
    if (!userPlotsData?.plots) return []
    return userPlotsData.plots
      .map(convertUserPlotToMarker)
      .filter((marker): marker is NonNullable<typeof marker> => marker !== null)
  }, [userPlotsData])

  // ============= Location Tracking =============
  const {
    currentLocation,
    startTracking,
    stopTracking,
    getCurrentLocation,
    isTracking,
    error: locationError,
  } = useLocationTracking(LOCATION_TRACKING_CONFIG)

  // ============= Navigation/Routing =============
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

  // ============= State Management =============
  const [state, dispatch] = useReducer(mapReducer, initialMapState)
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null)
  const [selectedTileLayer, setSelectedTileLayer] = useState<TileLayerKey>('arcgis')

  // ============= Notifications =============
  const notifications = useMapNotifications()
  const { notificationState, closeNotification, notifyError, notify } = notifications

  // ============= Refs for tracking state =============
  const hasAutoCenteredRef = useRef(false)
  const shouldSuppressAutoCenterRef = useRef(false)
  const lastDestinationSignatureRef = useRef<string | null>(null)
  const lastCancelledDestinationRef = useRef<string | null>(null)
  const lastInitialDirectionRef = useRef<string | null>(null)

  // ============= Computed Values =============
  const markersByGroup = useMemo(() => groupMarkersByKey(markers), [markers])

  const availableGroups = useMemo(
    () =>
      Object.entries(markersByGroup)
        .map(([key, groupMarkers]) => {
          const raw = key.startsWith('block:')
            ? key.split('block:')[1]
            : key.startsWith('category:')
              ? key.split('category:')[1]
              : key
          const label = key.startsWith('category:')
            ? raw.charAt(0).toUpperCase() + raw.slice(1)
            : `Block ${raw}`
          return { key, label, count: groupMarkers.length }
        })
        .sort((a, b) => a.label.localeCompare(b.label)),
    [markersByGroup],
  )

  // ============= Location Effects =============
  // Handle location updates during navigation
  useEffect(() => {
    if (!isNavigating || !currentLocation) return
    handleLocationUpdate(currentLocation)
  }, [currentLocation, isNavigating, handleLocationUpdate])

  useEffect(() => {
    return () => {
      stopTracking()
    }
  }, [stopTracking])

  // Auto-center map on first location
  useEffect(() => {
    if (!currentLocation || !mapInstance) return
    if (hasAutoCenteredRef.current) return
    if (shouldSuppressAutoCenterRef.current) {
      shouldSuppressAutoCenterRef.current = false
      return
    }
    if (isNavigating) return

    hasAutoCenteredRef.current = true
    mapInstance.flyTo([currentLocation.latitude, currentLocation.longitude])

    const timer = setTimeout(() => {
      hasAutoCenteredRef.current = false
    }, 1000)
    return () => clearTimeout(timer)
  }, [currentLocation, mapInstance, isNavigating])

  // ============= Location Handlers =============
  const requestLocate = useCallback(
    async (zoom: number = MAP_ZOOM.LOCATE) => {
      const locationData = isTracking
        ? currentLocation
        : await getCurrentLocation().catch(() => {
          alert('Unable to get your location. Check GPS permissions.')
          return null
        })

      if (locationData && mapInstance && !isNavigating) {
        startTracking()
        mapInstance.flyTo([locationData.latitude, locationData.longitude], zoom, { animate: true })
      }
    },
    [isTracking, currentLocation, getCurrentLocation, startTracking, mapInstance, isNavigating],
  )

  // ============= Navigation Handlers =============
  const cancelNavigation = useCallback(() => {
    const currentDestination = lastDestinationSignatureRef.current
    if (currentDestination) lastCancelledDestinationRef.current = currentDestination
    lastDestinationSignatureRef.current = null
    stopNavigation()
    dispatch({ type: 'SET_NAV_OPEN', value: false })
    dispatch({ type: 'SET_DIRECTION_LOADING', value: false })
    shouldSuppressAutoCenterRef.current = true
    setTimeout(() => {
      shouldSuppressAutoCenterRef.current = false
    }, 2000)
  }, [stopNavigation])

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
        lastDestinationSignatureRef.current = `${toLat.toFixed(6)},${toLng.toFixed(6)}`

        if (!isTracking) await requestLocate()
        dispatch({ type: 'SET_NAV_OPEN', value: true })
      } catch (err: unknown) {
        notifyError(
          `Navigation failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
          'Navigation Error',
        )
        if (!isTracking) await startTracking().catch(() => { })
      } finally {
        dispatch({ type: 'SET_DIRECTION_LOADING', value: false })
      }
    },
    [currentLocation, getCurrentLocation, isTracking, startNavigation, requestLocate, startTracking, notifyError],
  )

  // Handle initial direction from props (native deep linking)
  useEffect(() => {
    if (!initialDirection || !isNativePlatform()) return
    const signature = `${initialDirection.lat},${initialDirection.lng}`
    if (lastInitialDirectionRef.current === signature) return
    if (isNavigating) return
    lastInitialDirectionRef.current = signature
    requestAnimationFrame(() => handleDirectionClick([initialDirection.lat, initialDirection.lng]))
  }, [initialDirection, handleDirectionClick, isNavigating])

  // ============= Clustering Handlers =============
  const toggleGroupSelection = useCallback(
    (groupKey: string) => dispatch({ type: 'TOGGLE_GROUP', group: groupKey }),
    [],
  )

  const resetGroupSelection = useCallback(
    () => dispatch({ type: 'RESET_GROUPS' }),
    [],
  )

  const handleClusterClick = useCallback(
    (groupKey: string) => dispatch({ type: 'SELECT_GROUPS', groups: new Set([groupKey]) }),
    [],
  )

  const showUserPlotsOnly = useCallback(
    () => dispatch({ type: 'SHOW_USER_PLOTS' }),
    [],
  )

  // ============= Search Handlers =============
  const searchLot = useCallback(
    async (lotId: string) => {
      if (!lotId.trim()) {
        notifyError('Please enter a lot ID', 'Search Error')
        return
      }
      dispatch({ type: 'SEARCH_START' })

      try {
        const result = await searchLotById(lotId.trim())
        dispatch({ type: 'SEARCH_SUCCESS', result })

        if (result.success && result.data) {
          const { plot_id, niche_number, coordinates } = result.data

          let plotCoords: [number, number] | null = null
          if (coordinates) {
            try {
              const [lng, lat] = coordinates.split(',').map((coord: string) => parseFloat(coord.trim()))
              if (!isNaN(lat) && !isNaN(lng)) {
                plotCoords = [lat, lng]
              }
            } catch {
              console.warn('Failed to parse coordinates:', coordinates)
            }
          }

          const matchedMarker = markers.find((m: ConvertedMarker) => m.plot_id === plot_id)
          if (matchedMarker) {
            const groupKey = matchedMarker.block
              ? `block:${matchedMarker.block}`
              : `category:${matchedMarker.category}`
            dispatch({ type: 'SELECT_GROUPS', groups: new Set([groupKey]) })
            if (niche_number) dispatch({ type: 'SET_HIGHLIGHTED_NICHE', niche: niche_number })
            dispatch({ type: 'SET_AUTO_POPUP', plotId: String(plot_id) })
            const centerCoords = plotCoords || matchedMarker.position
            if (mapInstance && centerCoords) {
              mapInstance.setView(centerCoords, MAP_ZOOM.SEARCH_RESULT, { animate: true })
            }
          }

          notify({
            title: 'Lot found',
            subtitle: `${result.data.category} ${result.data.block ? `- Block ${result.data.block}` : '- Chamber'}`,
            text: `Plot ${result.data.plot_id}`,
            titleRightText: 'now',
          })
        } else {
          notifyError(result.message || 'Lot not found', 'Search Error')
        }
      } catch (error) {
        console.error('Search error:', error)
        notifyError('Failed to search lot. Please try again.', 'Search Error')
      } finally {
        dispatch({ type: 'SEARCH_END' })
      }
    },
    [markers, mapInstance, notify, notifyError],
  )

  const clearSearch = useCallback(() => {
    dispatch({ type: 'SET_SEARCH_QUERY', query: '' })
    dispatch({ type: 'SEARCH_SUCCESS', result: null })
    dispatch({ type: 'SET_HIGHLIGHTED_NICHE', niche: null })
    dispatch({ type: 'SET_AUTO_POPUP', plotId: null })
    dispatch({ type: 'RESET_GROUPS' })
  }, [])

  // ============= View Handlers =============
  const resetView = useCallback(() => {
    if (!mapInstance) return
    const [sw, ne] = DEFAULT_MAP_BOUNDS
    const centerLatLng: [number, number] = [(sw[0] + ne[0]) / 2, (sw[1] + ne[1]) / 2]
    mapInstance.flyTo(centerLatLng, MAP_ZOOM.DEFAULT)
    dispatch({ type: 'RESET_VIEW' })
  }, [mapInstance])

  // ============= Error Handling =============
  useEffect(() => {
    if (!(locationError || routingError)) return
    notifyError('Unable to get directions. Please try again.')
  }, [locationError, routingError, notifyError])

  // ============= Context Value (Split for Optimization) =============
  // Stable action handlers (these rarely change)
  const setSearchQuery = useCallback(
    (query: string) => dispatch({ type: 'SET_SEARCH_QUERY', query }),
    [],
  )

  const setAutoPopupPlotId = useCallback(
    (plotId: string | null) => dispatch({ type: 'SET_AUTO_POPUP', plotId }),
    [],
  )

  const setTileLayer = useCallback(
    (layer: string) => setSelectedTileLayer(layer as TileLayerKey),
    [],
  )

  // Navigation-related context values
  const navigationActions = useMemo(
    () => ({
      requestLocate,
      cancelNavigation,
      resetView,
    }),
    [requestLocate, cancelNavigation, resetView],
  )

  // Clustering-related context values
  const clusteringActions = useMemo(
    () => ({
      selectedGroups: state.selectedGroups,
      clusterViewMode: state.clusterViewMode,
      availableGroups,
      toggleGroupSelection,
      resetGroupSelection,
      handleClusterClick,
      showUserPlotsOnly,
      userOwnedPlotsCount: userMarkers.length,
    }),
    [
      state.selectedGroups,
      state.clusterViewMode,
      availableGroups,
      toggleGroupSelection,
      resetGroupSelection,
      handleClusterClick,
      showUserPlotsOnly,
      userMarkers.length,
    ],
  )

  // Search-related context values
  const searchActions = useMemo(
    () => ({
      searchQuery: state.searchQuery,
      searchResult: state.searchResult,
      isSearching: state.isSearching,
      highlightedNiche: state.highlightedNiche,
      autoOpenPopupFor: state.autoOpenPopupFor,
      searchLot,
      clearSearch,
      setSearchQuery,
      setAutoOpenPopupFor: setAutoPopupPlotId, // Internal name improved, but context property name maintained for backward compatibility
    }),
    [
      state.searchQuery,
      state.searchResult,
      state.isSearching,
      state.highlightedNiche,
      state.autoOpenPopupFor,
      searchLot,
      clearSearch,
      setSearchQuery,
      setAutoPopupPlotId,
    ],
  )

  // Tile layer context values
  const tileLayerActions = useMemo(
    () => ({
      selectedTileLayer,
      setSelectedTileLayer: setTileLayer,
      tileLayerOptions: TILE_LAYER_OPTIONS,
    }),
    [selectedTileLayer, setTileLayer],
  )

  // Combined context value (maintains backward compatibility)
  const mapContextValue = useMemo(
    () => ({
      ...state,
      ...navigationActions,
      ...clusteringActions,
      ...searchActions,
      ...tileLayerActions,
    }),
    [state, navigationActions, clusteringActions, searchActions, tileLayerActions],
  )

  // ============= Render =============
  if (isLoading) {
    return <MapLoadingState isLoading={isLoading} />
  }

  return (
    <MapStateContext.Provider value={state}>
      <MapDispatchContext.Provider value={dispatch}>
        <LocateContext.Provider value={mapContextValue}>
          <div className="relative h-full w-full overflow-hidden">
            {/* Navigation bar */}
            <MapNavigation onBack={onBack} />

            {/* Map legend */}
            <MapLegend />

            {/* Chat widget (web only) */}
            {!isNativePlatform() && <FloatingChatWidget />}

            {/* Notifications */}
            <MapNotifications
              notificationState={notificationState}
              onClose={closeNotification}
            />

            {/* Map container */}
            <MapContainer
              className="h-full w-full z-1"
              zoomControl={false}
              bounds={DEFAULT_MAP_BOUNDS}
              maxZoom={MAP_ZOOM.MAX}
              zoom={MAP_ZOOM.DEFAULT}
            >
              {/* Map instance binder */}
              <MapInstanceBinder onMapReady={setMapInstance} />

              {/* Tile layer */}
              <MapTileLayer
                selectedTileLayer={selectedTileLayer}
                apiKey={import.meta.env.VITE_MAPTILER_API_KEY}
              />

              {/* All markers */}
              <MapMarkersLayer
                markersByGroup={markersByGroup}
                userMarkers={userMarkers}
                onDirectionClick={handleDirectionClick}
                isDirectionLoading={state.isDirectionLoading}
                selectedGroups={state.selectedGroups}
                clusterViewMode={state.clusterViewMode}
                onClusterClick={handleClusterClick}
                searchResult={state.searchResult}
                highlightedNiche={state.highlightedNiche}
              />

              {/* Route layer */}
              <MapRouteLayer
                route={route}
                routeCoordinates={routeCoordinates}
                remainingCoordinates={remainingCoordinates}
                originalStart={originalStart}
                originalEnd={originalEnd}
                userLocation={currentLocation}
                isNavigating={isNavigating}
              />

              {/* Navigation instructions */}
              <Suspense fallback={null}>
                <MemoizedNavigationInstructions
                  isOpen={state.isNavigationInstructionsOpen}
                  onClose={cancelNavigation}
                  navigationState={navigation}
                  allManeuvers={route?.trip.legs[0]?.maneuvers || []}
                  isNavigating={isNavigating}
                  isRerouting={isRerouting}
                  totalDistance={totalDistance || undefined}
                  totalTime={totalTime || undefined}
                  rerouteCount={rerouteCount}
                />
              </Suspense>
            </MapContainer>
          </div>
        </LocateContext.Provider>
      </MapDispatchContext.Provider>
    </MapStateContext.Provider>
  )
}
