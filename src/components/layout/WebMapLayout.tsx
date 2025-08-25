import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import { createContext, useEffect, useMemo, useCallback, memo, useState, Suspense, lazy } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { toast } from 'sonner'

import CustomClusterManager from '@/components/map/CustomClusterManager'
import { NavigationInstructions } from '@/components/map/NavigationInstructions'
import { UserLocationMarker } from '@/components/map/UserLocationMarker'
import { ValhallaRoute } from '@/components/map/ValhallaRoute'
import Spinner from '@/components/ui/spinner'
import { usePlots } from '@/hooks/plots-hooks/plot.hooks'
import { useLocationTracking } from '@/hooks/useLocationTracking'
import { useValhalla } from '@/hooks/useValhalla'
import WebMapNavs from '@/pages/webmap/WebMapNavs'

import { convertPlotToMarker } from '@/types/map.types'
import type { LotSearchResult, ConvertedMarker } from '@/types/map.types'
import { groupMarkersByKey } from '@/lib/clusterUtils'
import { searchLotById } from '@/api/plots.api'

const PlotMarkers = lazy(() => import('@/pages/webmap/PlotMarkers'))
const ComfortRoomMarker = lazy(() => import('@/pages/webmap/ComfortRoomMarkers'))
const ParkingMarkers = lazy(() => import('@/pages/webmap/ParkingMarkers'))
const CenterSerenityMarkers = lazy(() => import('@/pages/webmap/CenterSerenityMarkers'))
const MainEntranceMarkers = lazy(() => import('@/pages/webmap/MainEntranceMarkers'))
const ChapelMarkers = lazy(() => import('@/pages/webmap/ChapelMarkers'))
const PlaygroundMarkers = lazy(() => import('@/pages/webmap/PlaygroundMarkers'))

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

// 💡 Internal component to capture map instance once available
function MapInstanceBinder({ onMapReady }: { onMapReady: (map: L.Map) => void }) {
  const map = useMap()
  useEffect(() => {
    onMapReady(map)
    // Attach reference for legacy direct DOM usage elsewhere
    ;(map.getContainer() as any)._leaflet_map = map
  }, [map, onMapReady])
  return null
}

