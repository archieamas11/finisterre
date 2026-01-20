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
