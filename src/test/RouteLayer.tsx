import { Source, Layer } from 'react-map-gl/mapbox'

import type { LineStringFeature } from './directions'

type Props = {
  feature: LineStringFeature
}

export function RouteLayer({ feature }: Props) {
  return (
    <Source id="route" type="geojson" data={feature}>
      <Layer id="route-line" type="line" paint={{ 'line-color': '#3b82f6', 'line-width': 4, 'line-opacity': 0.9 }} />
    </Source>
  )
}
