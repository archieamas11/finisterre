import { Notification } from 'konsta/react'

import 'leaflet/dist/leaflet.css'
import '@maptiler/leaflet-maptilersdk'

import type { MapAction, MapState } from '@/contexts/MapContext'
import type { ConvertedMarker } from '@/types/map.types'
import { lazy, memo, Suspense, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import L from 'leaflet'
import { parseAsString, useQueryStates } from 'nuqs'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { toast } from 'sonner'

import { searchLotById } from '@/api/plots.api'
import FloatingChatWidget from '@/components/FloatingChatWidget'
import CustomClusterManager from '@/components/map/CustomClusterManager'
import { UserLocationMarker } from '@/components/map/UserLocationMarker'
import { ValhallaRoute } from '@/components/map/ValhallaRoute'
import Spinner from '@/components/ui/spinner'
import { LocateContext, MapDispatchContext, MapStateContext } from '@/contexts/MapContext'
import { usePlots } from '@/hooks/plots-hooks/plot.hooks'
// import { useIsSmallMobile } from '@/hooks/use-mobile'
import { useLocationTracking } from '@/hooks/useLocationTracking'
import { useMarkersOffline } from '@/hooks/useMarkersOffline'
import { convertUserPlotToMarker, useUserOwnedPlots } from '@/hooks/user-hooks/useUserOwnedPlots'
import { useValhalla } from '@/hooks/useValhalla'
import { groupMarkersByKey } from '@/lib/clusterUtils'
import CenterSerenityMarkers from '@/pages/webmap/CenterSerenityMarkers'
import ChapelMarkers from '@/pages/webmap/ChapelMarkers'
import ComfortRoomMarker from '@/pages/webmap/ComfortRoomMarkers'
import MainEntranceMarkers from '@/pages/webmap/MainEntranceMarkers'
import ParkingMarkers from '@/pages/webmap/ParkingMarkers'
import PetersRockMarkers from '@/pages/webmap/PeterRock'
import PlaygroundMarkers from '@/pages/webmap/PlaygroundMarkers'
import PlotMarkers from '@/pages/webmap/PlotMarkers'
import { WebmapLegend } from '@/pages/webmap/WebmapLegend'
import WebMapNavs from '@/pages/webmap/WebMapNavs'
import { convertPlotToMarker } from '@/types/map.types'
import { isNativePlatform } from '@/utils/platform.utils'

const NavigationInstructions = lazy(() => import('@/components/map/NavigationInstructions'))
const MapTilerLayerComponent = lazy(() => import('@/components/map/MapTilerLayerComponent'))

const MemoizedComfortRoomMarker = memo(ComfortRoomMarker)
const MemoizedParkingMarkers = memo(ParkingMarkers)
const MemoizedCenterSerenityMarkers = memo(CenterSerenityMarkers)
const MemoizedMainEntranceMarkers = memo(MainEntranceMarkers)
const MemoizedChapelMarkers = memo(ChapelMarkers)
const MemoizedPlaygroundMarkers = memo(PlaygroundMarkers)
const MemoizedPetersRockMarkers = memo(PetersRockMarkers)
const MemoizedPlotMarkers = memo(PlotMarkers)
const MemoizedNavigationInstructions = memo(NavigationInstructions)

declare global {
  interface HTMLElement {
    _leaflet_map?: L.Map
  }
}

function MapInstanceBinder({ onMapReady }: { onMapReady: (map: L.Map) => void }) {
  const map = useMap()

  useEffect(() => {
    if (!map) return
    onMapReady(map)
    map.getContainer()._leaflet_map = map

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

const initialMapState: MapState = {
  isNavigationInstructionsOpen: false,
  isDirectionLoading: false,
  selectedGroups: new Set(),
  clusterViewMode: 'all',
  searchQuery: '',
  searchResult: null,
  isSearching: false,
  highlightedNiche: null,
  autoOpenPopupFor: null,
}

const TILE_LAYER_OPTIONS = {
  arcgis: {
    name: 'Satellite',
    url: 'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/58924/{z}/{y}/{x}',
  },
  osm: {
    name: 'Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
  maptilerStreets: {
    name: 'Streets 3D',
    url: 'streets-v4',
  },
} as const

type TileLayerKey = keyof typeof TILE_LAYER_OPTIONS

function mapReducer(state: MapState, action: MapAction): MapState {
  switch (action.type) {
    case 'SET_NAV_OPEN':
      return { ...state, isNavigationInstructionsOpen: action.value }
    case 'SET_DIRECTION_LOADING':
      return { ...state, isDirectionLoading: action.value }
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
    case 'SHOW_USER_PLOTS':
      return {
        ...state,
        selectedGroups: new Set(),
        clusterViewMode: 'user-plots',
        searchQuery: '',
        searchResult: null,
        highlightedNiche: null,
      }
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

export default function MapPage({ onBack, initialDirection }: { onBack?: () => void; initialDirection?: { lat: number; lng: number } | null }) {
  // const isSmallMobile = useIsSmallMobile()
  const bounds = useMemo<[[number, number], [number, number]]>(
    () => [
      [10.247883800064669, 123.79691285546676],
      [10.249302749341647, 123.7988598710129],
    ],
    [],
  )

  // const ZOOM = isSmallMobile ? 18 : 19
  // const MAX_ZOOM = isSmallMobile ? 22 : 20

  // const ZOOM = 18
  // const MAX_ZOOM = 22

  const { isLoading: rqLoading, data: plotsDataRQ } = usePlots()
  const { data: offlinePlots, isLoading: offlineLoading } = useMarkersOffline()
  const plotsData = offlinePlots && offlinePlots.length > 0 ? offlinePlots : plotsDataRQ
  const isLoading = !plotsData && (rqLoading || offlineLoading)
  const { data: userPlotsData } = useUserOwnedPlots()
  const markers = useMemo(() => plotsData?.map(convertPlotToMarker) || [], [plotsData])
  const userMarkers = useMemo(() => {
    if (!userPlotsData?.plots) return []
    return userPlotsData.plots.map(convertUserPlotToMarker).filter((marker): marker is NonNullable<typeof marker> => marker !== null)
  }, [userPlotsData])

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

  const [konstaNotificationOpen, setKonstaNotificationOpen] = useState(false)
  const [konstaNotificationProps, setKonstaNotificationProps] = useState<{
    title?: string
    subtitle?: string
    text?: string
    titleRightText?: string
  }>({})

  useEffect(() => {
    if (!konstaNotificationOpen) return
    const t = setTimeout(() => setKonstaNotificationOpen(false), 3000)
    return () => clearTimeout(t)
  }, [konstaNotificationOpen])

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

  const [mapInstance, setMapInstance] = useState<L.Map | null>(null)
  const [selectedTileLayer, setSelectedTileLayer] = useState<TileLayerKey>('arcgis')

  useEffect(() => {
    if (!isNavigating || !currentLocation) return
    handleLocationUpdate(currentLocation)
  }, [currentLocation, isNavigating, handleLocationUpdate])

  useEffect(() => {
    return () => {
      stopTracking()
    }
  }, [stopTracking])

  const hasCenteredRef = useRef(false)
  const suppressAutoCenterRef = useRef(false)
  useEffect(() => {
    if (!currentLocation || !mapInstance) return
    if (hasCenteredRef.current) return

    if (suppressAutoCenterRef.current) {
      suppressAutoCenterRef.current = false
      return
    }

    if (isNavigating) {
      dispatch({ type: 'CLEAR_LOCATE' })
      return
    }

    hasCenteredRef.current = true
    mapInstance.flyTo([currentLocation.latitude, currentLocation.longitude])
    dispatch({ type: 'CLEAR_LOCATE' })
    const t = setTimeout(() => {
      hasCenteredRef.current = false
    }, 1000)
    return () => clearTimeout(t)
  }, [currentLocation, mapInstance, isNavigating])

  useEffect(() => {
    if (!(route && routeCoordinates.length > 0 && state.isDirectionLoading && mapInstance)) return
    const handleMoveEnd = () => {
      dispatch({ type: 'SET_DIRECTION_LOADING', value: false })
      mapInstance.off('moveend', handleMoveEnd)
    }
    mapInstance.on('moveend', handleMoveEnd)
    return () => {
      mapInstance.off('moveend', handleMoveEnd)
    }
  }, [route, routeCoordinates, state.isDirectionLoading, mapInstance])

  const requestLocate = useCallback(
    async (zoom: number = 18) => {
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

  const lastDestSigRef = useRef<string | null>(null)
  const lastCancelledDestRef = useRef<string | null>(null)

  const cancelNavigation = useCallback(() => {
    const currentTo = query.to
    if (currentTo) lastCancelledDestRef.current = currentTo
    lastDestSigRef.current = null
    setQuery({ from: null, to: null })
    stopNavigation()
    dispatch({ type: 'SET_NAV_OPEN', value: false })
    dispatch({ type: 'SET_DIRECTION_LOADING', value: false })
    suppressAutoCenterRef.current = true
    setTimeout(() => {
      suppressAutoCenterRef.current = false
    }, 2000)
  }, [stopNavigation, setQuery, query.to])

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
        ;(isNativePlatform() ? konstaNotify : toast.error)(`Navigation failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
        if (!isTracking) await startTracking().catch(() => {})
      } finally {
        dispatch({ type: 'SET_DIRECTION_LOADING', value: false })
      }
    },
    [currentLocation, getCurrentLocation, isTracking, startNavigation, requestLocate, setQuery, startTracking],
  )

  const konstaNotify = (text: string) => {
    setKonstaNotificationProps({ title: 'Navigation Error', text, titleRightText: 'now' })
    setKonstaNotificationOpen(true)
  }

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

  useEffect(() => {
    if (!mapInstance) return
    if (isNavigating) return

    const hasNavParam = Boolean(query.to || query.from)
    if (!hasNavParam) return

    void requestLocate()
  }, [mapInstance, query.to, query.from, requestLocate, isNavigating])

  const lastInitDirRef = useRef<string | null>(null)
  useEffect(() => {
    if (!initialDirection || !isNativePlatform()) return
    const sig = `${initialDirection.lat},${initialDirection.lng}`
    if (lastInitDirRef.current === sig) return
    if (isNavigating) return
    lastInitDirRef.current = sig
    requestAnimationFrame(() => handleDirectionClick([initialDirection.lat, initialDirection.lng]))
  }, [initialDirection, handleDirectionClick, isNavigating])

  const toggleGroupSelection = useCallback((groupKey: string) => dispatch({ type: 'TOGGLE_GROUP', group: groupKey }), [])
  const resetGroupSelection = useCallback(() => dispatch({ type: 'RESET_GROUPS' }), [])
  const handleClusterClick = useCallback((groupKey: string) => dispatch({ type: 'SELECT_GROUPS', groups: new Set([groupKey]) }), [])
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

          const matchedMarker = markers.find((m: ConvertedMarker) => m.plot_id === plot_id)
          if (matchedMarker) {
            const groupKey = matchedMarker.block ? `block:${matchedMarker.block}` : `category:${matchedMarker.category}`
            dispatch({ type: 'SELECT_GROUPS', groups: new Set([groupKey]) })
            if (niche_number) dispatch({ type: 'SET_HIGHLIGHTED_NICHE', niche: niche_number })
            dispatch({ type: 'SET_AUTO_POPUP', plotId: String(plot_id) })
            const centerCoords = plotCoords || matchedMarker.position
            if (mapInstance && centerCoords) mapInstance.setView(centerCoords, 18, { animate: true })
          }

          if (isNativePlatform()) {
            setKonstaNotificationProps({
              title: 'Lot found',
              subtitle: `${result.data.category} ${result.data.block ? `- Block ${result.data.block}` : '- Chamber'}`,
              text: `Plot ${result.data.plot_id}`,
              titleRightText: 'now',
            })
            setKonstaNotificationOpen(true)
          } else {
            toast.success(`Lot found in ${result.data.category} - ${result.data.block ? `Block ${result.data.block}` : 'Chamber'}`)
          }
        } else {
          const errorMessage = result.message || 'Lot not found'
          if (isNativePlatform()) {
            setKonstaNotificationProps({
              title: 'Search Error',
              text: errorMessage,
              titleRightText: 'now',
            })
            setKonstaNotificationOpen(true)
          } else {
            toast.error(errorMessage)
          }
        }
      } catch (error) {
        console.error('Search error:', error)
        const errorMessage = 'Failed to search lot. Please try again.'
        if (isNativePlatform()) {
          setKonstaNotificationProps({
            title: 'Search Error',
            text: errorMessage,
            titleRightText: 'now',
          })
          setKonstaNotificationOpen(true)
        } else {
          toast.error(errorMessage)
        }
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

  const resetView = useCallback(() => {
    if (!mapInstance) return

    const [sw, ne] = bounds
    const centerLatLng: [number, number] = [(sw[0] + ne[0]) / 2, (sw[1] + ne[1]) / 2]

    mapInstance.flyTo(centerLatLng, 18)
    dispatch({ type: 'RESET_VIEW' })
  }, [mapInstance, bounds])

  useEffect(() => {
    if (!(locationError || routingError)) return
    const message = 'Unable to get directions. Please try again.'
    if (isNativePlatform()) {
      setKonstaNotificationProps({ title: 'Error', text: message, titleRightText: 'now' })
      setKonstaNotificationOpen(true)
    } else {
      toast.error(message)
    }
  }, [locationError, routingError])

  const showUserPlotsOnly = useCallback(() => {
    dispatch({ type: 'SHOW_USER_PLOTS' })
  }, [])

  const contextValue = useMemo(
    () => ({
      ...state,
      requestLocate,
      cancelNavigation,
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
      showUserPlotsOnly,
      userOwnedPlotsCount: userMarkers.length,
      selectedTileLayer,
      setSelectedTileLayer: (layer: string) => setSelectedTileLayer(layer as TileLayerKey),
      tileLayerOptions: TILE_LAYER_OPTIONS,
    }),
    [
      state,
      requestLocate,
      cancelNavigation,
      resetView,
      toggleGroupSelection,
      resetGroupSelection,
      availableGroups,
      handleClusterClick,
      searchLot,
      clearSearch,
      showUserPlotsOnly,
      userMarkers.length,
      selectedTileLayer,
      setSelectedTileLayer,
    ],
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
          <div className="relative h-full w-full overflow-hidden">
            <WebMapNavs onBack={onBack} />
            <WebmapLegend />
            {!isNativePlatform() && <FloatingChatWidget />}
            <Notification
              opened={konstaNotificationOpen}
              title={konstaNotificationProps.title}
              subtitle={konstaNotificationProps.subtitle}
              text={konstaNotificationProps.text}
              titleRightText={konstaNotificationProps.titleRightText}
              button
              onClick={() => setKonstaNotificationOpen(false)}
              className="z-999"
            />

            <MapContainer className="h-full w-full z-1" zoomControl={false} bounds={bounds} maxZoom={25} zoom={18}>
              <MapInstanceBinder onMapReady={setMapInstance} />
              {selectedTileLayer === 'maptilerStreets' ? (
                <MapTilerLayerComponent key={selectedTileLayer} apiKey={import.meta.env.VITE_MAPTILER_API_KEY} style="streets-v2" />
              ) : (
                <TileLayer
                  key={selectedTileLayer}
                  url={TILE_LAYER_OPTIONS[selectedTileLayer].url}
                  // maxNativeZoom={ZOOM}
                  // maxZoom={MAX_ZOOM}
                  maxNativeZoom={18}
                  maxZoom={25}
                  detectRetina={true}
                />
              )}
              {/* https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/49999/%7Blevel%7D/%7Brow%7D/%7Bcol%7D{' '} */}
              {/* Constants finisterre markers */}
              <MemoizedComfortRoomMarker onDirectionClick={handleDirectionClick} isDirectionLoading={state.isDirectionLoading} />
              <MemoizedParkingMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={state.isDirectionLoading} />
              <MemoizedPlaygroundMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={state.isDirectionLoading} />
              <MemoizedCenterSerenityMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={state.isDirectionLoading} />
              <MemoizedMainEntranceMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={state.isDirectionLoading} />
              <MemoizedChapelMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={state.isDirectionLoading} />
              <MemoizedPetersRockMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={state.isDirectionLoading} />
              {/* This is for clustering the plot markers by category
              TODO: migrate to something better since this was just a quick fix and not permanent solution */}
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
                userMarkers={userMarkers}
              />
              {route && routeCoordinates.length > 0 && (
                <ValhallaRoute
                  route={route}
                  routeCoordinates={routeCoordinates}
                  remainingCoordinates={remainingCoordinates}
                  originalStart={originalStart || undefined}
                  originalEnd={originalEnd || undefined}
                  userLocation={currentLocation}
                  isNavigating={isNavigating}
                  showMarkers={true}
                />
              )}
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
              {!(route && routeCoordinates.length > 0) && <UserLocationMarker userLocation={currentLocation} />}
            </MapContainer>
          </div>
        </LocateContext.Provider>
      </MapDispatchContext.Provider>
    </MapStateContext.Provider>
  )
}
