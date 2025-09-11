/**
 * Location utility functions for navigation and distance calculations
 */

export interface LocationPoint {
  longitude: number
  latitude: number
}

export type Coordinate = [number, number]

/**
 * Convert degrees to radians
 */
export function toRadians(deg: number): number {
  return (deg * Math.PI) / 180
}

/**
 * Calculate distance between two points using Haversine formula
 * @param point1 First coordinate [longitude, latitude]
 * @param point2 Second coordinate [longitude, latitude]
 * @returns Distance in meters
 */
export function calculateDistance(point1: Coordinate, point2: Coordinate): number {
  const R = 6371000 // Earth's radius in meters
  const dLat = toRadians(point2[1] - point1[1])
  const dLon = toRadians(point2[0] - point1[0])
  const lat1 = toRadians(point1[1])
  const lat2 = toRadians(point2[1])

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

/**
 * Find the closest point on a line to a given point
 * @param lineCoordinates Array of coordinates forming the line
 * @param userPosition User's current position
 * @returns Object with closest point and its index
 */
export function findClosestPointOnLine(lineCoordinates: Coordinate[], userPosition: Coordinate): { closestPoint: Coordinate; index: number } {
  let minDistance = Infinity
  let closestPoint: Coordinate = lineCoordinates[0]
  let closestIndex = 0

  for (let i = 0; i < lineCoordinates.length; i++) {
    const distance = calculateDistance(userPosition, lineCoordinates[i])
    if (distance < minDistance) {
      minDistance = distance
      closestPoint = lineCoordinates[i]
      closestIndex = i
    }
  }

  return { closestPoint, index: closestIndex }
}

/**
 * Check if user has reached destination within threshold
 * @param userPosition Current user position
 * @param destination Target destination
 * @param threshold Distance threshold in meters (default: 10)
 * @returns True if user is within threshold of destination
 */
export function hasReachedDestination(userPosition: Coordinate, destination: Coordinate, threshold: number = 10): boolean {
  return calculateDistance(userPosition, destination) < threshold
}

/**
 * Calculate initial bearing (forward azimuth) from point A to point B in degrees (0-360)
 * @param from Coordinate [lng, lat]
 * @param to Coordinate [lng, lat]
 */
export function calculateBearing(from: Coordinate, to: Coordinate): number {
  const [lng1, lat1] = from.map(toRadians) as [number, number]
  const [lng2, lat2] = to.map(toRadians) as [number, number]

  const dLng = lng2 - lng1
  const y = Math.sin(dLng) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)
  const bearingRad = Math.atan2(y, x)
  const bearingDeg = (bearingRad * 180) / Math.PI
  return (bearingDeg + 360) % 360
}

/**
 * Exponential moving average smoothing between last and next coordinate
 * @param lastSmoothed Previous smoothed coordinate (or null for first)
 * @param nextRaw Next raw coordinate
 * @param alpha Smoothing factor in [0,1], higher trusts new data more
 */
export function smoothCoordinate(lastSmoothed: Coordinate | null, nextRaw: Coordinate, alpha: number = 0.3): Coordinate {
  if (!lastSmoothed) return nextRaw
  const smoothedLng = lastSmoothed[0] + alpha * (nextRaw[0] - lastSmoothed[0])
  const smoothedLat = lastSmoothed[1] + alpha * (nextRaw[1] - lastSmoothed[1])
  return [smoothedLng, smoothedLat]
}

export interface PreprocessLocationResult {
  smoothed: Coordinate
  heading: number | null
}

/**
 * Smooth raw location and compute heading from previous smoothed point
 */
export function preprocessLocation(
  lastSmoothed: Coordinate | null,
  nextRaw: Coordinate,
  options?: { alpha?: number; minDistanceForHeading?: number },
): PreprocessLocationResult {
  const alpha = options?.alpha ?? 0.3
  const minDistanceForHeading = options?.minDistanceForHeading ?? 0.5 // meters

  const smoothed = smoothCoordinate(lastSmoothed, nextRaw, alpha)
  let heading: number | null = null
  if (lastSmoothed) {
    const movedMeters = calculateDistance(lastSmoothed, smoothed)
    if (movedMeters >= minDistanceForHeading) {
      heading = calculateBearing(lastSmoothed, smoothed)
    }
  }
  return { smoothed, heading }
}

/**
 * Snap a location to the closest point on the given route geometry (LineString coordinates)
 * Returns the snapped coordinate and distance (meters) from original point to snapped point.
 */
export function snapToRoute(point: Coordinate, routeCoordinates: Coordinate[]): { snapped: Coordinate; distanceMeters: number; index: number } {
  // Fallback to nearest vertex (simple and fast)
  const { closestPoint, index } = findClosestPointOnLine(routeCoordinates, point)
  const distanceMeters = calculateDistance(point, closestPoint)
  return { snapped: closestPoint, distanceMeters, index }
}
