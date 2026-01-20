import 'leaflet/dist/leaflet.css'
import '@maptiler/leaflet-maptilersdk'

import type { TileLayerKey } from '@/contexts/constants'
import type { ReactNode } from 'react'
import { lazy, memo, Suspense, useCallback, useEffect, useMemo, useRef } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'

import FloatingChatWidget from '@/components/FloatingChatWidget'
import CustomClusterManager from '@/components/map/CustomClusterManager'
import { UserLocationMarker } from '@/components/map/UserLocationMarker'
import { ValhallaRoute } from '@/components/map/ValhallaRoute'
import Spinner from '@/components/ui/spinner'
import { TILE_LAYER_OPTIONS } from '@/contexts/constants'
import { useLocation, useMapData, useMapState, useNavigation } from '@/contexts/hooks'
import { MapProvider } from '@/contexts/MapProvider'
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

function MapContent({ onBack, initialDirection }: { onBack?: () => void; initialDirection?: { lat: number; lng: number } | null }) {
  // Get contexts
  const { currentLocation, setMapInstance, stopTracking } = useLocation()
  const {
    route,
    routeCoordinates,
    remainingCoordinates,
    originalStart,
    originalEnd,
    navigation,
    isNavigating,
    isRerouting,
    totalDistance,
    totalTime,
    rerouteCount,
    handleDirectionClick,
    cancelNavigation,
  } = useNavigation()
  const { markersByGroup, userMarkers } = useMapData()
  const { state, dispatch, handleClusterClick } = useMapState()

  const bounds = useMemo<[[number, number], [number, number]]>(
    () => [
      [10.247883800064669, 123.79691285546676],
      [10.249302749341647, 123.7988598710129],
    ],
    [],
  )

  const mapInstanceRef = useRef<L.Map | null>(null)

  // Bind map instance to location provider
  const handleMapReady = useCallback(
    (map: L.Map) => {
      mapInstanceRef.current = map
      setMapInstance(map)
    },
    [setMapInstance],
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking()
    }
  }, [stopTracking])

  // Handle initial direction from props
  const lastInitDirRef = useRef<string | null>(null)
  useEffect(() => {
    if (!initialDirection || !isNativePlatform()) return
    const sig = `${initialDirection.lat},${initialDirection.lng}`
    if (lastInitDirRef.current === sig) return
    if (isNavigating) return
    lastInitDirRef.current = sig
    requestAnimationFrame(() => handleDirectionClick([initialDirection.lat, initialDirection.lng]))
  }, [initialDirection, handleDirectionClick, isNavigating])

  // Handle direction loading state
  useEffect(() => {
    if (!(route && routeCoordinates.length > 0 && state.isDirectionLoading && mapInstanceRef.current)) return
    const handleMoveEnd = () => {
      dispatch({ type: 'SET_DIRECTION_LOADING', value: false })
      mapInstanceRef.current?.off('moveend', handleMoveEnd)
    }
    mapInstanceRef.current.on('moveend', handleMoveEnd)
    return () => {
      mapInstanceRef.current?.off('moveend', handleMoveEnd)
    }
  }, [route, routeCoordinates, state.isDirectionLoading, dispatch])

  return (
    <div className="relative h-full w-full overflow-hidden">
      <WebMapNavs onBack={onBack} />
      <WebmapLegend />
      {!isNativePlatform() && <FloatingChatWidget />}
      <MapContainer className="h-full w-full z-1" zoomControl={false} bounds={bounds} maxZoom={25} zoom={18}>
        <MapInstanceBinder onMapReady={handleMapReady} />
        {state.selectedTileLayer === 'maptilerStreets' ? (
          <MapTilerLayerComponent key={state.selectedTileLayer} apiKey={import.meta.env.VITE_MAPTILER_API_KEY} style="streets-v2" />
        ) : (
          <TileLayer
            key={state.selectedTileLayer}
            url={TILE_LAYER_OPTIONS[state.selectedTileLayer as TileLayerKey].url}
            maxNativeZoom={18}
            maxZoom={25}
            detectRetina={true}
          />
        )}
        {/* Constants finisterre markers */}
        <MemoizedComfortRoomMarker onDirectionClick={handleDirectionClick} isDirectionLoading={state.isDirectionLoading} />
        <MemoizedParkingMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={state.isDirectionLoading} />
        <MemoizedPlaygroundMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={state.isDirectionLoading} />
        <MemoizedCenterSerenityMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={state.isDirectionLoading} />
        <MemoizedMainEntranceMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={state.isDirectionLoading} />
        <MemoizedChapelMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={state.isDirectionLoading} />
        <MemoizedPetersRockMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={state.isDirectionLoading} />
        {/* This is for clustering the plot markers by category */}
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
  )
}

export default function MapPage({ onBack, initialDirection }: { onBack?: () => void; initialDirection?: { lat: number; lng: number } | null }) {
  return (
    <MapProvider
      locationOptions={{ enableHighAccuracy: true, distanceFilter: 5 }}
      navigationOptions={{ costingType: 'pedestrian', enableAutoReroute: true, offRouteThreshold: 25 }}
    >
      <MapDataLoader>
        <MapContent onBack={onBack} initialDirection={initialDirection} />
      </MapDataLoader>
    </MapProvider>
  )
}

function MapDataLoader({ children }: { children: ReactNode }) {
  const { isLoading } = useMapData()

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return <>{children}</>
}
