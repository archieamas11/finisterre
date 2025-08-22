import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import {
  createContext,
  useEffect,
  useMemo,
  useCallback,
  memo,
  useState,
  Suspense,
  lazy
} from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import { toast } from 'sonner'

import { NavigationInstructions } from '@/components/map/NavigationInstructions'
import { UserLocationMarker } from '@/components/map/UserLocationMarker'
import { ValhallaRoute } from '@/components/map/ValhallaRoute'
import Spinner from '@/components/ui/spinner'
import { usePlots } from '@/hooks/plots-hooks/plot.hooks'
import { useLocationTracking } from '@/hooks/useLocationTracking'
import { useValhalla } from '@/hooks/useValhalla'
import WebMapNavs from '@/pages/webmap/WebMapNavs'
import 'leaflet.markercluster/dist/MarkerCluster.css'

import { convertPlotToMarker, type ConvertedMarker } from '@/types/map.types'

const PlotMarkers = lazy(() => import('@/pages/webmap/PlotMarkers'))
const ComfortRoomMarker = lazy(
  () => import('@/pages/webmap/ComfortRoomMarkers')
)
const ParkingMarkers = lazy(() => import('@/pages/webmap/ParkingMarkers'))
const CenterSerenityMarkers = lazy(
  () => import('@/pages/webmap/CenterSerenityMarkers')
)
const MainEntranceMarkers = lazy(
  () => import('@/pages/webmap/MainEntranceMarkers')
)
const ChapelMarkers = lazy(() => import('@/pages/webmap/ChapelMarkers'))
const PlaygroundMarkers = lazy(() => import('@/pages/webmap/PlaygroundMarkers'))

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
})
L.Marker.prototype.options.icon = DefaultIcon

const MemoizedComfortRoomMarker = memo(ComfortRoomMarker)
const MemoizedParkingMarkers = memo(ParkingMarkers)
const MemoizedCenterSerenityMarkers = memo(CenterSerenityMarkers)
const MemoizedMainEntranceMarkers = memo(MainEntranceMarkers)
const MemoizedChapelMarkers = memo(ChapelMarkers)
const MemoizedPlaygroundMarkers = memo(PlaygroundMarkers)
const MemoizedPlotMarkers = memo(PlotMarkers)

export const LocateContext = createContext<{
  requestLocate: () => void
  clearRoute: () => void
} | null>(null)

