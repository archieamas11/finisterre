import { useState, useMemo, useRef } from 'react'
import Map, { FullscreenControl, NavigationControl, GeolocateControl, type MapRef, Source, Layer } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'

import { Button } from '@/components/ui/button'
import { usePlots } from '@/hooks/plots-hooks/plot.hooks'

import arcgisSatelliteStyle from './ArcGisTileLayer'
import { plotsToGeoJSON, type PlotFeatureProps } from './buildGeoJSON'
import { PlotPopup } from './PlotPopup'
import { plotsCircleLayer } from './plotsCircleLayer'

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

function MapBox() {
  const INITIAL_VIEW_STATE = {
    longitude: 123.79779924469761,
    latitude: 10.249290885383175,
    zoom: 18,
  }
  const [popup, setPopup] = useState<{ coords: [number, number]; props: PlotFeatureProps } | null>(null)
  const mapRef = useRef<MapRef>(null)
  const { data: plotsData, isLoading, isError } = usePlots()
  const geojson = useMemo(() => plotsToGeoJSON((plotsData as Parameters<typeof plotsToGeoJSON>[0]) ?? []), [plotsData])

  const resetMap = () => {
    mapRef.current?.flyTo({
      center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
      zoom: INITIAL_VIEW_STATE.zoom,
    })
  }
  const circleLayer = plotsCircleLayer
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Map
        ref={mapRef}
        initialViewState={INITIAL_VIEW_STATE}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        style={{ width: '100%', height: '100%' }}
        mapStyle={arcgisSatelliteStyle}
        maxZoom={22}
        minZoom={6}
        interactiveLayerIds={['plots-layer']}
        onClick={(e) => {
          const f = e.features?.[0]
          if (f) {
            const props = f.properties as unknown as PlotFeatureProps
            const [lng, lat] = (f.geometry as { type: 'Point'; coordinates: [number, number] }).coordinates
            setPopup({ coords: [lng, lat], props })
          } else {
            setPopup(null)
          }
        }}
        onMouseEnter={(e) => {
          if (e.features && e.features.length > 0 && mapRef.current) {
            mapRef.current.getCanvas().style.cursor = 'pointer'
          }
        }}
        onMouseLeave={() => {
          if (mapRef.current) {
            mapRef.current.getCanvas().style.cursor = ''
          }
        }}
      >
        <NavigationControl />
        <FullscreenControl />
        <GeolocateControl />
        <Button onClick={resetMap} style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
          Reset View
        </Button>

        {!isLoading && !isError && (
          <Source id="plots" type="geojson" data={geojson}>
            <Layer {...circleLayer} />
          </Source>
        )}
        {popup && <PlotPopup coords={popup.coords} props={popup.props} onClose={() => setPopup(null)} />}
      </Map>
    </div>
  )
}

export default MapBox
