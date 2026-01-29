import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'

import type { ConvertedMarker } from '@/types/map.types'
import type { AdminSearchItem } from '@/types/search.types'
import L from 'leaflet'

import 'leaflet-draw'

import { useHotkeys } from 'react-hotkeys-hook'
import { GeoJSON, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { searchLotById } from '@/api/plots.api'
import { ErrorMessage } from '@/components/ErrorMessage'
import AddMarkerInstructions from '@/components/map/AddMarkerInstructions'
import AddPlotMarkerDialog from '@/components/map/AddPlotMarkerDialog'
import BulkEditableMarkers, { getMarkersInPolygon } from '@/components/map/BulkEditableMarkers'
import EditableMarker from '@/components/map/EditableMarker'
import EditMarkerInstructions from '@/components/map/EditMarkerInstructions'
import MapClickHandler from '@/components/map/MapClickHandler'
import {
  CenterSerenityMarkers,
  ChapelMarkers,
  ComfortRoomMarker,
  MainEntranceMarkers,
  ParkingMarkers,
  PetersRockMarkers,
  PlaygroundMarkers,
} from '@/components/map/markers'
import MultiEditMarkerInstructions from '@/components/map/MultiEditMarkerInstructions'
import PolygonDrawControl from '@/components/map/PolygonDrawControl'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Spinner from '@/components/ui/spinner'
import blockBAreaUrl from '@/data/geojson/block_b_area.geojson?url'
import blockCAreaUrl from '@/data/geojson/block_c_area.geojson?url'
import blockDAreaUrl from '@/data/geojson/block_d_area.geojson?url'
import guide4BlockBUrl from '@/data/geojson/guide4block_B.geojson?url'
import guide4BlockCUrl from '@/data/geojson/guide4block_C.geojson?url'
import guide4BlockDUrl from '@/data/geojson/guide4block_D.geojson?url'
import { usePlots } from '@/hooks/plots-hooks/plot.hooks'
import { useAuthQuery } from '@/hooks/useAuthQuery'
import { createClusterIconFactory, getLabelFromGroupKey, groupMarkersByKey } from '@/lib/clusterUtils'
import { ucwords } from '@/lib/format'
import ColumbariumPopup from '@/pages/admin/map4admin/ColumbariumPopup'
import MapStats from '@/pages/admin/map4admin/MapStats'
import SinglePlotPopup from '@/pages/admin/map4admin/SinglePlotPopup'
import { convertPlotToMarker, getCategoryColors, getStatusColor } from '@/types/map.types'
import AdminMapNavs from './AdminMapNavs'
import { LocateContext } from './LocateContext'

function createStatusCircleIcon(backgroundColor: string, borderColor: string) {
  return L.divIcon({
    className: '',
    html: `<div style="width:20px;height:15px;border-radius:8%;background:${backgroundColor};border:2px solid ${borderColor};box-shadow:0 0 4px rgba(0,0,0,0.15);transform: rotate(-20deg);"></div>`,
  })
}

function renderPopupContent(marker: ConvertedMarker, highlightedNiche?: string | null) {
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
      <SinglePlotPopup marker={marker} />
    </Popup>
  )
}

