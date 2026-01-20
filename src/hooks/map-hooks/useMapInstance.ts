import { useCallback, useEffect, useState } from 'react'
import L from 'leaflet'
import { useMap } from 'react-leaflet'

import { MAP_PANE_Z_INDEX } from '@/constants/map.constants'

// Extend HTMLElement to include leaflet map reference
declare global {
  interface HTMLElement {
    _leaflet_map?: L.Map
  }
}

/**
 * Props for the MapInstanceBinder component
 */
interface MapInstanceBinderProps {
  onMapReady: (map: L.Map) => void
}

/**
 * Component that binds to the map instance and sets up panes
 * Must be used inside a MapContainer
 */
function MapInstanceBinder({ onMapReady }: MapInstanceBinderProps) {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    onMapReady(map)
    map.getContainer()._leaflet_map = map

    // Ensure custom panes exist for proper z-index layering
    const ensurePane = (name: string, zIndex: number) => {
      if (!map.getPane(name)) {
        const pane = map.createPane(name)
        pane.style.zIndex = String(zIndex)
      }
    }

    ensurePane('route-pane', MAP_PANE_Z_INDEX.ROUTE_PANE)
    ensurePane('end-icon', MAP_PANE_Z_INDEX.END_ICON)
  }, [map, onMapReady])

  return null
}

/**
 * Return type for the useMapInstance hook
 */
interface UseMapInstanceReturn {
  /** The Leaflet map instance, null until initialized */
  mapInstance: L.Map | null
  /** Callback to set the map instance */
  setMapInstance: (map: L.Map | null) => void
  /** Stable callback for the MapInstanceBinder */
  handleMapReady: (map: L.Map) => void
  /** Component to render inside MapContainer to bind the instance */
  MapInstanceBinder: React.ComponentType<MapInstanceBinderProps>
}

/**
 * Hook for managing the Leaflet map instance
 * Provides the map instance and a component to bind it
 *
 * @example
 * ```tsx
 * const { mapInstance, handleMapReady, MapInstanceBinder } = useMapInstance()
 *
 * return (
 *   <MapContainer>
 *     <MapInstanceBinder onMapReady={handleMapReady} />
 *     {mapInstance && <SomeMapComponent map={mapInstance} />}
 *   </MapContainer>
 * )
 * ```
 */
export function useMapInstance(): UseMapInstanceReturn {
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null)

  const handleMapReady = useCallback((map: L.Map) => {
    setMapInstance(map)
  }, [])

  return {
    mapInstance,
    setMapInstance,
    handleMapReady,
    MapInstanceBinder,
  }
}

export { MapInstanceBinder }
export type { MapInstanceBinderProps, UseMapInstanceReturn }
