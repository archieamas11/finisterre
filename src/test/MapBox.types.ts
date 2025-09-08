import { convertPlotToMarker, getStatusColor, type ConvertedMarker } from '@/types/map.types'

export interface Point {
  type: 'Point'
  coordinates: [number, number]
}

export interface Feature<G = Point, P = unknown> {
  type: 'Feature'
  geometry: G
  properties: P
}

export interface FeatureCollection<G = Point, P = unknown> {
  type: 'FeatureCollection'
  features: Array<Feature<G, P>>
}

// Build a performant GeoJSON for WebGL rendering
export type PlotFeatureProps = Omit<ConvertedMarker, 'position'> & { color: string }

export const plotsToGeoJSON = (plots: Array<unknown>): FeatureCollection<Point, PlotFeatureProps> => {
  const features = (plots ?? []).map((p) => {
    const m = convertPlotToMarker(p as Parameters<typeof convertPlotToMarker>[0])
    const [lat, lng] = m.position
    return {
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [lng, lat] as [number, number],
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