export default function AdminMapPage() {
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
  const [isMultiEditSelecting, setIsMultiEditSelecting] = useState(false)
  const [selectedPlotIds, setSelectedPlotIds] = useState<Set<string>>(new Set())
  const locationTrackingRef = useRef<(() => void) | null>(null)
  const requestLocate = () => {
    if (locationTrackingRef.current) locationTrackingRef.current()
  }
  const [blockBGuideGeoJson, setBlockBGuideGeoJson] = useState<GeoJSON.GeoJSON | null>(null)
  const [blockCGuideGeoJson, setBlockCGuideGeoJson] = useState<GeoJSON.GeoJSON | null>(null)
  const [blockDGuideGeoJson, setBlockDGuideGeoJson] = useState<GeoJSON.GeoJSON | null>(null)
  const [blockBAreaGeoJson, setBlockBAreaGeoJson] = useState<GeoJSON.GeoJSON | null>(null)
  const [blockCAreaGeoJson, setBlockCAreaGeoJson] = useState<GeoJSON.GeoJSON | null>(null)
  const [blockDAreaGeoJson, setBlockDAreaGeoJson] = useState<GeoJSON.GeoJSON | null>(null)
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
        console.log('[AdminMapPage] marker popupopen for plot', plotId)
      })
    }
  }, [])

  const mapVersions = useMemo(
    () => [
      { id: '2025-10-23', label: 'October 23, 2025', value: '20512' },
      { id: '2024-12-12', label: 'December 12, 2024', value: '58924' },
      { id: '2023-12-12', label: 'December 12, 2023', value: '56102' },
      { id: '2023-05-03', label: 'May 03, 2023', value: '12457' },
    ],
    [],
  )
  const [selectedMapVersion, setSelectedMapVersion] = useState('20512')

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
      console.log('[AdminMapPage] select result', { item })
      if (isEditingMarker) {
        console.log('[AdminMapPage] exiting edit mode for popup open')
        setIsEditingMarker(false)
        setSelectedPlotForEdit(null)
        document.body.classList.remove('edit-marker-mode')
      }

      const marker = markers.find((m: ConvertedMarker) => String(m.plot_id) === String(item.plot_id))
      if (!marker) {
        console.log('[AdminMapPage] marker not found for plot_id', item.plot_id, 'available markers:', markers.length)
        return
      }

      const searchResultPlotId = String(item.plot_id)
      const searchResultNiche = item.niche_number ? String(item.niche_number) : null

      const openSearchResultPopup = () => {
        console.log('[AdminMapPage] openSearchResultPopup', { searchResultPlotId, searchResultNiche })
        setHighlightedNiche(searchResultNiche)
        setActiveSearchMarker(marker)
        setAutoOpenPlotId(searchResultPlotId)
      }

      if (!mapInstance) {
        console.log('[AdminMapPage] mapInstance not ready yet; opening immediately and skipping flyTo')
        openSearchResultPopup()
        return
      }

      const desiredZoom = 20
      const currentZoom = mapInstance.getZoom()
      const [lat, lng] = marker.position
      const center = mapInstance.getCenter()
      const isAtPosition = Math.abs(center.lat - lat) < 1e-6 && Math.abs(center.lng - lng) < 1e-6

      if (currentZoom >= desiredZoom && isAtPosition) {
        console.log('[AdminMapPage] already centered at zoom, opening immediately')
        openSearchResultPopup()
        return
      }

      let hasMoveEndFired = false
      const onMoveEnd = () => {
        if (hasMoveEndFired) return
        hasMoveEndFired = true
        mapInstance.off('moveend', onMoveEnd)
        console.log('[AdminMapPage] moveend fired → opening popup')
        openSearchResultPopup()
      }
      mapInstance.on('moveend', onMoveEnd)
      window.setTimeout(() => {
        if (hasMoveEndFired) return
        hasMoveEndFired = true
        mapInstance.off('moveend', onMoveEnd)
        console.log('[AdminMapPage] moveend fallback → opening popup')
        openSearchResultPopup()
      }, 900)

      console.log('[AdminMapPage] flyTo', { position: marker.position, desiredZoom })
      mapInstance.flyTo(marker.position, desiredZoom, { animate: true })
    },
    [markers, mapInstance, isEditingMarker],
  )

  useEffect(() => {
    const state = location.state as { focusPlotId?: string; focusNicheNumber?: string | null } | null
    if (!state?.focusPlotId) return

    const matchedMarker = markers.find((marker: ConvertedMarker) => String(marker.plot_id) === String(state.focusPlotId))
    if (!matchedMarker) return

    const parsedFocusPlotId = Number.parseInt(String(state.focusPlotId), 10)
    const parsedMarkerPlotId = Number.parseInt(String(matchedMarker.plot_id), 10)
    const normalizedPlotId = Number.isFinite(parsedFocusPlotId) ? parsedFocusPlotId : Number.isFinite(parsedMarkerPlotId) ? parsedMarkerPlotId : 0

    handleSelectSearchResult({
      lot_id: normalizedPlotId,
      plot_id: normalizedPlotId,
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
      console.log('[AdminMapPage] post-ready flyTo', { position: activeSearchMarker.position, desiredZoom })
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

  const toggleMultiEditSelect = () => {
    setIsMultiEditSelecting((prev) => {
      const next = !prev
      if (!next) {
        setSelectedPlotIds(new Set())
      }
      document.body.classList.toggle('multi-edit-mode', next)
      return next
    })
  }

  const handlePolygonComplete = useCallback(
    (latLngs: L.LatLng[]) => {
      const selectedIds = getMarkersInPolygon(markers, latLngs)

      if (selectedIds.length === 0) {
        toast.info('No markers found in selection area')
        return
      }

      setSelectedPlotIds(new Set(selectedIds))
      toast.success(`Selected ${selectedIds.length} marker${selectedIds.length !== 1 ? 's' : ''}`)
    },
    [markers],
  )

  const handleBulkEditComplete = useCallback(() => {
    setSelectedPlotIds(new Set())
    setIsMultiEditSelecting(false)
    document.body.classList.remove('multi-edit-mode')
  }, [])

  const handleMarkerClickForEdit = (plotId: string) => {
    if (isEditingMarker) {
      setSelectedPlotForEdit(plotId)
    }
  }

  const handleEditComplete = useCallback(() => {
    setSelectedPlotForEdit(null)
    setIsEditingMarker(false)
    document.body.classList.remove('edit-marker-mode')
  }, [])

  const handleMapClick = (coordinates: [number, number]) => {
    setSelectedCoordinates(coordinates)
    setShowAddDialog(true)
    setIsAddingMarker(false)
    document.body.classList.remove('add-marker-mode')
  }

  const handleDialogClose = (open: boolean) => {
    setShowAddDialog(open)
    if (!open) {
      setSelectedCoordinates(null)
    }
  }

  const handleAddDone = () => {
    setSelectedCoordinates(null)
    setShowAddDialog(false)
    setIsAddingMarker(true)
    document.body.classList.add('add-marker-mode')
  }

  useEffect(() => {
    return () => {
      document.body.classList.remove('add-marker-mode')
      document.body.classList.remove('edit-marker-mode')
      document.body.classList.remove('multi-edit-mode')
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

      if (isMultiEditSelecting) {
        setIsMultiEditSelecting(false)
        setSelectedPlotIds(new Set())
        document.body.classList.remove('multi-edit-mode')
        return
      }

      if (isEditingMarker && selectedPlotForEdit) {
        handleEditComplete()
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
    [isAddingMarker, isEditingMarker, isMultiEditSelecting, showAddDialog, selectedPlotForEdit, handleEditComplete],
  )

  // Load local GeoJSON assets at runtime (avoids bundler parsing issues)
  useEffect(() => {
    let isMounted = true
    async function loadGuideGeoJson() {
      // Load guide GeoJSON files (only for test account)
      if (showGuide4) {
        try {
          // Load Block B Guide
          const responseB = await fetch(guide4BlockBUrl)
          if (responseB.ok) {
            const geoJsonDataB = (await responseB.json()) as GeoJSON.GeoJSON
            if (isMounted) setBlockBGuideGeoJson(geoJsonDataB)
          }
        } catch {
          // Optional layer load failure ignored (non-critical visual enhancement)
        }

        try {
          // Load Block C Guide
          const responseC = await fetch(guide4BlockCUrl)
          if (responseC.ok) {
            const geoJsonDataC = (await responseC.json()) as GeoJSON.GeoJSON
            if (isMounted) setBlockCGuideGeoJson(geoJsonDataC)
          }
        } catch {
          // Optional layer load failure ignored (non-critical visual enhancement)
        }

        try {
          // Load Block D Guide
          const responseD = await fetch(guide4BlockDUrl)
          if (responseD.ok) {
            const geoJsonDataD = (await responseD.json()) as GeoJSON.GeoJSON
            if (isMounted) setBlockDGuideGeoJson(geoJsonDataD)
          }
        } catch {
          // Optional layer load failure ignored (non-critical visual enhancement)
        }
      }

      // Load area GeoJSON files (for all users)
      try {
        // Load Block B Area
        const responseBArea = await fetch(blockBAreaUrl)
        if (responseBArea.ok) {
          const geoJsonDataBArea = (await responseBArea.json()) as GeoJSON.GeoJSON
          if (isMounted) setBlockBAreaGeoJson(geoJsonDataBArea)
        }
      } catch {
        // Optional layer load failure ignored (non-critical visual enhancement)
      }

      try {
        // Load Block C Area
        const responseCArea = await fetch(blockCAreaUrl)
        if (responseCArea.ok) {
          const geoJsonDataCArea = (await responseCArea.json()) as GeoJSON.GeoJSON
          if (isMounted) setBlockCAreaGeoJson(geoJsonDataCArea)
        }
      } catch {
        // Optional layer load failure ignored (non-critical visual enhancement)
      }

      try {
        // Load Block D Area
        const responseDArea = await fetch(blockDAreaUrl)
        if (responseDArea.ok) {
          const geoJsonDataDArea = (await responseDArea.json()) as GeoJSON.GeoJSON
          if (isMounted) setBlockDAreaGeoJson(geoJsonDataDArea)
        }
      } catch {
        // Optional layer load failure ignored (non-critical visual enhancement)
      }
    }
    loadGuideGeoJson()
    return () => {
      isMounted = false
    }
  }, [showGuide4])

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
          isMultiEditSelecting,
          toggleMultiEditSelect,
        }}
      >
        <div className="relative z-1 h-full w-full">
          <AdminMapNavs searchLot={searchLot} resetView={resetView} onSelectResult={handleSelectSearchResult} />
          <MapStats />
          <MultiEditMarkerInstructions
            isVisible={isMultiEditSelecting}
            step={selectedPlotIds.size === 0 ? 'draw' : 'selected'}
            selectedCount={selectedPlotIds.size}
          />
          <AddMarkerInstructions isVisible={isAddingMarker} />
          <EditMarkerInstructions isVisible={isEditingMarker} step={selectedPlotForEdit ? 'edit' : 'select'} />
          <div className="absolute bottom-4 left-4 z-999 bg-card backdrop-blur-sm rounded-lg p-2 shadow-lg border">
            <div className="flex items-center gap-2">
              <span className="text-sm font-mediumd">Map Version:</span>
              <Select value={selectedMapVersion} onValueChange={setSelectedMapVersion}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mapVersions.map((version) => (
                    <SelectItem key={version.id} value={version.value}>
                      {version.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
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
                    <SinglePlotPopup marker={activeSearchMarker} />
                  )}
                </div>
              </Popup>
            )}
            <TileLayer
              key={selectedMapVersion}
              url={`https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/${selectedMapVersion}/{z}/{y}/{x}`}
              maxNativeZoom={18}
              maxZoom={25}
              detectRetina={true}
            />

            <MapInstanceBinder onMapReady={setMapInstance} />

            {/* GeoJSON overlay for test accounts */}
            {showGuide4 && blockBGuideGeoJson && (
              <GeoJSON
                interactive={false}
                data={blockBGuideGeoJson}
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
            {showGuide4 && blockCGuideGeoJson && (
              <GeoJSON
                interactive={false}
                data={blockCGuideGeoJson}
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
            {showGuide4 && blockDGuideGeoJson && (
              <GeoJSON
                interactive={false}
                data={blockDGuideGeoJson}
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

            {blockBAreaGeoJson && (
              <GeoJSON
                interactive={false}
                data={blockBAreaGeoJson}
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

            {blockCAreaGeoJson && (
              <GeoJSON
                interactive={false}
                data={blockCAreaGeoJson}
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

            {blockDAreaGeoJson && (
              <GeoJSON
                interactive={false}
                data={blockDAreaGeoJson}
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

            <MapClickHandler isAddingMarker={isAddingMarker} onMapClick={handleMapClick} />
            <PolygonDrawControl isActive={isMultiEditSelecting && selectedPlotIds.size === 0} onPolygonComplete={handlePolygonComplete} />
            {isMultiEditSelecting && selectedPlotIds.size > 0 && (
              <BulkEditableMarkers
                markers={markers}
                selectedPlotIds={selectedPlotIds}
                onSelectionComplete={handleBulkEditComplete}
                markerRegistryRef={markerRegistryRef}
              />
            )}
            <MainEntranceMarkers />
            <ChapelMarkers />
            <PlaygroundMarkers />
            <ParkingMarkers />
            <CenterSerenityMarkers />
            <ComfortRoomMarker />
            <PetersRockMarkers />
            {Object.entries(markersByGroup).map(([groupKey, groupMarkers]) => {
              if (isEditingMarker || isAddingMarker || isMultiEditSelecting) {
                return (
                  <div key={`cluster-${groupKey}`}>
                    {groupMarkers.map((marker: ConvertedMarker) => {
                      const categoryColors = getCategoryColors(marker.category)
                      const statusColor = getStatusColor(marker.plotStatus)
                      const circleIcon = createStatusCircleIcon(categoryColors.background, statusColor)
                      const isInBulkSelection = isMultiEditSelecting && selectedPlotIds.has(marker.plot_id)
                      return (
                        <EditableMarker
                          key={`plot-${marker.plot_id}`}
                          plotId={marker.plot_id}
                          position={marker.position}
                          icon={circleIcon}
                          isEditable={isEditingMarker}
                          isSelected={selectedPlotForEdit === marker.plot_id}
                          isBulkEditing={isMultiEditSelecting}
                          onMarkerClick={handleMarkerClickForEdit}
                          onEditComplete={handleEditComplete}
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
                          {!isInBulkSelection && renderPopupContent(marker, autoOpenPlotId === marker.plot_id ? highlightedNiche : null)}
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
                    const categoryColors = getCategoryColors(marker.category)
                    const statusColor = getStatusColor(marker.plotStatus)
                    const circleIcon = createStatusCircleIcon(categoryColors.background, statusColor)
                    return (
                      <EditableMarker
                        key={`plot-${marker.plot_id}`}
                        plotId={marker.plot_id}
                        position={marker.position}
                        icon={circleIcon}
                        isEditable={isEditingMarker}
                        isSelected={selectedPlotForEdit === marker.plot_id}
                        onMarkerClick={handleMarkerClickForEdit}
                        onEditComplete={handleEditComplete}
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
                        {renderPopupContent(marker, autoOpenPlotId === marker.plot_id ? highlightedNiche : null)}
                      </EditableMarker>
                    )
                  })}
                </MarkerClusterGroup>
              )
            })}
          </MapContainer>
        </div>
        <AddPlotMarkerDialog open={showAddDialog} onOpenChange={handleDialogClose} coordinates={selectedCoordinates} onDoneAdd={handleAddDone} />
      </LocateContext.Provider>
    </div>
  )
}
