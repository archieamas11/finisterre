import { Source, Layer } from 'react-map-gl/maplibre'
import { useMemo } from 'react'

import type { LineStringFeature } from './directions'
import type { Coordinate } from './utils/location.utils'
import { findClosestPointOnLine } from './utils/location.utils'

type Props = {
  feature: LineStringFeature
  userPosition?: Coordinate | null
}

export function RouteLayer({ feature, userPosition }: Props) {
  const progressFeature = useMemo(() => {
    if (!userPosition || !feature.geometry.coordinates.length) {
      return feature
    }

    const coordinates = feature.geometry.coordinates as Coordinate[]
    const { index: closestIndex } = findClosestPointOnLine(coordinates, userPosition)

    // Create a new feature with only the remaining route ahead
    const remainingCoordinates = coordinates.slice(closestIndex)

    // If we're very close to the destination, show the full route
    if (remainingCoordinates.length <= 1) {
      return feature
    }

    return {
      ...feature,
      geometry: {
        ...feature.geometry,
        coordinates: remainingCoordinates,
      },
    }
  }, [feature, userPosition])

  return (
    <Source id="route" type="geojson" data={progressFeature}>
      <Layer
        id="route-line"
        type="line"
        paint={{
          'line-color': '#fecf0c',
          'line-width': 5,
          'line-opacity': 1,
        }}
        layout={{
          'line-cap': 'round',
          'line-join': 'round',
        }}
      />
    </Source>
  )
}
