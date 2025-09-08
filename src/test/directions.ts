export type LineStringFeature = {
  type: 'Feature'
  geometry: { type: 'LineString'; coordinates: [number, number][] }
  properties: Record<string, unknown>
}

export type DirectionsResult = {
  feature: LineStringFeature
  steps: string[]
}

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180
}

function haversineMeters(a: [number, number], b: [number, number]): number {
  const R = 6371000
  const dLat = toRadians(b[1] - a[1])
  const dLon = toRadians(b[0] - a[0])
  const lat1 = toRadians(a[1])
  const lat2 = toRadians(b[1])

  const sinDLat = Math.sin(dLat / 2)
  const sinDLon = Math.sin(dLon / 2)
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon
  return 2 * R * Math.asin(Math.sqrt(h))
}

export async function fetchWalkingDirections(
  origin: [number, number],
  destination: [number, number],
  accessToken: string,
): Promise<DirectionsResult | null> {
  const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&overview=full&steps=true&access_token=${accessToken}`
  try {
    const res = await fetch(url)
    const json: {
      routes: Array<{
        geometry: { coordinates: number[][] }
        legs: Array<{ steps: Array<{ maneuver: { instruction: string } }> }>
      }>
    } = await res.json()
    const first = json.routes?.[0]
    if (!first) return null

    const coords = (first.geometry.coordinates as [number, number][]) || []
    const steps = first.legs?.[0]?.steps?.map((s) => s.maneuver.instruction) ?? []

    // Snap end to destination if the route stops short (e.g., path-only access)
    const last = coords[coords.length - 1]
    if (!last || haversineMeters(last, destination) > 1) {
      coords.push(destination)
    }

    const feature: LineStringFeature = {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: coords },
      properties: {},
    }

    return { feature, steps }
  } catch {
    return null
  }
}
