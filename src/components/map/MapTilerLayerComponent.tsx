import { useEffect } from 'react'
import { MaptilerLayer } from '@maptiler/leaflet-maptilersdk'
import { useMap } from 'react-leaflet'

interface MapTilerLayerComponentProps {
  apiKey: string
  style: string
}

export default function MapTilerLayerComponent({ apiKey, style }: MapTilerLayerComponentProps) {
  const map = useMap()

  useEffect(() => {
    const layer = new MaptilerLayer({
      apiKey,
      style: `https://api.maptiler.com/maps/${style}/style.json`,
    })

    layer.addTo(map)

    return () => {
      map.removeLayer(layer)
    }
  }, [map, apiKey, style])

  return null
}
