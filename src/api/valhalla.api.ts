import { Capacitor, CapacitorHttp } from '@capacitor/core'
import polyline from '@mapbox/polyline'
import axios from 'axios'

// Valhalla routing types
export interface ValhallaLocation {
  lat: number
  lon: number
  street?: string
  type?: 'break' | 'through' | 'via' | 'break_through'
  heading?: number
  heading_tolerance?: number
  node_snap_tolerance?: number
  minimum_reachability?: number
  radius?: number
  rank_candidates?: boolean
  preferred_side?: 'same' | 'opposite' | 'either'
}

export interface ValhallaCostingOptions {
  auto?: {
    use_highways?: number
    use_tolls?: number
    use_ferry?: number
    country_crossing_penalty?: number
    maneuver_penalty?: number
    gate_cost?: number
    gate_penalty?: number
  }
  pedestrian?: {
    walking_speed?: number
    walkway_factor?: number
    sidewalk_factor?: number
    alley_factor?: number
    driveway_factor?: number
    step_penalty?: number
    max_hiking_difficulty?: number
    use_ferry?: number
    use_living_streets?: number
    use_tracks?: number
    service_penalty?: number
    service_factor?: number
    use_hills?: number
  }
  bicycle?: {
    bicycle_type?: 'Road' | 'Hybrid' | 'Cross' | 'Mountain'
    cycling_speed?: number
    use_roads?: number
    use_hills?: number
    avoid_bad_surfaces?: number
    use_ferry?: number
    use_living_streets?: number
  }
}

export interface ValhallaRouteRequest {
  locations: ValhallaLocation[]
  costing: 'auto' | 'pedestrian' | 'bicycle'
  costing_options?: ValhallaCostingOptions
  directions_options?: {
    units?: 'kilometers' | 'miles'
    language?: string
    narrative?: boolean
    directions_type?: 'none' | 'maneuvers' | 'instructions'
  }
  format?: 'json'
  id?: string
  alternates?: number
  exclude_polygons?: number[][][]
  date_time?: {
    type: 0 | 1 | 2 | 3
    value?: string
  }
}

export interface ValhallaManeuver {
  type: number
  instruction: string
  verbal_pre_transition_instruction?: string
  verbal_post_transition_instruction?: string
  verbal_transition_alert_instruction?: string
  verbal_multi_cue?: boolean
  street_names?: string[]
  begin_street_names?: string[]
  time: number
  length: number
  begin_shape_index: number
  end_shape_index: number
  toll?: boolean
  highway?: boolean
  rough?: boolean
  gate?: boolean
  ferry?: boolean
  travel_mode?: string
  travel_type?: string
  bearing_before?: number
  bearing_after?: number
  turn_degree?: number
  roundabout_exit_count?: number
  depart_instruction?: string
  arrive_instruction?: string
  cost?: number
}

export interface ValhallaLeg {
  maneuvers: ValhallaManeuver[]
  summary: {
    time: number
    length: number
    has_toll: boolean
    has_highway: boolean
    has_ferry: boolean
    min_lat: number
    min_lon: number
    max_lat: number
    max_lon: number
  }
  shape: string // Encoded polyline
}

export interface ValhallaTrip {
  status: number
  status_message: string
  units: string
  language: string
  locations: Array<{
    lat: number
    lon: number
    side_of_street?: string
    type?: string
    original_index?: number
  }>
  legs: ValhallaLeg[]
  summary: {
    time: number
    length: number
    has_toll: boolean
    has_highway: boolean
    has_ferry: boolean
    min_lat: number
    min_lon: number
    max_lat: number
    max_lon: number
  }
}

export interface ValhallaRouteResponse {
  trip: ValhallaTrip
  id?: string
  alternates?: ValhallaTrip[]
}

// Maneuver type mappings for better UX
export const MANEUVER_TYPES = {
  0: 'None',
  1: 'Start',
  2: 'Start right',
  3: 'Start left',
  4: 'Destination',
  5: 'Destination right',
  6: 'Destination left',
  7: 'Becomes',
  8: 'Continue',
  9: 'Slight right',
  10: 'Right',
  11: 'Sharp right',
  12: 'U-turn right',
  13: 'U-turn left',
  14: 'Sharp left',
  15: 'Left',
  16: 'Slight left',
  17: 'Ramp straight',
  18: 'Ramp right',
  19: 'Ramp left',
  20: 'Exit right',
  21: 'Exit left',
  22: 'Stay straight',
  23: 'Stay right',
  24: 'Stay left',
  25: 'Merge',
  26: 'Roundabout enter',
  27: 'Roundabout exit',
  28: 'Ferry enter',
  29: 'Ferry exit',
  30: 'Transit',
  31: 'Transit transfer',
  32: 'Transit remain on',
  33: 'Transit connection start',
  34: 'Transit connection transfer',
  35: 'Transit connection destination',
  36: 'Post transit connection destination',
  37: 'Merge right',
  38: 'Merge left',
} as const

