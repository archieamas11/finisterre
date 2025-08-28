import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import { useEffect, useMemo, useCallback, memo, useState, Suspense, lazy, useReducer, useRef } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { toast } from 'sonner'

import type { ConvertedMarker } from '@/types/map.types'

import { searchLotById } from '@/api/plots.api'
import CustomClusterManager from '@/components/map/CustomClusterManager'
import { ValhallaRoute } from '@/components/map/ValhallaRoute'
import Spinner from '@/components/ui/spinner'
import { MapStateContext, MapDispatchContext, LocateContext, type MapState, type MapAction } from '@/contexts/MapContext'
import { usePlots } from '@/hooks/plots-hooks/plot.hooks'
import { useLocationTracking } from '@/hooks/useLocationTracking'
import { useValhalla } from '@/hooks/useValhalla'
import { groupMarkersByKey } from '@/lib/clusterUtils'
import CenterSerenityMarkers from '@/pages/webmap/CenterSerenityMarkers'
import ChapelMarkers from '@/pages/webmap/ChapelMarkers'
import ComfortRoomMarker from '@/pages/webmap/ComfortRoomMarkers'
import MainEntranceMarkers from '@/pages/webmap/MainEntranceMarkers'
import ParkingMarkers from '@/pages/webmap/ParkingMarkers'
import PlaygroundMarkers from '@/pages/webmap/PlaygroundMarkers'
import PlotMarkers from '@/pages/webmap/PlotMarkers'
import WebMapNavs from '@/pages/webmap/WebMapNavs'
import { convertPlotToMarker } from '@/types/map.types'
const UserLocationMarker = lazy(() =>
  import('@/components/map/UserLocationMarker').then((module) => ({
    default: module.UserLocationMarker,
  })),
)
const NavigationInstructions = lazy(() => import('@/components/map/NavigationInstructions'))

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})
L.Marker.prototype.options.icon = DefaultIcon

const MemoizedComfortRoomMarker = memo(ComfortRoomMarker)
const MemoizedParkingMarkers = memo(ParkingMarkers)
const MemoizedCenterSerenityMarkers = memo(CenterSerenityMarkers)
const MemoizedMainEntranceMarkers = memo(MainEntranceMarkers)
const MemoizedChapelMarkers = memo(ChapelMarkers)
const MemoizedPlaygroundMarkers = memo(PlaygroundMarkers)
const MemoizedPlotMarkers = memo(PlotMarkers)
const MemoizedNavigationInstructions = memo(NavigationInstructions)

// 💡 Extend HTMLElement to include the _leaflet_map property for legacy compatibility
declare global {
  interface HTMLElement {
    _leaflet_map?: L.Map
  }
}

// 💡 Internal component to capture map instance once available
function MapInstanceBinder({ onMapReady }: { onMapReady: (map: L.Map) => void }) {
  const map = useMap()
  useEffect(() => {
    onMapReady(map)
    // Attach reference for legacy direct DOM usage elsewhere
    map.getContainer()._leaflet_map = map
    // 💡 Pre-create custom panes to avoid race conditions when conditionally rendering components
    // that expect these panes to exist (prevents intermittent appendChild undefined errors)
    const ensurePane = (name: string, zIndex: number) => {
      if (!map.getPane(name)) {
        const pane = map.createPane(name)
        pane.style.zIndex = String(zIndex)
      }
    }
    ensurePane('route-pane', 600)
    ensurePane('end-icon', 1000)
  }, [map, onMapReady])
  return null
}

// ==== New reducer-based state management ====
const initialMapState: MapState = {
  isNavigationInstructionsOpen: false,
  isDirectionLoading: false,
  shouldCenterOnUser: false,
  selectedGroups: new Set(),
  clusterViewMode: 'all',
  searchQuery: '',
  searchResult: null,
  isSearching: false,
  highlightedNiche: null,
  autoOpenPopupFor: null,
  pendingPopupClose: false,
  forceClosePopupsToken: 0,
}

