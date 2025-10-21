import { useQueryClient } from '@tanstack/react-query'

import 'leaflet/dist/leaflet.css'

import type { ConvertedMarker } from '@/types/map.types'
import type { AdminSearchItem } from '@/types/search.types'
import L from 'leaflet'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import { useHotkeys } from 'react-hotkeys-hook'
import { GeoJSON, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import { useLocation, useNavigate } from 'react-router-dom'

import { searchLotById } from '@/api/plots.api'
import { ErrorMessage } from '@/components/ErrorMessage'
import AddMarkerInstructions from '@/components/map/AddMarkerInstructions'
import AddPlotMarkerDialog from '@/components/map/AddPlotMarkerDialog'
import EditableMarker from '@/components/map/EditableMarker'
import EditMarkerInstructions from '@/components/map/EditMarkerInstructions'
import MapClickHandler from '@/components/map/MapClickHandler'
import Spinner from '@/components/ui/spinner'
import guide4BlockBUrl from '@/data/geojson/guide-4-block-b.geojson?url'
import { usePlots } from '@/hooks/plots-hooks/plot.hooks'
import { useAuthQuery } from '@/hooks/useAuthQuery'
import { createClusterIconFactory, getLabelFromGroupKey, groupMarkersByKey } from '@/lib/clusterUtils'
import { ucwords } from '@/lib/format'
import ColumbariumPopup from '@/pages/admin/map4admin/ColumbariumPopup'
import MapStats from '@/pages/admin/map4admin/MapStats'
import SinglePlotLocations from '@/pages/admin/map4admin/SinglePlotPopup'
import CenterSerenityMarkers from '@/pages/webmap/CenterSerenityMarkers'
import ChapelMarkers from '@/pages/webmap/ChapelMarkers'
import ComfortRoomMarker from '@/pages/webmap/ComfortRoomMarkers'
import MainEntranceMarkers from '@/pages/webmap/MainEntranceMarkers'
import ParkingMarkers from '@/pages/webmap/ParkingMarkers'
import PeterRockMarkers from '@/pages/webmap/PeterRock'
import PlaygroundMarkers from '@/pages/webmap/PlaygroundMarkers'
import { convertPlotToMarker, getCategoryBackgroundColor, getStatusColor } from '@/types/map.types'
import AdminMapNavs from './AdminMapNavs'
import { LocateContext } from './LocateContext'

const DefaultIcon = L.icon({ iconUrl, shadowUrl, iconRetinaUrl })
;(L.Marker.prototype as unknown as { options: { icon: L.Icon } }).options.icon = DefaultIcon

function buildStatusCircleIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `<div style="width:15px;height:15px;border-radius:50%;background:${color};border:1px solid #fff;box-shadow:0 0 4px rgba(0,0,0,0.15);"></div>`,
  })
}

function renderPopupContent(marker: ConvertedMarker, backgroundColor: string, highlightedNiche?: string | null) {
  const isColumbarium = !!(marker.rows && marker.columns)
  if (isColumbarium) {
    return (
      <Popup className="leaflet-theme-popup" closeButton={false} offset={[2, 3]} minWidth={450}>
        <div className="w-full py-2">
          <ColumbariumPopup marker={marker} highlightedNiche={highlightedNiche ?? undefined} />
        </div>
      </Popup>
    )
  }
  return (
    <Popup className="leaflet-theme-popup" closeButton={false} offset={[1, 3]} minWidth={600} maxWidth={600}>
      <SinglePlotLocations backgroundColor={backgroundColor} marker={marker} />
    </Popup>
  )
}

