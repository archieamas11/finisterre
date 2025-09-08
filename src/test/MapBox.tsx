import { useState, useMemo, useRef } from 'react'
import Map, { FullscreenControl, NavigationControl, GeolocateControl, Marker, Popup, type MapRef } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'

import { Button } from '@/components/ui/button'
import { usePlots } from '@/hooks/plots-hooks/plot.hooks'
import { convertPlotToMarker, type ConvertedMarker, type plots } from '@/types/map.types'

import arcgisSatelliteStyle from './ArcGisTileLayer'
import Pin from './Pin'

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

function MapBox() {
  const INITIAL_VIEW_STATE = {
    longitude: 123.79779924469761,
    latitude: 10.249290885383175,
    zoom: 18,
  }
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE)
  const [popupInfo, setPopupInfo] = useState<ConvertedMarker | null>(null)
  const mapRef = useRef<MapRef>(null)

  // Fetch plots from API
  const { data: plotsData, isLoading, isError } = usePlots()

  // Convert API plots to map markers
  type ApiPlot = Parameters<typeof convertPlotToMarker>[0]
  const markers: ConvertedMarker[] = useMemo(() => {
    if (!plotsData || plotsData.length === 0) return []
    return plotsData.map((p: plots) => convertPlotToMarker(p as unknown as ApiPlot))
  }, [plotsData])

  const resetMap = () => {
    mapRef.current?.flyTo({
      center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
      zoom: INITIAL_VIEW_STATE.zoom,
    })
  }
  const pins = useMemo(
    () =>
      markers.map((plot, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={plot.position[1]}
          latitude={plot.position[0]}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation()
            setPopupInfo(plot)
          }}
        >
          <Pin status={plot.plotStatus} />
        </Marker>
      )),
    [markers],
  )
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        initialViewState={INITIAL_VIEW_STATE}
        style={{ width: '100%', height: '100%' }}
        mapStyle={arcgisSatelliteStyle}
        maxZoom={20}
        minZoom={6}
      >
        <NavigationControl />
        <FullscreenControl />
        <GeolocateControl />

        {!isLoading && !isError && pins}
        {popupInfo && (
          <Popup anchor="top" longitude={popupInfo.position[1]} latitude={popupInfo.position[0]} onClose={() => setPopupInfo(null)}>
            <div>
              <h3>{popupInfo.location}</h3>
              <p>Category: {popupInfo.category}</p>
              <p>Status: {popupInfo.plotStatus}</p>
              {popupInfo.deceased.dead_fullname && <p>Deceased: {popupInfo.deceased.dead_fullname}</p>}
              {popupInfo.deceased.dead_interment && <p>Interment: {popupInfo.deceased.dead_interment}</p>}
              {popupInfo.owner.fullname && <p>Owner: {popupInfo.owner.fullname}</p>}
              {popupInfo.owner.email && <p>Email: {popupInfo.owner.email}</p>}
              {popupInfo.owner.contact && <p>Contact: {popupInfo.owner.contact}</p>}
              <p>
                Dimensions: {popupInfo.dimensions.length} x {popupInfo.dimensions.width} ({popupInfo.dimensions.area} sqm)
              </p>
              <p>
                Block: {popupInfo.block}, Plot: {popupInfo.plot_id}
              </p>
              {popupInfo.rows && <p>Row: {popupInfo.rows}</p>}
              {popupInfo.columns && <p>Column: {popupInfo.columns}</p>}
            </div>
          </Popup>
        )}
      </Map>
      <Button onClick={resetMap} style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
        Reset View
      </Button>
    </div>
  )
}

export default MapBox
