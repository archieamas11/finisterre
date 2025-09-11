import type { Coordinate } from '../utils/location.utils'
import type { LineStringFeature } from '../directions'

/**
 * Navigation state interface
 */
export interface NavigationState {
  isActive: boolean
  route: LineStringFeature | null
  instructions: string[]
  origin: Coordinate | null
  destination: Coordinate | null
  currentUserPosition: Coordinate | null
  cameraMode?: CameraMode
  routeProgressIndex?: number | null
  snappedUserPosition?: Coordinate | null
}

/**
 * Navigation actions interface
 */
export interface NavigationActions {
  startNavigation: (destination: Coordinate) => Promise<void>
  cancelNavigation: () => void
  updateUserPosition: (position: Coordinate) => void
  setCameraMode?: (mode: CameraMode) => void
  cycleCameraMode?: () => void
}

/**
 * Geolocation watch options
 */
export interface GeolocationWatchOptions {
  enableHighAccuracy: boolean
  timeout: number
  maximumAge: number
}

/**
 * Navigation configuration
 */
export interface NavigationConfig {
  destinationThreshold: number // meters
  mapPanDuration: number // milliseconds
  geolocationOptions: GeolocationWatchOptions
}

/**
 * Default navigation configuration
 */
export const DEFAULT_NAVIGATION_CONFIG: NavigationConfig = {
  destinationThreshold: 10,
  mapPanDuration: 1000,
  geolocationOptions: {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 1000,
  },
}

/** Camera modes for map behavior during navigation */
export type CameraMode = 'followHeading' | 'followNorth' | 'overview'
