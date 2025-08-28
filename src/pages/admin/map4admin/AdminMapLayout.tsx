import { useQueryClient } from '@tanstack/react-query'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, TileLayer, Popup, GeoJSON } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'

import type { ConvertedMarker } from '@/types/map.types'

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
import { groupMarkersByKey, getLabelFromGroupKey, createClusterIconFactory } from '@/lib/clusterUtils'
import { ucwords } from '@/lib/format'
import ColumbariumPopup from '@/pages/admin/map4admin/ColumbariumPopup'
import MapStats from '@/pages/admin/map4admin/MapStats'
import SinglePlotLocations from '@/pages/admin/map4admin/SinglePlotPopup'
import CenterSerenityMarkers from '@/pages/webmap/CenterSerenityMarkers'
import ChapelMarkers from '@/pages/webmap/ChapelMarkers'
import ComfortRoomMarker from '@/pages/webmap/ComfortRoomMarkers'
import MainEntranceMarkers from '@/pages/webmap/MainEntranceMarkers'
import ParkingMarkers from '@/pages/webmap/ParkingMarkers'
import PlaygroundMarkers from '@/pages/webmap/PlaygroundMarkers'
import WebMapNavs from '@/pages/webmap/WebMapNavs'
import { getCategoryBackgroundColor, convertPlotToMarker, getStatusColor } from '@/types/map.types'

import { LocateContext } from './LocateContext'

// 💡 Set a default Leaflet marker icon globally (Leaflet otherwise requires manual asset wiring)
const DefaultIcon = L.icon({ iconUrl, shadowUrl, iconRetinaUrl })
// 💡 Leaflet prototype mutation (safe in app init scope) to apply default marker icon globally.
;(L.Marker.prototype as unknown as { options: { icon: L.Icon } }).options.icon = DefaultIcon

// 🛠 Helper: build tiny colored status dot icon (kept outside component to avoid re-creation)
function buildStatusCircleIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `<div style="width:15px;height:15px;border-radius:50%;background:${color};border:1px solid #fff;box-shadow:0 0 4px rgba(0,0,0,0.15);"></div>`,
  })
}

// 🛠 Helper: popup content chooser (columbarium vs single plot)
function renderPopupContent(marker: ConvertedMarker, backgroundColor: string, popupCloseTick: number) {
  const isColumbarium = !!(marker.rows && marker.columns)
  if (isColumbarium) {
    return (
      <Popup className="leaflet-theme-popup" closeButton={false} offset={[2, 10]} minWidth={450}>
        <div className="w-full py-2">
          <ColumbariumPopup marker={marker} />
        </div>
      </Popup>
    )
  }
  return (
    <Popup className="leaflet-theme-popup" closeButton={false} offset={[2, 10]} minWidth={600} maxWidth={600}>
      <SinglePlotLocations backgroundColor={backgroundColor} marker={marker} popupCloseTick={popupCloseTick} />
    </Popup>
  )
}

