import type { LayerProps } from 'react-map-gl/mapbox'

export const plotsCircleLayer: LayerProps = {
  id: 'plots-layer',
  type: 'circle',
  paint: {
    'circle-radius': ['interpolate', ['linear'], ['zoom'], 14, 2, 18, 7, 22, 4],
    'circle-color': ['get', 'color'],
    'circle-stroke-color': '#ffffff',
    'circle-stroke-width': 1,
    'circle-opacity': 0.95,
  },
}