// Turn types for voice guidance
export const TURN_TYPES = {
  STRAIGHT: [0, 7, 8, 17, 22, 25] as number[],
  SLIGHT_RIGHT: [9, 18, 23, 37] as number[],
  RIGHT: [10] as number[],
  SHARP_RIGHT: [11, 20] as number[],
  SLIGHT_LEFT: [16, 19, 24, 38] as number[],
  LEFT: [15] as number[],
  SHARP_LEFT: [14, 21] as number[],
  U_TURN: [12, 13] as number[],
  ROUNDABOUT: [26, 27] as number[],
  DESTINATION: [4, 5, 6] as number[],
  START: [1, 2, 3] as number[],
}

// Default Valhalla server URL
const VALHALLA_BASE_URL = import.meta.env.VITE_VALHALLA_URL || 'https://valhalla1.openstreetmap.de'

// Request timeout configuration
const REQUEST_TIMEOUT = 15000 // 15 seconds for faster failure detection

/**
 * Request a route from Valhalla with retry logic
 */
export async function getValhallaRoute(
  request: ValhallaRouteRequest,
  retries: number = 2,
): Promise<ValhallaRouteResponse> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const url = `${VALHALLA_BASE_URL}/route`

      if (Capacitor.isNativePlatform()) {
        const response = await CapacitorHttp.request({
          method: 'POST',
          url,
          headers: {
            'Content-Type': 'application/json',
          },
          data: request,
          connectTimeout: REQUEST_TIMEOUT,
          readTimeout: REQUEST_TIMEOUT,
        })

        if (response.status !== 200) {
          throw new Error(`HTTP ${response.status}: ${response.data?.error_message || 'Unknown error'}`)
        }

        return response.data
      } else {
        const response = await axios.post(url, request, {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: REQUEST_TIMEOUT,
        })

        return response.data
      }
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Don't retry on client errors (4xx)
      const err = error as { response?: { status?: number; data?: Record<string, unknown> } }
      if (err.response?.status && err.response.status >= 400 && err.response.status < 500) {
        const msg = String(err.response.data?.error_message ?? err.response.data?.message ?? 'Route not found')
        throw new Error(`Valhalla API error: ${msg}`)
      }

      // Log retry attempt
      if (attempt < retries) {
        console.warn(`Valhalla request failed (attempt ${attempt + 1}/${retries + 1}), retrying...`)
        await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)))
      }
    }
  }

  throw lastError || new Error('Failed to get route')
}

/**
 * Decode Valhalla polyline to Leaflet coordinates
 * Uses precision 6 (Valhalla default)
 */
export function decodePolyline(encodedPolyline: string, precision: number = 6): [number, number][] {
  try {
    return polyline.decode(encodedPolyline, precision)
  } catch (error: unknown) {
    console.error('Failed to decode polyline:', error)
    throw new Error('Failed to decode route polyline')
  }
}

/**
 * Calculate distance between two points using Haversine formula (in meters)
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000 // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Calculate bearing between two points (in degrees)
 */
export function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const lat1Rad = (lat1 * Math.PI) / 180
  const lat2Rad = (lat2 * Math.PI) / 180

  const y = Math.sin(dLon) * Math.cos(lat2Rad)
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon)

  let bearing = (Math.atan2(y, x) * 180) / Math.PI
  bearing = (bearing + 360) % 360

  return bearing
}

/**
 * Find closest point on a line segment to a given point
 * Returns the closest point and the distance to it
 */