function mapReducer(state: MapState, action: MapAction): MapState {
  switch (action.type) {
    case 'SET_NAV_OPEN':
      return { ...state, isNavigationInstructionsOpen: action.value }
    case 'SET_DIRECTION_LOADING':
      return { ...state, isDirectionLoading: action.value }
    case 'REQUEST_LOCATE':
      return { ...state, shouldCenterOnUser: true }
    case 'SELECT_GROUPS':
      return { ...state, selectedGroups: action.groups, clusterViewMode: action.groups.size > 0 ? 'selective' : 'all' }
    case 'TOGGLE_GROUP': {
      const newSet = new Set(state.selectedGroups)
      if (newSet.has(action.group)) newSet.delete(action.group)
      else newSet.add(action.group)
      return { ...state, selectedGroups: newSet, clusterViewMode: newSet.size > 0 ? 'selective' : 'all' }
    }
    case 'RESET_GROUPS':
      return { ...state, selectedGroups: new Set(), clusterViewMode: 'all' }
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.query }
    case 'SEARCH_START':
      return { ...state, isSearching: true, searchResult: null, highlightedNiche: null }
    case 'SEARCH_SUCCESS':
      return { ...state, searchResult: action.result }
    case 'SEARCH_END':
      return { ...state, isSearching: false }
    case 'SET_HIGHLIGHTED_NICHE':
      return { ...state, highlightedNiche: action.niche }
    case 'SET_AUTO_POPUP':
      return { ...state, autoOpenPopupFor: action.plotId }
    case 'REQUEST_POPUP_CLOSE':
      // Increment token to tell popups to close themselves
      return { ...state, pendingPopupClose: true, forceClosePopupsToken: state.forceClosePopupsToken + 1 }
    case 'POPUP_CLOSE_CONFIRMED':
      return { ...state, pendingPopupClose: false }
    case 'RESET_VIEW':
      return {
        ...state,
        selectedGroups: new Set(),
        clusterViewMode: 'all',
        searchQuery: '',
        searchResult: null,
        highlightedNiche: null,
        autoOpenPopupFor: null,
      }
    default:
      return state
  }
}

