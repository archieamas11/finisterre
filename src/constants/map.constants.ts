import type { MapState } from '@/contexts/MapContext'

/**
 * Tile layer configuration options for the map
 * - arcgis: Satellite imagery from ArcGIS wayback service
 * - osm: Standard OpenStreetMap tiles
 * - maptilerStreets: MapTiler streets (3D) layer
 */
export const TILE_LAYER_OPTIONS = {
  arcgis: {
    name: 'Satellite',
    url: 'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/58924/{z}/{y}/{x}',
  },
  osm: {
    name: 'Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
  maptilerStreets: {
    name: 'Streets 3D',
    url: 'streets-v4',
  },
} as const

export type TileLayerKey = keyof typeof TILE_LAYER_OPTIONS

/**
 * Initial state for the map reducer
 */
export const initialMapState: MapState = {
  isNavigationInstructionsOpen: false,
  isDirectionLoading: false,
  selectedGroups: new Set(),
  clusterViewMode: 'all',
  searchQuery: '',
  searchResult: null,
  isSearching: false,
  highlightedNiche: null,
  autoOpenPopupFor: null,
}

/**
 * Default map bounds for the Finisterre cemetery
 * [Southwest corner, Northeast corner]
 */
export const DEFAULT_MAP_BOUNDS: [[number, number], [number, number]] = [
  [10.247883800064669, 123.79691285546676],
  [10.249302749341647, 123.7988598710129],
]

/**
 * Map zoom level constants
 */
export const MAP_ZOOM = {
  DEFAULT: 18,
  MAX: 25,
  MAX_NATIVE: 18,
  SEARCH_RESULT: 18,
  LOCATE: 18,
} as const

/**
 * Map pane z-index configuration
 */
export const MAP_PANE_Z_INDEX = {
  ROUTE_PANE: 600,
  END_ICON: 1000,
} as const

/**
 * Notification auto-dismiss timeout in milliseconds
 */
export const NOTIFICATION_TIMEOUT = 3000

/**
 * Location tracking configuration
 */
export const LOCATION_TRACKING_CONFIG = {
  enableHighAccuracy: true,
  distanceFilter: 5,
} as const

/**
 * Valhalla routing configuration
 */
export const VALHALLA_CONFIG = {
  costingType: 'pedestrian' as const,
  enableAutoReroute: true,
  offRouteThreshold: 25,
} as const