export default function AdminMapLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { data: authData } = useAuthQuery()
  const showGuide4 = Boolean(authData?.user?.role === 'admin' && authData?.user?.username === 'test')
  const { isError, refetch, isLoading, data: plotsData } = usePlots()
  const queryClient = useQueryClient()
  const markers = useMemo(() => (plotsData ? plotsData.map(convertPlotToMarker) : []), [plotsData])
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null)
  const [autoOpenPlotId, setAutoOpenPlotId] = useState<string | null>(null)
  const [highlightedNiche, setHighlightedNiche] = useState<string | null>(null)
  const [activeSearchMarker, setActiveSearchMarker] = useState<ConvertedMarker | null>(null)
  const [isAddingMarker, setIsAddingMarker] = useState(false)
  const [selectedCoordinates, setSelectedCoordinates] = useState<[number, number] | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [isEditingMarker, setIsEditingMarker] = useState(false)
  const [selectedPlotForEdit, setSelectedPlotForEdit] = useState<string | null>(null)
  const locateRef = useRef<(() => void) | null>(null)
  const requestLocate = () => {
    if (locateRef.current) locateRef.current()
  }
  const [guide4Data, setGuide4Data] = useState<GeoJSON.GeoJSON | null>(null)
  const bounds = useMemo(
    () =>
      [
        [10.248073279164613, 123.79742173990627],
        [10.249898252065757, 123.79838766292835],
      ] as [[number, number], [number, number]],
    [],
  )
  const resetView = useCallback(() => {
    if (mapInstance) {
      const centerLat = (bounds[0][0] + bounds[1][0]) / 2
      const centerLng = (bounds[0][1] + bounds[1][1]) / 2
      mapInstance.flyTo([centerLat, centerLng], 18)
    }
  }, [mapInstance, bounds])
  const markerRegistryRef = useRef<Record<string, L.Marker | null>>({})
  const registerMarkerRef = useCallback((plotId: string, marker: L.Marker | null) => {
    markerRegistryRef.current[plotId] = marker
    if (marker) {
      marker.on('popupopen', function () {
        console.log('[AdminMapLayout] marker popupopen for plot', plotId)
      })
    }
  }, [])

  const searchLot = useCallback(
    async (lotId: string) => {
      try {
        const result = await searchLotById(lotId)
        if (result.success && result.data) {
          const marker = markers.find((m: ConvertedMarker) => m.plot_id === result.data.plot_id)
          if (marker && mapInstance) {
            mapInstance.flyTo(marker.position, 20)
          }
        }
      } catch (error) {
        console.error('Search error:', error)
      }
    },
    [markers, mapInstance],
  )

  const handleSelectSearchResult = useCallback(
    (item: AdminSearchItem) => {
      console.log('[AdminMapLayout] select result', { item })
      if (isEditingMarker) {
        console.log('[AdminMapLayout] exiting edit mode for popup open')
        setIsEditingMarker(false)
        setSelectedPlotForEdit(null)
        document.body.classList.remove('edit-marker-mode')
      }

      const marker = markers.find((m: ConvertedMarker) => String(m.plot_id) === String(item.plot_id))
      if (!marker) {
        console.log('[AdminMapLayout] marker not found for plot_id', item.plot_id, 'available markers:', markers.length)
        return
      }

      const targetPlotId = String(item.plot_id)
      const targetNiche = item.niche_number ? String(item.niche_number) : null

      const openTargetPopup = () => {
        console.log('[AdminMapLayout] openTargetPopup', { targetPlotId, targetNiche })
        setHighlightedNiche(targetNiche)
        setActiveSearchMarker(marker)
        setAutoOpenPlotId(targetPlotId)
      }

      if (!mapInstance) {
        console.log('[AdminMapLayout] mapInstance not ready yet; opening immediately and skipping flyTo')
        openTargetPopup()
        return
      }

      const desiredZoom = 20
      const currentZoom = mapInstance.getZoom()
      const [lat, lng] = marker.position
      const center = mapInstance.getCenter()
      const isAtPosition = Math.abs(center.lat - lat) < 1e-6 && Math.abs(center.lng - lng) < 1e-6

      if (currentZoom >= desiredZoom && isAtPosition) {
        console.log('[AdminMapLayout] already centered at zoom, opening immediately')
        openTargetPopup()
        return
      }

      let fired = false
      const onMoveEnd = () => {
        if (fired) return
        fired = true
        mapInstance.off('moveend', onMoveEnd)
        console.log('[AdminMapLayout] moveend fired → opening popup')
        openTargetPopup()
      }
      mapInstance.on('moveend', onMoveEnd)
      window.setTimeout(() => {
        if (fired) return
        fired = true
        mapInstance.off('moveend', onMoveEnd)
        console.log('[AdminMapLayout] moveend fallback → opening popup')
        openTargetPopup()
      }, 900)

      console.log('[AdminMapLayout] flyTo', { position: marker.position, desiredZoom })
      mapInstance.flyTo(marker.position, desiredZoom, { animate: true })
    },
    [markers, mapInstance, isEditingMarker],
  )

  useEffect(() => {
    const state = location.state as { focusPlotId?: string; focusNicheNumber?: string | null } | null
    if (!state?.focusPlotId) return

    const matchedMarker = markers.find((marker: ConvertedMarker) => String(marker.plot_id) === String(state.focusPlotId))
    if (!matchedMarker) return

    const parsedPlotId = Number.parseInt(String(state.focusPlotId), 10)
    const markerPlotNumber = Number.parseInt(String(matchedMarker.plot_id), 10)
    const plotIdNumber = Number.isFinite(parsedPlotId) ? parsedPlotId : Number.isFinite(markerPlotNumber) ? markerPlotNumber : 0

    handleSelectSearchResult({
      lot_id: plotIdNumber,
      plot_id: plotIdNumber,
      niche_number: state.focusNicheNumber ?? null,
      customer_id: null,
      customer_fullname: null,
      deceased_ids: null,
      deceased_names: null,
    })

    navigate(location.pathname, { replace: true, state: null })
  }, [handleSelectSearchResult, location.pathname, location.state, markers, navigate])

  useEffect(() => {
    if (!activeSearchMarker || !mapInstance) return
    const desiredZoom = 20
    const [lat, lng] = activeSearchMarker.position
    const center = mapInstance.getCenter()
    const isAtPosition = Math.abs(center.lat - lat) < 1e-6 && Math.abs(center.lng - lng) < 1e-6
    if (!isAtPosition || mapInstance.getZoom() < desiredZoom) {
      console.log('[AdminMapLayout] post-ready flyTo', { position: activeSearchMarker.position, desiredZoom })
      mapInstance.flyTo(activeSearchMarker.position, desiredZoom, { animate: true })
    }
  }, [activeSearchMarker, mapInstance])

  const toggleAddMarker = () => {
    setIsAddingMarker((prev) => {
      const next = !prev
      document.body.classList.toggle('add-marker-mode', next)
      return next
    })
  }

  const toggleEditMarker = () => {
    setIsEditingMarker((prev) => {
      const next = !prev
      if (!next) setSelectedPlotForEdit(null)
      document.body.classList.toggle('edit-marker-mode', next)
      return next
    })
  }

  const onMarkerClickForEdit = (plotId: string) => {
    if (isEditingMarker) {
      setSelectedPlotForEdit(plotId)
    }
  }

  const onEditComplete = useCallback(() => {
    setSelectedPlotForEdit(null)
    setIsEditingMarker(false)
    document.body.classList.remove('edit-marker-mode')
  }, [])

  const onMapClick = (coordinates: [number, number]) => {
    setSelectedCoordinates(coordinates)
    setShowAddDialog(true)
    setIsAddingMarker(false)
    document.body.classList.remove('add-marker-mode')
  }

  const onDialogClose = (open: boolean) => {
    setShowAddDialog(open)
    if (!open) {
      setSelectedCoordinates(null)
    }
  }

  const onAddDone = () => {
    setSelectedCoordinates(null)
    setShowAddDialog(false)
    setIsAddingMarker(true)
    document.body.classList.add('add-marker-mode')
  }

  useEffect(() => {
    return () => {
      document.body.classList.remove('add-marker-mode')
      document.body.classList.remove('edit-marker-mode')
    }
  }, [])

  useHotkeys(
    'escape',
    (e) => {
      e.preventDefault()
      if (showAddDialog) {
        setShowAddDialog(false)
        setSelectedCoordinates(null)
        setIsAddingMarker(false)
        document.body.classList.remove('add-marker-mode')
        return
      }

      if (isAddingMarker) {
        setIsAddingMarker(false)
        setSelectedCoordinates(null)
        document.body.classList.remove('add-marker-mode')
        return
      }

      if (isEditingMarker && selectedPlotForEdit) {
        onEditComplete()
        return
      }

      if (isEditingMarker) {
        setIsEditingMarker(false)
        setSelectedPlotForEdit(null)
        document.body.classList.remove('edit-marker-mode')
        return
      }
    },
    {
      enableOnFormTags: true,
      enableOnContentEditable: true,
    },
    [isAddingMarker, isEditingMarker, showAddDialog, selectedPlotForEdit, onEditComplete],
  )

  // Load local GeoJSON asset at runtime (avoids bundler parsing issues)
  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch(guide4BlockBUrl)
        if (!res.ok) return
        const json = (await res.json()) as GeoJSON.GeoJSON
        if (mounted) setGuide4Data(json)
      } catch {
        // Optional layer load failure ignored (non-critical visual enhancement)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const handlePopupOpen = (plot_id: string) => {
    queryClient.invalidateQueries({
      queryKey: ['plotDetails', plot_id],
    })
  }

  const markersByGroup = useMemo(() => groupMarkersByKey(markers), [markers])
  const labelLookup = useCallback((k: string) => {
    const raw = getLabelFromGroupKey(k)
    return k.startsWith('category:') ? ucwords(String(raw)) : String(raw)
  }, [])
  const createClusterIcon = useMemo(() => createClusterIconFactory(labelLookup), [labelLookup])

  function MapInstanceBinder({ onMapReady }: { onMapReady: (map: L.Map) => void }) {
    const map = useMap()
    useEffect(() => {
      onMapReady(map)
    }, [map, onMapReady])
    return null
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (isError || !plotsData) {
    return <ErrorMessage message="Failed to load map data. Please check your connection and try again." onRetry={refetch} showRetryButton={true} />
  }

  return (
    <div className="mt-4 h-full w-full rounded-lg border p-2">
      <LocateContext.Provider
        value={{
          requestLocate,
          isAddingMarker,
          toggleAddMarker,
          isEditingMarker,
          toggleEditMarker,
        }}
      >
        <div className="relative z-1 h-full w-full">
          <AdminMapNavs searchLot={searchLot} resetView={resetView} onSelectResult={handleSelectSearchResult} />
          <MapStats />
          <AddMarkerInstructions isVisible={isAddingMarker} />
          <EditMarkerInstructions isVisible={isEditingMarker} step={selectedPlotForEdit ? 'edit' : 'select'} />
          <MapContainer className="h-full w-full rounded-lg" zoomControl={false} bounds={bounds} maxZoom={25} zoom={18}>
            {activeSearchMarker && (
              <Popup
                className="leaflet-theme-popup"
                closeButton={false}
                offset={[2, 3]}
                minWidth={activeSearchMarker.rows && activeSearchMarker.columns ? 450 : 600}
                maxWidth={activeSearchMarker.rows && activeSearchMarker.columns ? 450 : 600}
                position={activeSearchMarker.position}
                key={`${activeSearchMarker.plot_id}-${highlightedNiche ?? ''}`}
                eventHandlers={{
                  add: () => handlePopupOpen(activeSearchMarker.plot_id),
                  remove: () => {
                    setActiveSearchMarker(null)
                    setHighlightedNiche(null)
                    setAutoOpenPlotId(null)
                  },
                }}
              >
                <div className="w-full py-2">
                  {activeSearchMarker.rows && activeSearchMarker.columns ? (
                    <ColumbariumPopup marker={activeSearchMarker} highlightedNiche={highlightedNiche ?? undefined} />
                  ) : (
                    <SinglePlotLocations backgroundColor={getCategoryBackgroundColor(activeSearchMarker.category)} marker={activeSearchMarker} />
                  )}
                </div>
              </Popup>
            )}
            <TileLayer
              url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxNativeZoom={18}
              maxZoom={25}
              minZoom={15}
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

            <MapInstanceBinder onMapReady={setMapInstance} />

            {/* GeoJSON overlay for test accounts */}
            {showGuide4 && guide4Data && (
              <GeoJSON
                interactive={false}
                data={guide4Data}
                style={() => ({
                  color: '#FFDE21',
                  weight: 1,
                  opacity: 1,
                })}
                onEachFeature={(feature, layer) => {
                  const id = (feature.properties as { id?: string | number | null } | undefined)?.id ?? 'Guide Path'
                  layer.bindTooltip(String(id), {
                    sticky: true,
                  })
                }}
              />
            )}

            <MapClickHandler isAddingMarker={isAddingMarker} onMapClick={onMapClick} />
            <MainEntranceMarkers />
            <ChapelMarkers />
            <PlaygroundMarkers />
            <ParkingMarkers />
            <CenterSerenityMarkers />
            <ComfortRoomMarker />
            <PeterRockMarkers />
            {Object.entries(markersByGroup).map(([groupKey, groupMarkers]) => {
              if (isEditingMarker || isAddingMarker) {
                return (
                  <div key={`cluster-${groupKey}`}>
                    {groupMarkers.map((marker: ConvertedMarker) => {
                      const statusColor = getStatusColor(marker.plotStatus)
                      const circleIcon = buildStatusCircleIcon(statusColor)
                      const backgroundColor = getCategoryBackgroundColor(marker.category)
                      return (
                        <EditableMarker
                          key={`plot-${marker.plot_id}`}
                          plotId={marker.plot_id}
                          position={marker.position}
                          icon={circleIcon}
                          isEditable={isEditingMarker}
                          isSelected={selectedPlotForEdit === marker.plot_id}
                          onMarkerClick={onMarkerClickForEdit}
                          onEditComplete={onEditComplete}
                          onSaveSuccess={() => setSelectedPlotForEdit(null)}
                          onPopupOpen={() => handlePopupOpen(marker.plot_id)}
                          autoOpenPlotId={autoOpenPlotId}
                          registerMarkerRef={registerMarkerRef}
                          onPopupClose={() => {
                            if (autoOpenPlotId === marker.plot_id) {
                              setAutoOpenPlotId(null)
                              setHighlightedNiche(null)
                            }
                          }}
                        >
                          {renderPopupContent(marker, backgroundColor, autoOpenPlotId === marker.plot_id ? highlightedNiche : null)}
                        </EditableMarker>
                      )
                    })}
                  </div>
                )
              }

              return (
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
                  {groupMarkers.map((marker: ConvertedMarker) => {
                    const statusColor = getStatusColor(marker.plotStatus)
                    const circleIcon = buildStatusCircleIcon(statusColor)
                    const backgroundColor = getCategoryBackgroundColor(marker.category)
                    return (
                      <EditableMarker
                        key={`plot-${marker.plot_id}`}
                        plotId={marker.plot_id}
                        position={marker.position}
                        icon={circleIcon}
                        isEditable={isEditingMarker}
                        isSelected={selectedPlotForEdit === marker.plot_id}
                        onMarkerClick={onMarkerClickForEdit}
                        onEditComplete={onEditComplete}
                        onSaveSuccess={() => setSelectedPlotForEdit(null)}
                        onPopupOpen={() => handlePopupOpen(marker.plot_id)}
                        autoOpenPlotId={autoOpenPlotId}
                        registerMarkerRef={registerMarkerRef}
                        onPopupClose={() => {
                          if (autoOpenPlotId === marker.plot_id) {
                            setAutoOpenPlotId(null)
                            setHighlightedNiche(null)
                          }
                        }}
                      >
                        {renderPopupContent(marker, backgroundColor, autoOpenPlotId === marker.plot_id ? highlightedNiche : null)}
                      </EditableMarker>
                    )
                  })}
                </MarkerClusterGroup>
              )
            })}
          </MapContainer>
        </div>
        <AddPlotMarkerDialog open={showAddDialog} onOpenChange={onDialogClose} coordinates={selectedCoordinates} onDoneAdd={onAddDone} />
      </LocateContext.Provider>
    </div>
  )
}