export const LocateContext = createContext<{
  requestLocate: () => Promise<void>
  clearRoute: () => void
  resetView: () => void
  selectedGroups: Set<string>
  toggleGroupSelection: (groupKey: string) => void
  resetGroupSelection: () => void
  clusterViewMode: 'all' | 'selective'
  availableGroups: Array<{ key: string; label: string; count: number }>
  handleClusterClick: (groupKey: string) => void
  // 🔍 Search functionality
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchResult: LotSearchResult | null
  isSearching: boolean
  searchLot: (lotId: string) => Promise<void>
  clearSearch: () => void
  highlightedNiche: string | null
  // 🎯 Auto popup functionality
  autoOpenPopupFor: string | null
  setAutoOpenPopupFor: (plotId: string | null) => void
} | null>(null)

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

  const [isNavigationInstructionsOpen, setIsNavigationInstructionsOpen] = useState(false)
  const [isDirectionLoading, setIsDirectionLoading] = useState(false)
  const [shouldCenterOnUser, setShouldCenterOnUser] = useState(false)

  // 🎯 Cluster control state
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set())
  const [clusterViewMode, setClusterViewMode] = useState<'all' | 'selective'>('all')

  // 🔍 Search state
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchResult, setSearchResult] = useState<LotSearchResult | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [highlightedNiche, setHighlightedNiche] = useState<string | null>(null)

  // 🎯 Auto popup state
  const [autoOpenPopupFor, setAutoOpenPopupFor] = useState<string | null>(null)

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
    if (shouldCenterOnUser && currentLocation) {
      const timeoutId = setTimeout(() => setShouldCenterOnUser(false), 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [shouldCenterOnUser, currentLocation])

  // Memoize callback functions to prevent them from being recreated on every render.
  const requestLocate = useCallback(async () => {
    // Start tracking if not already active
    if (!isTracking) {
      startTracking()
    }
    setShouldCenterOnUser(true) // still used by marker component for first-center behavior / animation

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
      const targetZoom = Math.max(mapInstance.getZoom(), 18)
      // Using flyTo for smoother animated transition similar to resetView animation semantics
      mapInstance.flyTo([loc.latitude, loc.longitude], targetZoom, { animate: true })
    }
  }, [isTracking, startTracking, currentLocation, getCurrentLocation, mapInstance])

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
    [currentLocation, getCurrentLocation, isTracking, startNavigation, startTracking, requestLocate],
  )

  // 🎯 Cluster control functions
  const toggleGroupSelection = useCallback((groupKey: string) => {
    setSelectedGroups((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(groupKey)) {
        newSet.delete(groupKey)
      } else {
        newSet.add(groupKey)
      }
      setClusterViewMode(newSet.size > 0 ? 'selective' : 'all')
      return newSet
    })
  }, [])

  const resetGroupSelection = useCallback(() => {
    setSelectedGroups(new Set())
    setClusterViewMode('all')
  }, [])

  // 🎯 Handle cluster click - select single group
  const handleClusterClick = useCallback((groupKey: string) => {
    setSelectedGroups(new Set([groupKey]))
    setClusterViewMode('selective')
  }, [])

  // 🔍 Search functions
  const searchLot = useCallback(
    async (lotId: string) => {
      if (!lotId.trim()) {
        toast.error('Please enter a lot ID')
        return
      }

      setIsSearching(true)
      setSearchResult(null)
      setHighlightedNiche(null)

      try {
        const result = await searchLotById(lotId.trim())
        setSearchResult(result)

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
            setSelectedGroups(new Set([groupKey]))
            setClusterViewMode('selective')

            // If there's a niche number, highlight it
            if (niche_number) {
              setHighlightedNiche(niche_number)
            }

            // 🎯 Set auto popup for this plot and center map
            setAutoOpenPopupFor(plot_id)

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
        setIsSearching(false)
      }
    },
    [markers, mapInstance],
  )

  const clearSearch = useCallback(() => {
    setSearchQuery('')
    setSearchResult(null)
    setHighlightedNiche(null)
    setAutoOpenPopupFor(null)
    setSelectedGroups(new Set())
    setClusterViewMode('all')
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
    // 🔁 Reset related UI state
    resetGroupSelection()
    setSearchQuery('')
    setSearchResult(null)
    setHighlightedNiche(null)
    setAutoOpenPopupFor(null)
  }, [mapInstance, bounds, resetGroupSelection])

  const contextValue = useMemo(
    () => ({
      requestLocate,
      clearRoute,
      resetView,
      selectedGroups,
      toggleGroupSelection,
      resetGroupSelection,
      clusterViewMode,
      availableGroups,
      handleClusterClick,
      // 🔍 Search properties
      searchQuery,
      setSearchQuery,
      searchResult,
      isSearching,
      searchLot,
      clearSearch,
      highlightedNiche,
      // 🎯 Auto popup properties
      autoOpenPopupFor,
      setAutoOpenPopupFor,
    }),
    [
      requestLocate,
      clearRoute,
      resetView,
      selectedGroups,
      toggleGroupSelection,
      resetGroupSelection,
      clusterViewMode,
      availableGroups,
      handleClusterClick,
      searchQuery,
      setSearchQuery,
      searchResult,
      isSearching,
      searchLot,
      clearSearch,
      highlightedNiche,
      autoOpenPopupFor,
      setAutoOpenPopupFor,
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
    <LocateContext.Provider value={contextValue}>
      <div className="relative h-screen w-full">
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
          <div className="absolute top-4 right-4 z-[999] max-w-sm">
            <div className="rounded-md border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-800">{locationError?.message || routingError || 'Unknown error'}</p>
            </div>
          </div>
        )}

        <MapContainer className="h-full w-full" scrollWheelZoom={true} zoomControl={false} bounds={bounds} maxZoom={25} zoom={18}>
          <MapInstanceBinder onMapReady={setMapInstance} />
          <TileLayer url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" maxNativeZoom={18} maxZoom={25} />

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

            <MemoizedComfortRoomMarker onDirectionClick={handleDirectionClick} isDirectionLoading={isDirectionLoading} />
            <MemoizedParkingMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={isDirectionLoading} />
            <MemoizedPlaygroundMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={isDirectionLoading} />
            <MemoizedCenterSerenityMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={isDirectionLoading} />
            <MemoizedMainEntranceMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={isDirectionLoading} />
            <MemoizedChapelMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={isDirectionLoading} />
            <CustomClusterManager
              markersByGroup={markersByGroup}
              onDirectionClick={handleDirectionClick}
              isDirectionLoading={isDirectionLoading}
              selectedGroups={selectedGroups}
              clusterViewMode={clusterViewMode}
              onClusterClick={handleClusterClick}
              PlotMarkersComponent={MemoizedPlotMarkers}
              searchResult={searchResult}
              highlightedNiche={highlightedNiche}
            />
          </Suspense>
          {!(route && routeCoordinates.length > 0) && (
            <UserLocationMarker userLocation={currentLocation} centerOnFirst={shouldCenterOnUser} enableAnimation={true} showAccuracyCircle={true} />
          )}
        </MapContainer>
      </div>
    </LocateContext.Provider>
  )
}
