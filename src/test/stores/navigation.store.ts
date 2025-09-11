import { create } from 'zustand'
import type { MapRef } from 'react-map-gl/maplibre'

import { fetchWalkingDirections, type LineStringFeature } from '../directions'
import type { Coordinate } from '../utils/location.utils'
import { hasReachedDestination, preprocessLocation, calculateBearing } from '../utils/location.utils'
import type { NavigationConfig, CameraMode } from '../types/navigation.types'
import { DEFAULT_NAVIGATION_CONFIG } from '../types/navigation.types'

interface NavigationStore {
  // State
  isActive: boolean
  route: LineStringFeature | null
  instructions: string[]
  origin: Coordinate | null
  destination: Coordinate | null
  currentUserPosition: Coordinate | null
  snappedUserPosition: Coordinate | null
  mapboxAccessToken: string
  config: NavigationConfig
  mapRef: React.RefObject<MapRef> | null
  watchId: number | null
  onDestinationReached: (() => void) | null
  onUrlParamsChange?: (from: string, to: string) => void
  cameraMode: CameraMode
  routeProgressIndex: number | null
  locationWorker: Worker | null

  // Actions
  setMapRef: (ref: React.RefObject<MapRef>) => void
  setMapboxAccessToken: (token: string) => void
  setConfig: (config: Partial<NavigationConfig>) => void
  setOnDestinationReached: (callback: (() => void) | null) => void
  setOnUrlParamsChange: (callback: ((from: string, to: string) => void) | undefined) => void
  setCameraMode: (mode: CameraMode) => void
  cycleCameraMode: () => void
  startNavigation: (destination: Coordinate, origin?: Coordinate) => Promise<void>
  cancelNavigation: () => void
  updateUserPosition: (position: Coordinate) => void
  stopLocationWatch: () => void
  startLocationWatch: () => void
  loadRouteFromURL: (from: string, to: string) => Promise<void>
}

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  // Initial state
  isActive: false,
  route: null,
  instructions: [],
  origin: null,
  destination: null,
  currentUserPosition: null,
  snappedUserPosition: null,
  mapboxAccessToken: '',
  config: DEFAULT_NAVIGATION_CONFIG,
  mapRef: null,
  watchId: null,
  onDestinationReached: null,
  onUrlParamsChange: undefined,
  cameraMode: 'followNorth',
  routeProgressIndex: null,
  locationWorker: null,

  // Actions
  setMapRef: (ref) => set({ mapRef: ref }),

  setMapboxAccessToken: (token) => set({ mapboxAccessToken: token }),

  setConfig: (newConfig) =>
    set((state) => ({
      config: { ...state.config, ...newConfig },
    })),

  setOnDestinationReached: (callback) => set({ onDestinationReached: callback }),

  setOnUrlParamsChange: (callback) => set({ onUrlParamsChange: callback }),

  setCameraMode: (mode) => set({ cameraMode: mode }),

  cycleCameraMode: () =>
    set((state) => {
      const order: CameraMode[] = ['followHeading', 'followNorth', 'overview']
      const idx = order.indexOf(state.cameraMode)
      const next = order[(idx + 1) % order.length]
      return { cameraMode: next }
    }),

  stopLocationWatch: () => {
    const { watchId } = get()
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      set({ watchId: null })
    }
  },

  startLocationWatch: () => {
    const { watchId, mapRef, isActive, destination, config, stopLocationWatch, cancelNavigation } = get()
    if (!('geolocation' in navigator) || watchId !== null) {
      return
    }

    let lastSmoothed: Coordinate | null = null
    const newWatchId = navigator.geolocation.watchPosition(
      (pos) => {
        const rawPosition: Coordinate = [pos.coords.longitude, pos.coords.latitude]
        const { smoothed, heading } = preprocessLocation(lastSmoothed, rawPosition)
        lastSmoothed = smoothed
        set({ currentUserPosition: smoothed, origin: smoothed })

        // Check if user has reached destination
        if (destination && hasReachedDestination(smoothed, destination, config.destinationThreshold)) {
          // Stop the watch first to prevent further callbacks
          stopLocationWatch()
          // Call the destination reached callback
          const { onDestinationReached } = get()
          onDestinationReached?.()
          // Then cancel navigation
          cancelNavigation()
          return
        }

        // Only smoothly pan the map to follow the user if camera is locked
        const { cameraMode } = get()
        if (mapRef?.current && isActive) {
          let nextBearing: number | undefined
          if (cameraMode === 'followHeading') {
            if (heading !== null) {
              nextBearing = heading
            } else if (lastSmoothed) {
              nextBearing = calculateBearing(lastSmoothed, smoothed)
            }
          } else if (cameraMode === 'followNorth') {
            nextBearing = 0
          }

          mapRef.current.easeTo({
            center: smoothed,
            bearing: nextBearing,
            duration: config.mapPanDuration,
            essential: true,
          })
        }

        // Send to worker for snapping/progress if available
        const { route, locationWorker } = get()
        if (route && locationWorker) {
          const coords = route.geometry.coordinates as Coordinate[]
          locationWorker.postMessage({ type: 'closest', line: coords, point: smoothed })
        }
      },
      (error) => {
        console.warn('Geolocation watch error:', error)
      },
      config.geolocationOptions,
    )

    set({ watchId: newWatchId })
  },

  startNavigation: async (destinationCoord: Coordinate, originCoord?: Coordinate) => {
    const { mapboxAccessToken, mapRef } = get()
    if (!('geolocation' in navigator) && !originCoord) {
      console.warn('Geolocation not available and no origin provided')
      return
    }

    try {
      let finalOriginCoord: Coordinate

      if (originCoord) {
        finalOriginCoord = originCoord
      } else {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
          })
        })
        finalOriginCoord = [position.coords.longitude, position.coords.latitude]
      }

      set({
        currentUserPosition: finalOriginCoord,
        origin: finalOriginCoord,
        destination: destinationCoord,
        isActive: true,
      })

      console.log('Navigation started with origin:', finalOriginCoord, 'destination:', destinationCoord)

      // Update URL params immediately
      const { onUrlParamsChange } = get()
      if (onUrlParamsChange) {
        console.log(
          'Calling URL params callback with:',
          `${finalOriginCoord[1]},${finalOriginCoord[0]}`,
          `${destinationCoord[1]},${destinationCoord[0]}`,
        )
        onUrlParamsChange(
          `${finalOriginCoord[1]},${finalOriginCoord[0]}`, // lat,lng
          `${destinationCoord[1]},${destinationCoord[0]}`, // lat,lng
        )
      }

      const directionsResult = await fetchWalkingDirections(finalOriginCoord, destinationCoord, mapboxAccessToken)

      if (!directionsResult) {
        console.warn('Failed to fetch directions')
        return
      }

      set({
        route: directionsResult.feature,
        instructions: directionsResult.steps,
      })

      // Initialize worker if not exists
      if (!get().locationWorker) {
        const worker = new Worker(new URL('../workers/location.worker.ts', import.meta.url), { type: 'module' })
        worker.onmessage = (e: MessageEvent) => {
          const data = e.data as { type: string; index?: number; snapped?: Coordinate }
          if (data.type === 'closestResult') {
            set({ routeProgressIndex: data.index ?? null, snappedUserPosition: (data.snapped as Coordinate) ?? null })
          }
        }
        set({ locationWorker: worker })
      }

      // Fit map to show the route
      mapRef?.current?.fitBounds([finalOriginCoord, destinationCoord], { padding: 60 })

      // Start watching user position
      get().startLocationWatch()
    } catch (error) {
      console.error('Failed to start navigation:', error)
    }
  },

  cancelNavigation: () => {
    console.log('Cancel navigation called')
    const { watchId, onUrlParamsChange, locationWorker } = get()
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
    }

    set({
      route: null,
      instructions: [],
      origin: null,
      destination: null,
      currentUserPosition: null,
      snappedUserPosition: null,
      isActive: false,
      watchId: null,
      routeProgressIndex: null,
    })

    if (locationWorker) {
      locationWorker.terminate()
      set({ locationWorker: null })
    }

    // Clear URL params
    if (onUrlParamsChange) {
      onUrlParamsChange('', '')
    }

    console.log('Navigation state cleared')
  },

  loadRouteFromURL: async (from: string, to: string) => {
    console.log('Loading route from URL:', from, to)
    const { mapboxAccessToken, mapRef } = get()

    try {
      const fromCoords = from.split(',').map(Number)
      const toCoords = to.split(',').map(Number)

      if (
        fromCoords.length !== 2 ||
        toCoords.length !== 2 ||
        isNaN(fromCoords[0]) ||
        isNaN(fromCoords[1]) ||
        isNaN(toCoords[0]) ||
        isNaN(toCoords[1]) ||
        fromCoords[0] < -90 ||
        fromCoords[0] > 90 || // lat should be between -90 and 90
        fromCoords[1] < -180 ||
        fromCoords[1] > 180 || // lng should be between -180 and 180
        toCoords[0] < -90 ||
        toCoords[0] > 90 ||
        toCoords[1] < -180 ||
        toCoords[1] > 180
      ) {
        console.warn('Invalid coordinates in URL:', { fromCoords, toCoords })
        return
      }

      const origin: Coordinate = [fromCoords[1], fromCoords[0]] // lng, lat
      const destination: Coordinate = [toCoords[1], toCoords[0]] // lng, lat

      console.log('Parsed coordinates from URL:', {
        from,
        to,
        fromCoords,
        toCoords,
        origin,
        destination,
      })

      set({
        currentUserPosition: origin,
        origin,
        destination,
        isActive: true,
      })

      const directionsResult = await fetchWalkingDirections(origin, destination, mapboxAccessToken)

      if (!directionsResult) {
        console.warn('Failed to fetch directions from URL')
        return
      }

      set({
        route: directionsResult.feature,
        instructions: directionsResult.steps,
      })

      // Initialize worker if not exists
      if (!get().locationWorker) {
        const worker = new Worker(new URL('../workers/location.worker.ts', import.meta.url), { type: 'module' })
        worker.onmessage = (e: MessageEvent) => {
          const data = e.data as { type: string; index?: number; snapped?: Coordinate }
          if (data.type === 'closestResult') {
            set({ routeProgressIndex: data.index ?? null, snappedUserPosition: (data.snapped as Coordinate) ?? null })
          }
        }
        set({ locationWorker: worker })
      }

      // Fit map to show the route
      mapRef?.current?.fitBounds([origin, destination], { padding: 60 })

      // Start watching user position
      get().startLocationWatch()
    } catch (error) {
      console.error('Failed to load route from URL:', error)
    }
  },

  updateUserPosition: (position: Coordinate) => {
    set({ currentUserPosition: position })
  },
}))