export function closestPointOnSegment(
  pointLat: number,
  pointLon: number,
  segStartLat: number,
  segStartLon: number,
  segEndLat: number,
  segEndLon: number,
): { lat: number; lon: number; distance: number; t: number } {
  const dx = segEndLon - segStartLon
  const dy = segEndLat - segStartLat
  const lengthSq = dx * dx + dy * dy

  if (lengthSq === 0) {
    // Segment is a point
    const distance = calculateDistance(pointLat, pointLon, segStartLat, segStartLon)
    return { lat: segStartLat, lon: segStartLon, distance, t: 0 }
  }

  // Calculate projection parameter t
  let t = ((pointLon - segStartLon) * dx + (pointLat - segStartLat) * dy) / lengthSq
  t = Math.max(0, Math.min(1, t))

  // Find closest point on segment
  const closestLat = segStartLat + t * dy
  const closestLon = segStartLon + t * dx
  const distance = calculateDistance(pointLat, pointLon, closestLat, closestLon)

  return { lat: closestLat, lon: closestLon, distance, t }
}

/**
 * Find closest point on route to user location
 * Optimized with early termination and segment-based search
 */
export function findClosestPointOnRoute(
  userLat: number,
  userLon: number,
  routeCoordinates: [number, number][],
  startIndex: number = 0,
  searchRadius: number = 100, // Search up to 100 points ahead
): {
  index: number
  distance: number
  closestPoint: [number, number]
  progressRatio: number
} {
  if (routeCoordinates.length === 0) {
    return { index: 0, distance: Infinity, closestPoint: [0, 0], progressRatio: 0 }
  }

  let closestIndex = startIndex
  let closestDistance = Infinity
  let closestPoint: [number, number] = routeCoordinates[startIndex]
  let progressRatio = 0

  // Search from startIndex with a window
  const endIndex = Math.min(startIndex + searchRadius, routeCoordinates.length - 1)

  for (let i = Math.max(0, startIndex - 5); i < endIndex; i++) {
    const [lat1, lon1] = routeCoordinates[i]
    const [lat2, lon2] = routeCoordinates[i + 1] || routeCoordinates[i]

    // Check segment
    const result = closestPointOnSegment(userLat, userLon, lat1, lon1, lat2, lon2)

    if (result.distance < closestDistance) {
      closestDistance = result.distance
      closestIndex = i
      closestPoint = [result.lat, result.lon]
      progressRatio = result.t
    }

    // Early termination if very close
    if (closestDistance < 5) break
  }

  return { index: closestIndex, distance: closestDistance, closestPoint, progressRatio }
}

/**
 * Check if user is off the route
 * Considers both distance and optionally heading alignment
 */
export function isOffRoute(
  userLat: number,
  userLon: number,
  routeCoordinates: [number, number][],
  threshold: number = 50,
  userHeading?: number,
  startIndex: number = 0,
): { isOff: boolean; distance: number; closestIndex: number } {
  if (routeCoordinates.length === 0) {
    return { isOff: true, distance: Infinity, closestIndex: 0 }
  }

  const result = findClosestPointOnRoute(userLat, userLon, routeCoordinates, startIndex)

  // If distance alone is too far, user is off route
  if (result.distance > threshold) {
    return { isOff: true, distance: result.distance, closestIndex: result.index }
  }

  // Optionally check heading alignment if user heading is provided
  if (userHeading !== undefined && result.index < routeCoordinates.length - 1) {
    const [lat1, lon1] = routeCoordinates[result.index]
    const [lat2, lon2] = routeCoordinates[result.index + 1]
    const routeBearing = calculateBearing(lat1, lon1, lat2, lon2)

    // Calculate heading difference
    let headingDiff = Math.abs(userHeading - routeBearing)
    if (headingDiff > 180) headingDiff = 360 - headingDiff

    // If heading is more than 90 degrees off and distance > 20m, likely off route
    if (headingDiff > 90 && result.distance > 20) {
      return { isOff: true, distance: result.distance, closestIndex: result.index }
    }
  }

  return { isOff: false, distance: result.distance, closestIndex: result.index }
}

/**
 * Calculate remaining distance from a point index to end of route
 */
export function calculateRemainingDistance(
  routeCoordinates: [number, number][],
  fromIndex: number,
): number {
  if (fromIndex >= routeCoordinates.length - 1) return 0

  let distance = 0
  for (let i = fromIndex; i < routeCoordinates.length - 1; i++) {
    const [lat1, lon1] = routeCoordinates[i]
    const [lat2, lon2] = routeCoordinates[i + 1]
    distance += calculateDistance(lat1, lon1, lat2, lon2)
  }

  return distance
}

/**
 * Estimate remaining time based on distance and average walking speed
 */
export function estimateRemainingTime(
  distanceMeters: number,
  speedKmh: number = 4.5, // Average walking speed
): number {
  const speedMps = speedKmh / 3.6
  return distanceMeters / speedMps
}

