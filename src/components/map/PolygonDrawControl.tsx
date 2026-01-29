import type L from 'leaflet'
import 'leaflet-draw'
import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'

interface PolygonDrawControlProps {
  isActive: boolean
  onPolygonComplete: (latLngs: L.LatLng[]) => void
}

export default function PolygonDrawControl({ isActive, onPolygonComplete }: PolygonDrawControlProps) {
  const map = useMap()
  const drawControlRef = useRef<L.Control.Draw | null>(null)
  const drawnLayerRef = useRef<L.Polygon | null>(null)

  useEffect(() => {
    if (!isActive) {
      // Clean up any existing polygon and control
      if (drawnLayerRef.current) {
        map.removeLayer(drawnLayerRef.current)
        drawnLayerRef.current = null
      }
      if (drawControlRef.current) {
        map.removeControl(drawControlRef.current)
        drawControlRef.current = null
      }
      return
    }

    // Create feature group to store drawn items
    const drawnItems = new (window.L as any).FeatureGroup()
    map.addLayer(drawnItems)

    // Add drawing control
    const drawControl = new (window.L as any).Control.Draw({
      draw: {
        polygon: {
          allowIntersection: false,
          shapeOptions: {
            color: '#3b82f6',
            weight: 2,
            fillOpacity: 0.1,
          },
        },
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: drawnItems,
        remove: false,
      },
    })

    map.addControl(drawControl)
    drawControlRef.current = drawControl

    // Handle polygon creation
    const handleCreated = (e: any) => {
      const layer = e.layer as L.Polygon
      drawnItems.addLayer(layer)
      drawnLayerRef.current = layer

      // Get polygon coordinates
      const latLngs = layer.getLatLngs()[0] as L.LatLng[]
      onPolygonComplete(latLngs)

      // Remove the polygon after a short delay to show selection
      setTimeout(() => {
        if (drawnLayerRef.current) {
          map.removeLayer(drawnLayerRef.current)
          drawnLayerRef.current = null
        }
      }, 1000)
    }

    map.on((window.L as any).Draw.Event.CREATED, handleCreated)

    return () => {
      map.off((window.L as any).Draw.Event.CREATED, handleCreated)
      map.removeLayer(drawnItems)
      if (drawControlRef.current) {
        map.removeControl(drawControlRef.current)
        drawControlRef.current = null
      }
      if (drawnLayerRef.current) {
        map.removeLayer(drawnLayerRef.current)
        drawnLayerRef.current = null
      }
    }
  }, [isActive, map, onPolygonComplete])

  return null
}
