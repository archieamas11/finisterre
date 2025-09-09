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