/**
 * Create a route request for pedestrian navigation
 * Optimized for walking with good path preferences
 */
export function createPedestrianRouteRequest(
  from: { lat: number; lon: number },
  to: { lat: number; lon: number },
  options?: {
    walkingSpeed?: number
    avoidSteps?: boolean
    preferSidewalks?: boolean
  },
): ValhallaRouteRequest {
  return {
    locations: [
      {
        lat: from.lat,
        lon: from.lon,
        type: 'break',
        radius: 50, // Allow snapping to nearby roads
      },
      {
        lat: to.lat,
        lon: to.lon,
        type: 'break',
        radius: 50,
      },
    ],
    costing: 'pedestrian',
    costing_options: {
      pedestrian: {
        walking_speed: options?.walkingSpeed ?? 5.1,
        walkway_factor: options?.preferSidewalks ? 0.8 : 1.0,
        sidewalk_factor: options?.preferSidewalks ? 0.8 : 1.0,
        alley_factor: 1.5,
        driveway_factor: 1.2,
        step_penalty: options?.avoidSteps ? 30 : 5,
        use_ferry: 0.5,
        use_living_streets: 0.8,
        use_tracks: 0.5,
        use_hills: 0.5,
      },
    },
    directions_options: {
      units: 'kilometers',
      language: 'en-US',
      narrative: true,
    },
    format: 'json',
  }
}

/**
 * Create a route request for driving
 */
export function createAutoRouteRequest(
  from: { lat: number; lon: number },
  to: { lat: number; lon: number },
  options?: {
    avoidTolls?: boolean
    avoidHighways?: boolean
  },
): ValhallaRouteRequest {
  return {
    locations: [
      {
        lat: from.lat,
        lon: from.lon,
        type: 'break',
        radius: 35,
      },
      {
        lat: to.lat,
        lon: to.lon,
        type: 'break',
        radius: 35,
      },
    ],
    costing: 'auto',
    costing_options: {
      auto: {
        use_highways: options?.avoidHighways ? 0.2 : 1.0,
        use_tolls: options?.avoidTolls ? 0.0 : 0.5,
        use_ferry: 0.5,
        maneuver_penalty: 5,
        gate_cost: 30,
        gate_penalty: 300,
      },
    },
    directions_options: {
      units: 'kilometers',
      language: 'en-US',
      narrative: true,
    },
    format: 'json',
  }
}

/**
 * Create a route request for bicycle
 */
export function createBicycleRouteRequest(
  from: { lat: number; lon: number },
  to: { lat: number; lon: number },
  options?: {
    bicycleType?: 'Road' | 'Hybrid' | 'Cross' | 'Mountain'
    avoidHills?: boolean
  },
): ValhallaRouteRequest {
  return {
    locations: [
      {
        lat: from.lat,
        lon: from.lon,
        type: 'break',
        radius: 35,
      },
      {
        lat: to.lat,
        lon: to.lon,
        type: 'break',
        radius: 35,
      },
    ],
    costing: 'bicycle',
    costing_options: {
      bicycle: {
        bicycle_type: options?.bicycleType ?? 'Hybrid',
        cycling_speed: 20,
        use_roads: 0.5,
        use_hills: options?.avoidHills ? 0.2 : 0.5,
        avoid_bad_surfaces: 0.25,
        use_ferry: 0.5,
        use_living_streets: 0.8,
      },
    },
    directions_options: {
      units: 'kilometers',
      language: 'en-US',
      narrative: true,
    },
    format: 'json',
  }
}

/**
 * Get instruction text for a maneuver type
 */
export function getManeuverInstruction(type: number): string {
  return MANEUVER_TYPES[type as keyof typeof MANEUVER_TYPES] || 'Continue'
}

/**
 * Check if maneuver is a turn (for voice guidance)
 */
export function isTurnManeuver(type: number): boolean {
  return (
    TURN_TYPES.RIGHT.includes(type) ||
    TURN_TYPES.LEFT.includes(type) ||
    TURN_TYPES.SHARP_RIGHT.includes(type) ||
    TURN_TYPES.SHARP_LEFT.includes(type) ||
    TURN_TYPES.SLIGHT_RIGHT.includes(type) ||
    TURN_TYPES.SLIGHT_LEFT.includes(type) ||
    TURN_TYPES.U_TURN.includes(type)
  )
}

/**
 * Check if maneuver is the destination
 */
export function isDestinationManeuver(type: number): boolean {
  return TURN_TYPES.DESTINATION.includes(type)
}