export default function MapPage() {
  const { isLoading, data: plotsData } = usePlots()
  const markers = useMemo(
    () => plotsData?.map(convertPlotToMarker) || [],
    [plotsData]
  )

  const {
    currentLocation,
    startTracking,
    stopTracking,
    getCurrentLocation,
    isTracking,
    error: locationError
  } = useLocationTracking({
    enableHighAccuracy: true,
    distanceFilter: 5
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
    error: routingError
  } = useValhalla({
    costingType: 'pedestrian',
    enableAutoReroute: true,
    offRouteThreshold: 25
  })

  const [isNavigationInstructionsOpen, setIsNavigationInstructionsOpen] =
    useState(false)
  const [isDirectionLoading, setIsDirectionLoading] = useState(false)
  const [shouldCenterOnUser, setShouldCenterOnUser] = useState(false)

  const bounds: [[number, number], [number, number]] = [
    [10.247883800064669, 123.79691285546676],
    [10.249302749341647, 123.7988598710129]
  ]

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
    if (shouldCenterOnUser && currentLocation) {
      const timeoutId = setTimeout(() => setShouldCenterOnUser(false), 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [shouldCenterOnUser, currentLocation])

  // Memoize callback functions to prevent them from being recreated on every render.
  const requestLocate = useCallback(() => {
    if (!isTracking) {
      startTracking()
    }
    setShouldCenterOnUser(true)
  }, [isTracking, startTracking])

  const clearRoute = useCallback(() => {
    stopNavigation()
    setIsNavigationInstructionsOpen(false)
    setIsDirectionLoading(false)
  }, [stopNavigation])

  const handleDirectionClick = useCallback(
    async (to: [number, number]) => {
      const [toLatitude, toLongitude] = to
      if (!toLatitude || !toLongitude) {
        console.warn('⚠️ Invalid destination coordinates:', to)
        setIsDirectionLoading(false)
        return
      }
      setIsDirectionLoading(true)
      setIsNavigationInstructionsOpen(false)

      try {
        // Get user location: use current if available, otherwise fetch
        let userLocation = currentLocation
        if (!userLocation) {
          userLocation = await getCurrentLocation()
        }

        if (
          !userLocation ||
          !userLocation.latitude ||
          !userLocation.longitude
        ) {
          throw new Error('Could not determine current location')
        }

        // Start navigation with proper typed coordinates
        await startNavigation(
          {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude
          },
          { latitude: toLatitude, longitude: toLongitude }
        )

        // Trigger map recentering or location update
        requestLocate()

        // Open navigation instructions UI
        setIsNavigationInstructionsOpen(true)
      } catch (error) {
        console.error('🚫 Failed to start navigation:', error)
        // Fallback: resume tracking if not already doing so
        if (!isTracking) {
          startTracking()
        }
        toast.error('Failed to start navigation. Using fallback tracking.')
      } finally {
        setIsDirectionLoading(false)
      }
    },
    [
      currentLocation,
      getCurrentLocation,
      isTracking,
      startNavigation,
      startTracking,
      requestLocate
    ]
  )

  // Memoize the context value to prevent consumers from re-rendering unnecessarily.
  const contextValue = useMemo(
    () => ({ requestLocate, clearRoute }),
    [requestLocate, clearRoute]
  )

  if (isLoading) {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <Spinner />
      </div>
    )
  }

  return (
    <LocateContext.Provider value={contextValue}>
      <div className='relative h-screen w-full'>
        <WebMapNavs />

        <NavigationInstructions
          isOpen={isNavigationInstructionsOpen}
          onClose={clearRoute}
          navigationState={navigation}
          allManeuvers={route?.trip.legs[0]?.maneuvers || []}
          isNavigating={isNavigating}
          isRerouting={isRerouting}
          totalDistance={totalDistance || undefined}
          totalTime={totalTime || undefined}
          rerouteCount={rerouteCount}
        />

        {(locationError || routingError) && (
          <div className='absolute top-4 right-4 z-[999] max-w-sm'>
            <div className='rounded-md border border-red-200 bg-red-50 p-4'>
              <p className='text-sm text-red-800'>
                {locationError?.message || routingError || 'Unknown error'}
              </p>
            </div>
          </div>
        )}

        <MapContainer
          className='h-full w-full'
          scrollWheelZoom={true}
          zoomControl={false}
          bounds={bounds}
          maxZoom={25}
          zoom={18}
        >
          <TileLayer
            url='https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            maxNativeZoom={18}
            maxZoom={25}
          />

          {!(route && routeCoordinates.length > 0) && (
            <UserLocationMarker
              userLocation={currentLocation}
              centerOnFirst={shouldCenterOnUser}
              enableAnimation={true}
              showAccuracyCircle={true}
            />
          )}

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

            {!(route && routeCoordinates.length > 0) && (
              <UserLocationMarker
                userLocation={currentLocation}
                centerOnFirst={shouldCenterOnUser}
                enableAnimation={true}
                showAccuracyCircle={true}
              />
            )}

            <MemoizedComfortRoomMarker
              onDirectionClick={handleDirectionClick}
              isDirectionLoading={isDirectionLoading}
            />
            <MemoizedParkingMarkers
              onDirectionClick={handleDirectionClick}
              isDirectionLoading={isDirectionLoading}
            />
            <MemoizedPlaygroundMarkers
              onDirectionClick={handleDirectionClick}
              isDirectionLoading={isDirectionLoading}
            />
            <MemoizedCenterSerenityMarkers
              onDirectionClick={handleDirectionClick}
              isDirectionLoading={isDirectionLoading}
            />
            <MemoizedMainEntranceMarkers
              onDirectionClick={handleDirectionClick}
              isDirectionLoading={isDirectionLoading}
            />
            <MemoizedChapelMarkers
              onDirectionClick={handleDirectionClick}
              isDirectionLoading={isDirectionLoading}
            />
            {(() => {
              const markersByGroup: Record<string, ConvertedMarker[]> = {}
              markers.forEach((marker: ConvertedMarker) => {
                const groupKey =
                  marker.block && String(marker.block).trim() !== ''
                    ? `block:${marker.block}`
                    : `category:${marker.category || 'Uncategorized'}`
                if (!markersByGroup[groupKey]) markersByGroup[groupKey] = []
                markersByGroup[groupKey].push(marker)
              })

              const getLabel = (groupKey: string): string => {
                if (groupKey.startsWith('block:')) {
                  const block = groupKey.split('block:')[1]
                  return `Block ${block}`
                } else {
                  const category = groupKey
                    .split('category:')[1]
                    .split(' ')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')
                  return category
                }
              }

              // Create cluster icon with formatted label
              const createClusterIcon =
                (groupKey: string) =>
                (cluster: { getChildCount: () => number }) => {
                  const count = cluster.getChildCount()
                  const label = getLabel(groupKey)

                  return L.divIcon({
                    html: `
                  <div class="relative flex flex-col items-center justify-center">
                    <div
                      class="border-2 border-white text-white bg-black/50 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]"
                    >
                      ${count}
                    </div>
                    <span class="shadow-md mt-1 text-xs font-bold text-gray-200">${label}</span>
                  </div>
                `,
                    className: 'custom-marker-cluster',
                    iconSize: [50, 60],
                    iconAnchor: [25, 30]
                  })
                }

              return Object.entries(markersByGroup).map(
                ([groupKey, groupMarkers]) => (
                  <MarkerClusterGroup
                    key={`cluster-${groupKey}`}
                    iconCreateFunction={createClusterIcon(groupKey)}
                    chunkedLoading={true}
                    maxClusterRadius={200}
                    disableClusteringAtZoom={20}
                    showCoverageOnHover={false}
                    spiderfyOnMaxZoom={false}
                    removeOutsideVisibleBounds={true}
                    animate={false}
                  >
                    <MemoizedPlotMarkers
                      markers={groupMarkers}
                      isDirectionLoading={isDirectionLoading}
                      onDirectionClick={handleDirectionClick}
                      block={
                        groupKey.startsWith('block:')
                          ? groupKey.split('block:')[1]
                          : ''
                      }
                    />
                  </MarkerClusterGroup>
                )
              )
            })()}
          </Suspense>
        </MapContainer>
      </div>
    </LocateContext.Provider>
  )
}
