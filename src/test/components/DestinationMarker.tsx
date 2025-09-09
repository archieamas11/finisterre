import { Marker } from 'react-map-gl/maplibre'
import type { Coordinate } from '../utils/location.utils'

interface DestinationMarkerProps {
  position: Coordinate
}

export function DestinationMarker({ position }: DestinationMarkerProps) {
  return (
    <Marker longitude={position[0]} latitude={position[1]}>
      <div aria-label="Destination">
        <svg width="28" height="40" className="mb-5" viewBox="0 0 24 34" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
          <title>Destination</title>
          <defs>
            <feDropShadow />
          </defs>
          <path
            filter="url(#dest-shadow)"
            d="M12 0C7.03 0 3 3.96 3 8.85c0 6.05 7.35 14.25 8.22 15.2.21.23.53.36.85.36.32 0 .64-.13.85-.36.87-.95 8.22-9.15 8.22-15.2C21 3.96 16.97 0 12 0z"
            fill="#ef4444"
          />
          <circle cx="12" cy="9" r="3.2" fill="#fff" />
        </svg>
      </div>
    </Marker>
  )
}