export default function MapPage() {
  const { isLoading, data: plotsData } = usePlots()
  const markers = useMemo(() => plotsData?.map(convertPlotToMarker) || [], [plotsData])

  const {
    currentLocation,
    startTracking,
    stopTracking,
    getCurrentLocation,
    isTracking,
    error: locationError,
  } = useLocationTracking({
    enableHighAccuracy: true,
    distanceFilter: 5,
  })

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
  } = useValhalla({
    costingType: 'pedestrian',
    enableAutoReroute: true,
    offRouteThreshold: 25,
  })

  const [state, dispatch] = useReducer(mapReducer, initialMapState)
  const stateRef = useRef(state)
  stateRef.current = state

  // 🛠️ Backward-compat bridge (TEMP): map former individual state variables to reducer state fields.
  // FIXME: Remove once all references are updated.

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const bounds: [[number, number], [number, number]] = [
    [10.247883800064669, 123.79691285546676],
    [10.249302749341647, 123.7988598710129],
  ]

  // 🗺️ Hold reference to Leaflet map for reset
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null)

  useEffect(() => {
    if (currentLocation && isNavigating) {
      handleLocationUpdate(currentLocation)
    }
  }, [currentLocation, isNavigating, handleLocationUpdate])

  useEffect(() => {
    return () => {
      stopTracking()
    }
  }, [stopTracking])

  useEffect(() => {
    if (state.shouldCenterOnUser && currentLocation) {
      const timeoutId = setTimeout(() => dispatch({ type: 'REQUEST_LOCATE' }), 1000) // reuse action to toggle flag
      return () => clearTimeout(timeoutId)
    }
  }, [state.shouldCenterOnUser, currentLocation])

  // 🚀 Effect to detect when route is fully loaded and flyTo animation is complete
  useEffect(() => {
    if (route && routeCoordinates.length > 0 && state.isDirectionLoading) {
      // Route is loaded, start flyTo animation and wait for it to complete
      const timeoutId = setTimeout(() => {
        dispatch({ type: 'SET_DIRECTION_LOADING', value: false })
        if (stateRef.current.pendingPopupClose) {
          dispatch({ type: 'POPUP_CLOSE_CONFIRMED' })
        }
      }, 1500) // Wait for flyTo animation to complete (~1.5s)

      return () => clearTimeout(timeoutId)
    }
  }, [route, routeCoordinates, state.isDirectionLoading])

  // 🔄 Reset route completion state when route is cleared
  useEffect(() => {
    if (!route || routeCoordinates.length === 0) {
      if (state.pendingPopupClose) dispatch({ type: 'POPUP_CLOSE_CONFIRMED' })
    }
  }, [route, routeCoordinates, state.pendingPopupClose])

  // Memoize callback functions to prevent them from being recreated on every render.
  const requestLocate = useCallback(async () => {
    // Start tracking if not already active
    if (!isTracking) startTracking()
    // center will be handled inline; reset flag if needed

    // Try to obtain a fresh location if we don't have one yet
    let loc = currentLocation
    if (!loc) {
      try {
        loc = await getCurrentLocation()
      } catch (err) {
        // 💡 Silent fail: toast not needed; user just won't see fly animation
        console.warn('Could not get current location for flyTo:', err)
      }
    }

    // Perform animated fly to the user's position
    if (loc && mapInstance) {
      // Using flyTo for smoother animated transition similar to resetView animation semantics
      mapInstance.flyTo([loc.latitude, loc.longitude], 18, { animate: true })
    }
  }, [isTracking, startTracking, currentLocation, getCurrentLocation, mapInstance])

  const clearRoute = useCallback(() => {
    stopNavigation()
    dispatch({ type: 'SET_NAV_OPEN', value: false })
    dispatch({ type: 'SET_DIRECTION_LOADING', value: false })
  }, [stopNavigation])

  const handleDirectionClick = useCallback(
    async (to: [number, number]) => {
      const [toLatitude, toLongitude] = to
      if (!toLatitude || !toLongitude) {
        console.warn('⚠️ Invalid destination coordinates:', to)
        dispatch({ type: 'SET_DIRECTION_LOADING', value: false })
        return
      }
      dispatch({ type: 'SET_DIRECTION_LOADING', value: true })
      dispatch({ type: 'SET_NAV_OPEN', value: false })

      try {
        // Get user location: use current if available, otherwise fetch
        let userLocation = currentLocation
        if (!userLocation) {
          userLocation = await getCurrentLocation()
        }

        if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
          throw new Error('Could not determine current location')
        }

        // Start navigation with proper typed coordinates
        await startNavigation(
          {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
          { latitude: toLatitude, longitude: toLongitude },
        )

        // Trigger map recentering or location update
        requestLocate()

        // Open navigation instructions UI
        dispatch({ type: 'SET_NAV_OPEN', value: true })
      } catch (error) {
        console.error('🚫 Failed to start navigation:', error)
        // Fallback: resume tracking if not already doing so
        if (!isTracking) {
          startTracking()
        }
        toast.error('Failed to start navigation. Using fallback tracking.')
      } finally {
        dispatch({ type: 'SET_DIRECTION_LOADING', value: false })
      }
    },
    [currentLocation, getCurrentLocation, isTracking, startNavigation, startTracking, requestLocate],
  )

  // 🎯 Cluster control functions
  const toggleGroupSelection = useCallback((groupKey: string) => dispatch({ type: 'TOGGLE_GROUP', group: groupKey }), [])

  const resetGroupSelection = useCallback(() => dispatch({ type: 'RESET_GROUPS' }), [])

  // 🎯 Handle cluster click - select single group
  const handleClusterClick = useCallback((groupKey: string) => dispatch({ type: 'SELECT_GROUPS', groups: new Set([groupKey]) }), [])

  // 🔍 Search functions
  const searchLot = useCallback(
    async (lotId: string) => {
      if (!lotId.trim()) {
        toast.error('Please enter a lot ID')
        return
      }
      dispatch({ type: 'SEARCH_START' })

      try {
        const result = await searchLotById(lotId.trim())
        dispatch({ type: 'SEARCH_SUCCESS', result })

        if (result.success && result.data) {
          const { plot_id, niche_number, coordinates } = result.data

          // Parse coordinates from "lng,lat" format to [lat, lng]
          let plotCoords: [number, number] | null = null
          if (coordinates) {
            try {
              const [lng, lat] = coordinates.split(',').map((coord: string) => parseFloat(coord.trim()))
              if (!isNaN(lat) && !isNaN(lng)) {
                plotCoords = [lat, lng]
              }
            } catch (coordError) {
              console.warn('Failed to parse coordinates:', coordinates, coordError)
            }
          }

          // Find the matching plot in markers to get the correct group key
          const matchedMarker = markers.find((m: ConvertedMarker) => m.plot_id === plot_id)
          if (matchedMarker) {
            const groupKey = matchedMarker.block ? `block:${matchedMarker.block}` : `category:${matchedMarker.category}`

            // Switch to selective mode and select only this plot's group
            dispatch({ type: 'SELECT_GROUPS', groups: new Set([groupKey]) })

            // If there's a niche number, highlight it
            if (niche_number) dispatch({ type: 'SET_HIGHLIGHTED_NICHE', niche: niche_number })

            // 🎯 Set auto popup for this plot and center map
            dispatch({ type: 'SET_AUTO_POPUP', plotId: String(plot_id) })

            // Use coordinates from search result or fallback to marker position
            const centerCoords = plotCoords || matchedMarker.position

            // Center and zoom the map on the found plot using stored map instance
            if (mapInstance) {
              mapInstance.setView(centerCoords, 18, { animate: true })
            }
          }

          toast.success(`Lot found in ${result.data.category} - ${result.data.block ? `Block ${result.data.block}` : 'Chamber'}`)
        } else {
          toast.error(result.message || 'Lot not found')
        }
      } catch (error) {
        console.error('🔍 Search error:', error)
        toast.error('Failed to search lot. Please try again.')
      } finally {
        dispatch({ type: 'SEARCH_END' })
      }
    },
    [markers, mapInstance],
  )

  const clearSearch = useCallback(() => {
    dispatch({ type: 'SET_SEARCH_QUERY', query: '' })
    dispatch({ type: 'SEARCH_SUCCESS', result: null })
    dispatch({ type: 'SET_HIGHLIGHTED_NICHE', niche: null })
    dispatch({ type: 'SET_AUTO_POPUP', plotId: null })
    dispatch({ type: 'RESET_GROUPS' })
  }, [])

  // 🚀 Request popup close - either immediately or after route completion
  const requestPopupClose = useCallback(() => {
    // declarative: dispatch token increment
    dispatch({ type: 'REQUEST_POPUP_CLOSE' })
  }, [])

  // 🎯 Grouped markers (memoized) & available groups for dropdown
  const markersByGroup = useMemo(() => groupMarkersByKey(markers), [markers])
  const availableGroups = useMemo(
    () =>
      Object.entries(markersByGroup)
        .map(([key, groupMarkers]) => {
          const raw = key.startsWith('block:') ? key.split('block:')[1] : key.startsWith('category:') ? key.split('category:')[1] : key
          const label = key.startsWith('category:') ? raw.charAt(0).toUpperCase() + raw.slice(1) : `Block ${raw}`
          return { key, label, count: groupMarkers.length }
        })
        .sort((a, b) => a.label.localeCompare(b.label)),
    [markersByGroup],
  )

  // 🔄 Reset map view to default state (center via bounds + default zoom)
  const resetView = useCallback(() => {
    if (mapInstance) {
      const targetZoom = 18
      const centerLat = (bounds[0][0] + bounds[1][0]) / 2
      const centerLng = (bounds[0][1] + bounds[1][1]) / 2
      mapInstance.flyTo([centerLat, centerLng], targetZoom, { animate: true })
    }
    dispatch({ type: 'RESET_VIEW' })
  }, [mapInstance, bounds])

  const contextValue = useMemo(
    () => ({
      // direct state (for backward compat; prefer useMapState selectors moving forward)
      ...state,
      requestLocate,
      clearRoute,
      resetView,
      selectedGroups: state.selectedGroups,
      toggleGroupSelection,
      resetGroupSelection,
      clusterViewMode: state.clusterViewMode,
      availableGroups,
      handleClusterClick,
      searchQuery: state.searchQuery,
      setSearchQuery: (query: string) => dispatch({ type: 'SET_SEARCH_QUERY', query }),
      searchResult: state.searchResult,
      isSearching: state.isSearching,
      searchLot,
      clearSearch,
      highlightedNiche: state.highlightedNiche,
      autoOpenPopupFor: state.autoOpenPopupFor,
      setAutoOpenPopupFor: (plotId: string | null) => dispatch({ type: 'SET_AUTO_POPUP', plotId }),
      requestPopupClose,
    }),
    [state, requestLocate, clearRoute, resetView, toggleGroupSelection, resetGroupSelection, availableGroups, handleClusterClick, searchLot, clearSearch, requestPopupClose],
  )

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <MapStateContext.Provider value={state}>
      <MapDispatchContext.Provider value={dispatch}>
        <LocateContext.Provider value={contextValue}>
          <div className="relative h-screen w-full">
            <WebMapNavs />
            {(locationError || routingError) && (
              <div className="absolute top-4 right-4 z-[999] max-w-sm">
                <div className="rounded-md border border-red-200 bg-red-50 p-4">
                  <p className="text-sm text-red-800">{locationError?.message || routingError || 'Unknown error'}</p>
                </div>
              </div>
            )}

            <MapContainer
              className="h-full w-full rounded-lg"
              markerZoomAnimation={true}
              scrollWheelZoom={true}
              fadeAnimation={true}
              zoomControl={false}
              bounds={bounds}
              maxZoom={25}
              zoom={18}
              transform3DLimit={0}
              inertia={true}
              inertiaDeceleration={3000}
              inertiaMaxSpeed={1000}
              easeLinearity={0.25}
              worldCopyJump={false}
              maxBoundsViscosity={1.0}
            >
              <MapInstanceBinder onMapReady={setMapInstance} />
              <TileLayer
                url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxNativeZoom={18}
                maxZoom={25}
                tileSize={256}
                updateWhenIdle={false}
                updateWhenZooming={true}
                updateInterval={200}
                keepBuffer={16}
                detectRetina={false}
                crossOrigin={true}
                zoomOffset={0}
                zoomReverse={false}
                opacity={1}
                zIndex={1}
              />

              <MemoizedComfortRoomMarker onDirectionClick={handleDirectionClick} isDirectionLoading={state.isDirectionLoading} />
              <MemoizedParkingMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={state.isDirectionLoading} />
              <MemoizedPlaygroundMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={state.isDirectionLoading} />
              <MemoizedCenterSerenityMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={state.isDirectionLoading} />
              <MemoizedMainEntranceMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={state.isDirectionLoading} />
              <MemoizedChapelMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={state.isDirectionLoading} />
              <CustomClusterManager
                markersByGroup={markersByGroup}
                onDirectionClick={handleDirectionClick}
                isDirectionLoading={state.isDirectionLoading}
                selectedGroups={state.selectedGroups}
                clusterViewMode={state.clusterViewMode}
                onClusterClick={handleClusterClick}
                PlotMarkersComponent={MemoizedPlotMarkers}
                searchResult={state.searchResult}
                highlightedNiche={state.highlightedNiche}
              />

              <Suspense fallback={null}>
                {route && routeCoordinates.length > 0 && (
                  <ValhallaRoute
                    key={route.trip.summary.length}
                    route={route}
                    routeCoordinates={routeCoordinates}
                    remainingCoordinates={remainingCoordinates}
                    originalStart={originalStart || undefined}
                    originalEnd={originalEnd || undefined}
                    userLocation={currentLocation}
                    isNavigating={isNavigating}
                    showMarkers={true}
                    fitBounds={!isNavigating}
                  />
                )}
                <MemoizedNavigationInstructions
                  isOpen={state.isNavigationInstructionsOpen}
                  onClose={clearRoute}
                  navigationState={navigation}
                  allManeuvers={route?.trip.legs[0]?.maneuvers || []}
                  isNavigating={isNavigating}
                  isRerouting={isRerouting}
                  totalDistance={totalDistance || undefined}
                  totalTime={totalTime || undefined}
                  rerouteCount={rerouteCount}
                />
                {!(route && routeCoordinates.length > 0) && (
                  <UserLocationMarker userLocation={currentLocation} centerOnFirst={state.shouldCenterOnUser} enableAnimation={true} showAccuracyCircle={true} />
                )}
              </Suspense>
            </MapContainer>
          </div>
        </LocateContext.Provider>
      </MapDispatchContext.Provider>
    </MapStateContext.Provider>
  )
}
