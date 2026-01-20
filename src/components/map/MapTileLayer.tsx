import { lazy, memo, Suspense } from 'react'
import { TileLayer } from 'react-leaflet'

import { MAP_ZOOM, type TileLayerKey, TILE_LAYER_OPTIONS } from '@/constants/map.constants'

const MapTilerLayerComponent = lazy(() => import('@/components/map/MapTilerLayerComponent'))

/**
 * Props for the MapTileLayer component
 */
export interface MapTileLayerProps {
  /** Currently selected tile layer key */
  selectedTileLayer: TileLayerKey
  /** MapTiler API key for 3D streets layer */
  apiKey?: string
}

/**
 * Component for rendering the appropriate map tile layer
 * Handles switching between different tile providers (ArcGIS, OSM, MapTiler)
 *
 * @example
 * ```tsx
 * <MapContainer>
 *   <MapTileLayer
 *     selectedTileLayer="arcgis"
 *     apiKey={import.meta.env.VITE_MAPTILER_API_KEY}
 *   />
 * </MapContainer>
 * ```
 */
function MapTileLayerComponent_({ selectedTileLayer, apiKey }: MapTileLayerProps) {
  if (selectedTileLayer === 'maptilerStreets') {
    return (
      <Suspense fallback={null}>
        <MapTilerLayerComponent
          key={selectedTileLayer}
          apiKey={apiKey || ''}
          style="streets-v2"
        />
      </Suspense>
    )
  }

  const tileConfig = TILE_LAYER_OPTIONS[selectedTileLayer]

  return (
    <TileLayer
      key={selectedTileLayer}
      url={tileConfig.url}
      maxNativeZoom={MAP_ZOOM.MAX_NATIVE}
      maxZoom={MAP_ZOOM.MAX}
      detectRetina={true}
    />
  )
}

export const MapTileLayer = memo(MapTileLayerComponent_)
MapTileLayer.displayName = 'MapTileLayer'
