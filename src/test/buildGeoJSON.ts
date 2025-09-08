import { convertPlotToMarker, getStatusColor, type ConvertedMarker } from '@/types/map.types'

// Local minimal GeoJSON types
export interface PointGeometry {
  type: 'Point'
  coordinates: [number, number]
}

export interface Feature<G = PointGeometry, P = unknown> {
  type: 'Feature'
  geometry: G
  properties: P
}

export interface FeatureCollection<G = PointGeometry, P = unknown> {
  type: 'FeatureCollection'
  features: Array<Feature<G, P>>
}

export type PlotFeatureProps = Omit<ConvertedMarker, 'position'> & { color: string }

export const plotsToGeoJSON = (plots: Array<Parameters<typeof convertPlotToMarker>[0]>): FeatureCollection<PointGeometry, PlotFeatureProps> => {
  const features: Array<Feature<PointGeometry, PlotFeatureProps>> = (plots ?? []).map((p) => {
    const m = convertPlotToMarker(p)
    const [lat, lng] = m.position
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      properties: {
        ...m,
        color: getStatusColor((m.plotStatus ?? '').toLowerCase()),
      },
    }
  })

  return {
    type: 'FeatureCollection',
    features,
  }
}