export default function AdminMapLayout() {
  const { data: authData } = useAuthQuery()
  // 💡 Simplify redundant condition – previous OR duplicated the same username string.
  const showGuide4 = Boolean(authData?.user?.isAdmin && authData?.user?.username === 'test')
  const { isError, refetch, isLoading, data: plotsData } = usePlots()
  const queryClient = useQueryClient()

  // ⚡️ Memoize expensive conversion to avoid re-creating marker objects every render when unchanged
  const markers = useMemo(() => (plotsData ? plotsData.map(convertPlotToMarker) : []), [plotsData])

  const [guide4Data, setGuide4Data] = useState<GeoJSON.GeoJSON | null>(null)
  const bounds: [[number, number], [number, number]] = [
    [10.248073279164613, 123.79742173990627],
    [10.249898252065757, 123.79838766292835],
  ]
  const [isAddingMarker, setIsAddingMarker] = useState(false)
  const [selectedCoordinates, setSelectedCoordinates] = useState<[number, number] | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [isEditingMarker, setIsEditingMarker] = useState(false)
  const [selectedPlotForEdit, setSelectedPlotForEdit] = useState<string | null>(null)
  const locateRef = useRef<(() => void) | null>(null)
  const requestLocate = () => {
    if (locateRef.current) locateRef.current()
  }

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

  // ✅ Handle edit completion (save or cancel)
  const onEditComplete = useCallback(() => {
    setSelectedPlotForEdit(null)
    setIsEditingMarker(false)
    document.body.classList.remove('edit-marker-mode')
  }, [])

  // 📍 Handle map click when adding marker
  const onMapClick = (coordinates: [number, number]) => {
    setSelectedCoordinates(coordinates)
    setShowAddDialog(true)
    // Pause add mode while dialog is open to prevent accidental clicks
    setIsAddingMarker(false)
    document.body.classList.remove('add-marker-mode')
  }

  // 🚫 Handle dialog close
  const onDialogClose = (open: boolean) => {
    setShowAddDialog(open)
    if (!open) {
      setSelectedCoordinates(null)
    }
  }

  // ✅ After a successful add, immediately return to add mode for rapid entry
  const onAddDone = () => {
    setSelectedCoordinates(null)
    setShowAddDialog(false)
    setIsAddingMarker(true)
    document.body.classList.add('add-marker-mode')
  }

  // 🧹 Cleanup effect to remove cursor class on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('add-marker-mode')
      document.body.classList.remove('edit-marker-mode')
    }
  }, [])

  // ⎋ Unified Escape handler: cancel add/edit flows and close dialog reliably
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      e.preventDefault()

      // If add dialog is open, close it and reset coordinates
      if (showAddDialog) {
        setShowAddDialog(false)
        setSelectedCoordinates(null)
        setIsAddingMarker(false)
        document.body.classList.remove('add-marker-mode')
        return
      }

      // If currently in add-marker mode (and dialog not open), cancel it
      if (isAddingMarker) {
        setIsAddingMarker(false)
        setSelectedCoordinates(null)
        document.body.classList.remove('add-marker-mode')
        return
      }

      // If editing and a specific plot is selected, cancel that edit
      if (isEditingMarker && selectedPlotForEdit) {
        onEditComplete()
        return
      }

      // If editing mode is active but no plot selected, exit editing mode
      if (isEditingMarker) {
        setIsEditingMarker(false)
        setSelectedPlotForEdit(null)
        document.body.classList.remove('edit-marker-mode')
        return
      }
    }

    // Attach listener only when relevant states are active to avoid global interception
    if (!(isAddingMarker || isEditingMarker || showAddDialog || selectedPlotForEdit)) return

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isAddingMarker, isEditingMarker, showAddDialog, selectedPlotForEdit, onEditComplete])

  // 📦 Load local GeoJSON asset at runtime (avoids bundler parsing issues)
  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch(guide4BlockBUrl)
        if (!res.ok) return
        const json = (await res.json()) as GeoJSON.GeoJSON
        if (mounted) setGuide4Data(json)
      } catch {
        // 🧯 Optional layer load failure ignored (non-critical visual enhancement)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  // Track popup close events to reset child UI (like comboboxes)
  const [popupCloseTick, setPopupCloseTick] = useState(0)
  // Function to handle popup opening - invalidate cache for fresh data
  const handlePopupOpen = (plot_id: string) => {
    // Invalidate the specific plot details cache when popup opens
    queryClient.invalidateQueries({
      queryKey: ['plotDetails', plot_id],
    })
  }

  // ⚡️ Derived grouping + cluster icon factory (stable references reduce re-renders inside leaflet layer trees)
  const markersByGroup = useMemo(() => groupMarkersByKey(markers), [markers])
  const labelLookup = useCallback((k: string) => {
    const raw = getLabelFromGroupKey(k)
    return k.startsWith('category:') ? ucwords(String(raw)) : String(raw)
  }, [])
  const createClusterIcon = useMemo(() => createClusterIconFactory(labelLookup), [labelLookup])

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
          <WebMapNavs />
          <MapStats />
          {/* 🎯 Instructions for add marker mode */}
          <AddMarkerInstructions isVisible={isAddingMarker} />
          {/* ✏️ Instructions for edit marker mode */}
          <EditMarkerInstructions isVisible={isEditingMarker} step={selectedPlotForEdit ? 'edit' : 'select'} />
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
            <TileLayer
              url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxNativeZoom={18}
              maxZoom={25}
              updateWhenIdle={true}
              updateWhenZooming={false}
              keepBuffer={12}
              detectRetina={false}
            />

            {/* GeoJSON overlay: Guide 4 Block C */}
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

            {/* 🎯 Map click handler for adding markers */}
            <MapClickHandler isAddingMarker={isAddingMarker} onMapClick={onMapClick} />
            <MainEntranceMarkers />
            <ChapelMarkers />
            <PlaygroundMarkers />
            <ParkingMarkers />
            <CenterSerenityMarkers />
            <ComfortRoomMarker />
            {/* Plot Markers grouped into clusters by block or category */}
            {Object.entries(markersByGroup).map(([groupKey, groupMarkers]) => {
              // When editing markers or adding a new marker, disable clustering so markers are individually clickable/draggable
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
                          onPopupClose={() => setPopupCloseTick((t) => t + 1)}
                        >
                          {renderPopupContent(marker, backgroundColor, popupCloseTick)}
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
                        onPopupClose={() => setPopupCloseTick((t) => t + 1)}
                      >
                        {renderPopupContent(marker, backgroundColor, popupCloseTick)}
                      </EditableMarker>
                    )
                  })}
                </MarkerClusterGroup>
              )
            })}
          </MapContainer>
        </div>
        {/* 📝 Add Plot Dialog */}
        <AddPlotMarkerDialog open={showAddDialog} onOpenChange={onDialogClose} coordinates={selectedCoordinates} onDoneAdd={onAddDone} />
      </LocateContext.Provider>
    </div>
  )
}
