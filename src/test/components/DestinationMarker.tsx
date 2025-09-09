import { MapPin } from 'lucide-react'
import { Marker } from 'react-map-gl/mapbox'
import type { Coordinate } from '../utils/location.utils'

interface DestinationMarkerProps {
  position: Coordinate
}

export function DestinationMarker({ position }: DestinationMarkerProps) {
  return (
    <Marker longitude={position[0]} latitude={position[1]} anchor="bottom">
      <MapPin className="text-destructive h-6 w-6 drop-shadow" />
    </Marker>
  )
}
