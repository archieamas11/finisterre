import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'
import { useState, useMemo, useRef, useEffect } from 'react'
import Map, { FullscreenControl, NavigationControl, GeolocateControl, type MapRef, Source, Layer } from 'react-map-gl/mapbox'

import { usePlots } from '@/hooks/plots-hooks/plot.hooks'

import arcgisSatelliteStyle from './ArcGisTileLayer'
import { plotsToGeoJSON, type PlotFeatureProps } from './buildGeoJSON'
import { DirectionsList } from './DirectionsList'
import { PlotPopup } from './PlotPopup'
import { plotsCircleLayer } from './plotsCircleLayer'
import type { Coordinate } from './utils/location.utils'
import { RouteLayer } from './RouteLayer'

import { DestinationMarker } from './components/DestinationMarker'
import { NavigationControls } from './components/NavigationControls'
import { UserMarker } from './components/UserMarker'
import { useNavigation } from './hooks/useNavigation'
import { Button } from '@/components/ui/button'

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

// Global flag to track if RTL plugin has been initialized
let rtlPluginInitialized = false

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

  // Disable Mapbox telemetry to prevent blocked requests
  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

    // Only set RTL text plugin once to avoid "cannot be called multiple times" error
    if (!rtlPluginInitialized) {
      try {
        mapboxgl.setRTLTextPlugin('', null, true)
        rtlPluginInitialized = true
      } catch {
        // RTL plugin already set, ignore error
        console.debug('RTL text plugin already initialized')
        rtlPluginInitialized = true
      }
    }

    // Disable Mapbox telemetry/analytics
    if (typeof window !== 'undefined') {
      // Set a global flag to disable telemetry
      ;(window as unknown as Record<string, unknown>).mapboxgl = mapboxgl
      ;(window as unknown as Record<string, unknown>).mapboxgl = { ...mapboxgl, accessToken: MAPBOX_ACCESS_TOKEN }
    }
  }, [])

  const circleLayer = plotsCircleLayer

  // Use navigation hook for all navigation logic
  const navigation = useNavigation({
    mapRef: mapRef as React.RefObject<MapRef>,
    mapboxAccessToken: MAPBOX_ACCESS_TOKEN,
    onDestinationReached: () => {
      alert('🎉 You have reached your destination!')
    },
  })

  const onGetDirections = async (destination: Coordinate) => {
    await navigation.startNavigation(destination)
  }
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Map
        ref={mapRef}
        reuseMaps
        initialViewState={INITIAL_VIEW_STATE}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        style={{ width: '100%', height: '100%' }}
        mapStyle={arcgisSatelliteStyle}
        maxZoom={22}
        minZoom={6}
        interactiveLayerIds={['plots-layer']}
        attributionControl={false}
        logoPosition="bottom-right"
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
        <NavigationControls
          onResetView={() => {
            mapRef.current?.flyTo({
              center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
              zoom: INITIAL_VIEW_STATE.zoom,
              bearing: 0,
              pitch: 0,
              essential: true,
            })
          }}
        />

        {navigation.isActive && (
          <div className="absolute top-0 left-20 z-10 m-2">
            <Button onClick={navigation.cancelNavigation} style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
              Cancel Navigation
            </Button>
          </div>
        )}

        {!isLoading && !isError && (
          <Source id="plots" type="geojson" data={geojson}>
            <Layer {...circleLayer} />
          </Source>
        )}
        {navigation.route && <RouteLayer feature={navigation.route} userPosition={navigation.currentUserPosition} />}
        {navigation.origin && <UserMarker position={navigation.origin} isNavigating={navigation.isActive} />}
        {navigation.destination && <DestinationMarker position={navigation.destination} />}
        {popup && <PlotPopup coords={popup.coords} props={popup.props} onClose={() => setPopup(null)} onGetDirections={onGetDirections} />}
      </Map>
      <DirectionsList steps={navigation.instructions} />
    </div>
  )
}

export default MapBox
