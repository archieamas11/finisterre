import type { Map as LeafletMap } from 'leaflet'

import 'leaflet/dist/leaflet.css'

import { memo, useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import { ShieldCheck } from 'lucide-react'
import { FaDirections } from 'react-icons/fa'
import { MdTravelExplore } from 'react-icons/md'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { CEMETERY_LOCATION, MAP_BOUNDS } from './constants'

import './custom-marker-styles.css'

interface LocationMapProps {
  className?: string
}

export function LocationMap({ className }: LocationMapProps) {
  const [leafletMap, setLeafletMap] = useState<LeafletMap | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)

  const cemeteryIcon = useMemo(() => {
    return L.divIcon({
      html: `
        <div class="cemetery-marker">
          <div class="marker-pin">
            <div class="marker-shadow"></div>
            <div class="marker-body">
              <div class="marker-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="white"/>
                  <rect x="8" y="18" width="8" height="4" fill="white"/>
                  <rect x="10" y="16" width="4" height="2" fill="white"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      `,
      className: 'custom-cemetery-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    })
  }, [])

  // Resize observer to invalidate leaflet size when the container size changes
  useEffect(() => {
    if (!mapContainerRef.current || !leafletMap || typeof ResizeObserver === 'undefined') return

    const el = mapContainerRef.current
    const ro = new ResizeObserver(() => {
      leafletMap.invalidateSize()
    })
    ro.observe(el)

    return () => ro.disconnect()
  }, [leafletMap])

  return (
    <div className={className}>
      <div ref={mapContainerRef} className="relative h-[320px] w-full sm:h-[420px] md:h-[480px] lg:h-[480px]">
        <MapContainer
          center={[CEMETERY_LOCATION.lat, CEMETERY_LOCATION.lng]}
          zoom={16}
          maxZoom={20}
          minZoom={10}
          scrollWheelZoom={true}
          zoomControl={false}
          maxBounds={MAP_BOUNDS}
          maxBoundsViscosity={1.0}
          className="h-full w-full rounded-lg"
        >
          <MapInitializer onMap={(m) => setLeafletMap(m)} />
          <TileLayer
            url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxNativeZoom={19}
            maxZoom={20}
          />
          <Marker position={[CEMETERY_LOCATION.lat, CEMETERY_LOCATION.lng]} icon={cemeteryIcon}>
            <Popup minWidth={100} maxWidth={200}>
              <MapPopupContent />
            </Popup>
          </Marker>
        </MapContainer>
        <FloatingLocationCard leafletMap={leafletMap} />
      </div>
    </div>
  )
}

interface MapInitializerProps {
  onMap: (m: LeafletMap) => void
}

const MapInitializer = memo(function MapInitializer({ onMap }: MapInitializerProps) {
  const map = useMap()

  useEffect(() => {
    onMap(map)
    const t = setTimeout(() => {
      map.invalidateSize()
    }, 0)
    return () => clearTimeout(t)
  }, [map, onMap])

  return null
})

const MapPopupContent = memo(function MapPopupContent() {
  return (
    <div className="w-full max-w-[250px]">
      <div className="flex gap-3">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900">Finisterre Gardenz</h3>
          <p className="mt-1 text-xs text-emerald-600">Memorial Park</p>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <div className="inline-flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              <span>24/7 Security</span>
            </div>
            <span className="text-gray-300">•</span>
            <span>150+ acres</span>
          </div>

          <p className="mt-3 text-xs text-gray-600">
            A peaceful, thoughtfully landscaped memorial park set within rolling grounds and native plantings.
          </p>
        </div>
      </div>

      <div className="mt-3 border-t pt-2">
        <p className="text-xs text-gray-500">6QXX+C4 Minglanilla, Cebu</p>
      </div>
    </div>
  )
})

interface FloatingLocationCardProps {
  leafletMap: LeafletMap | null
}

const FloatingLocationCard = memo(function FloatingLocationCard({ leafletMap }: FloatingLocationCardProps) {
  const onExploreClick = () => {
    if (leafletMap) {
      leafletMap.flyTo([CEMETERY_LOCATION.lat, CEMETERY_LOCATION.lng], 18, { duration: 1.5 })
    }
  }

  return (
    <div className="pointer-events-none absolute bottom-2 left-1 z-999">
      <div className="pointer-events-auto ml-1 inline-block max-w-xs rounded-lg border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm">
        <h4 className="text-lg font-semibold text-[var(--brand-primary)]">Finisterre Gardenz</h4>
        <p className="mt-1 text-sm text-gray-600">6QXX+C4 Minglanilla, Cebu</p>
        <div className="mt-3 flex items-center gap-2">
          <Link to="/map">
            <Button onClick={onExploreClick} size="sm" className="bg-[var(--brand-primary)] text-xs text-white hover:bg-[var(--brand-primary)]">
              <MdTravelExplore />
              Explore Map
            </Button>
          </Link>
          <Link to={`/map?to=${CEMETERY_LOCATION.lat},${CEMETERY_LOCATION.lng}`}>
            <Button size="sm" variant="neon" className="text-xs">
              <FaDirections />
              Get Direction
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
})
