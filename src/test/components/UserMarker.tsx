import { Marker } from 'react-map-gl/maplibre'
import type { Coordinate } from '../utils/location.utils'

interface UserMarkerProps {
  position: Coordinate
  isNavigating: boolean
}

export function UserMarker({ position, isNavigating }: UserMarkerProps) {
  return (
    <Marker longitude={position[0]} latitude={position[1]} anchor="center">
      <div className="relative">
        <span className={`block h-3 w-3 rounded-full border-2 border-white shadow ${isNavigating ? 'animate-pulse bg-green-500' : 'bg-primary'}`} />
        <span
          className={`absolute top-1/2 left-1/2 -z-10 block h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full ${
            isNavigating ? 'animate-ping bg-green-500/30' : 'bg-primary/30'
          }`}
        />
        {isNavigating && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-black/80 px-2 py-1 text-xs whitespace-nowrap text-white">
            Navigating...
          </div>
        )}
      </div>
    </Marker>
  )
}
