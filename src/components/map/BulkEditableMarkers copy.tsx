import type { ConvertedMarker } from '@/types/map.types'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { point, polygon as turfPolygon } from '@turf/helpers'
import L from 'leaflet'
import { useHotkeys } from 'react-hotkeys-hook'
import { useMap } from 'react-leaflet'
import { toast } from 'sonner'

import { useBulkUpdateCoordinates } from '@/hooks/useBulkUpdateCoordinates'

interface BulkEditableMarkersProps {
  markers: ConvertedMarker[]
  selectedPlotIds: Set<string>
  onSelectionComplete: () => void
  markerRegistryRef: React.MutableRefObject<Record<string, L.Marker | null>>
}

/**
 * BulkEditableMarkers - Manages bulk marker editing behavior
 *
 * Workflow:
 * 1. Markers are selected via polygon (handled externally)
 * 2. User clicks and drags on the map to move all selected markers
 * 3. Markers move in real-time following the cursor
 * 4. On mouse release, markers stay at new position
 * 5. Press Enter to save, Escape to cancel
 */
export default function BulkEditableMarkers({ markers, selectedPlotIds, onSelectionComplete, markerRegistryRef }: BulkEditableMarkersProps) {
  const map = useMap()
  const bulkUpdateMutation = useBulkUpdateCoordinates()

  // Track positions - original (for cancel) and current (for save)
  const originalPositionsRef = useRef<Map<string, [number, number]>>(new Map())
  const currentPositionsRef = useRef<Map<string, [number, number]>>(new Map())

  // Drag state
  const [hasDragged, setHasDragged] = useState(false)
  const isDraggingRef = useRef(false)
  const dragStartLatLngRef = useRef<L.LatLng | null>(null)

  // Get selected markers data
  const selectedMarkers = useMemo(() => {
    return markers.filter((m) => selectedPlotIds.has(m.plot_id))
  }, [markers, selectedPlotIds])

  // Initialize original positions when selection changes
  useEffect(() => {
    if (selectedPlotIds.size === 0) {
      originalPositionsRef.current.clear()
      currentPositionsRef.current.clear()
      setHasDragged(false)
      return
    }

    const positions = new Map<string, [number, number]>()
    selectedMarkers.forEach((marker) => {
      positions.set(marker.plot_id, [...marker.position] as [number, number])
    })
    originalPositionsRef.current = new Map(positions)
    currentPositionsRef.current = new Map(positions)
    setHasDragged(false)

    console.log('[BulkEdit] Initialized positions for', selectedPlotIds.size, 'markers')
  }, [selectedMarkers, selectedPlotIds])

  // Inject CSS for selected markers
  useEffect(() => {
    const styleId = 'bulk-edit-marker-styles'
    let style = document.getElementById(styleId) as HTMLStyleElement | null

    if (!style) {
      style = document.createElement('style')
      style.id = styleId
      document.head.appendChild(style)
    }

    style.textContent = `
      .marker-bulk-selected {
        z-index: 1000 !important;
        filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.9)) brightness(1.1);
        cursor: move !important;
      }
      .marker-bulk-selected > * {
        cursor: move !important;
      }
      .leaflet-container.bulk-dragging {
        cursor: grabbing !important;
      }
      .leaflet-container.bulk-dragging * {
        cursor: grabbing !important;
      }
    `

    return () => {
      if (style && style.parentNode) {
        style.parentNode.removeChild(style)
      }
    }
  }, [])

  // Apply visual styling to selected markers
  useEffect(() => {
    const plotIds = Array.from(selectedPlotIds)

    plotIds.forEach((plotId) => {
      const leafletMarker = markerRegistryRef.current[plotId]
      if (leafletMarker) {
        const el = leafletMarker.getElement()
        if (el) {
          el.classList.add('marker-bulk-selected')
        }
        // Close popup if open
        leafletMarker.closePopup()
      }
    })

    return () => {
      plotIds.forEach((plotId) => {
        const leafletMarker = markerRegistryRef.current[plotId]
        if (leafletMarker) {
          const el = leafletMarker.getElement()
          if (el) {
            el.classList.remove('marker-bulk-selected')
          }
        }
      })
    }
  }, [selectedPlotIds, markerRegistryRef])

  // Move all selected markers by delta
  const moveMarkersByDelta = useCallback(
    (deltaLat: number, deltaLng: number) => {
      const newPositions = new Map<string, [number, number]>()

      originalPositionsRef.current.forEach((originalPos, plotId) => {
        const [origLat, origLng] = originalPos
        const newLat = origLat + deltaLat
        const newLng = origLng + deltaLng

        newPositions.set(plotId, [newLat, newLng])

        // Update the actual Leaflet marker
        const leafletMarker = markerRegistryRef.current[plotId]
        if (leafletMarker) {
          leafletMarker.setLatLng([newLat, newLng])
        }
      })

      currentPositionsRef.current = newPositions
    },
    [markerRegistryRef],
  )

  // Revert markers to original positions
  const revertPositions = useCallback(() => {
    originalPositionsRef.current.forEach((originalPos, plotId) => {
      const leafletMarker = markerRegistryRef.current[plotId]
      if (leafletMarker) {
        leafletMarker.setLatLng(originalPos)
      }
    })
    currentPositionsRef.current = new Map(originalPositionsRef.current)
  }, [markerRegistryRef])

  // Cancel editing
  const cancelEdit = useCallback(() => {
    console.log('[BulkEdit] Cancelling edit')
    revertPositions()
    setHasDragged(false)
    isDraggingRef.current = false
    dragStartLatLngRef.current = null
    map.dragging.enable()
    map.getContainer().classList.remove('bulk-dragging')
    toast.info('Bulk edit cancelled')
    onSelectionComplete()
  }, [revertPositions, map, onSelectionComplete])

  // Save positions to backend
  const savePositions = useCallback(async () => {
    if (selectedPlotIds.size === 0) {
      console.log('[BulkEdit] No markers selected')
      return
    }

    // Build updates array by comparing current to original
    const updates: Array<{ plot_id: string; coordinates: string }> = []

    currentPositionsRef.current.forEach((currentPos, plotId) => {
      const originalPos = originalPositionsRef.current.get(plotId)
      if (!originalPos) return

      const [origLat, origLng] = originalPos
      const [currLat, currLng] = currentPos

      // Only include if position actually changed
      const latChanged = Math.abs(origLat - currLat) > 1e-8
      const lngChanged = Math.abs(origLng - currLng) > 1e-8

      if (latChanged || lngChanged) {
        updates.push({
          plot_id: plotId,
          coordinates: `${currLng}, ${currLat}`, // Backend expects "lng, lat"
        })
      }
    })

    if (updates.length === 0) {
      console.log('[BulkEdit] No position changes detected')
      toast.info('No changes to save')
      onSelectionComplete()
      return
    }

    console.log('[BulkEdit] Saving', updates.length, 'position updates:', updates)

    try {
      await toast.promise(bulkUpdateMutation.mutateAsync(updates), {
        loading: `Updating ${updates.length} marker${updates.length > 1 ? 's' : ''}...`,
        success: `Updated ${updates.length} marker${updates.length > 1 ? 's' : ''} successfully`,
        error: 'Failed to update markers',
      })

      setHasDragged(false)
      onSelectionComplete()
    } catch (error) {
      console.error('[BulkEdit] Save failed:', error)
      revertPositions()
    }
  }, [selectedPlotIds, bulkUpdateMutation, onSelectionComplete, revertPositions])

  // Keyboard shortcuts
  useHotkeys(
    'enter',
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (selectedPlotIds.size > 0) {
        console.log('[BulkEdit] Enter pressed - saving')
        savePositions()
      }
    },
    {
      enabled: selectedPlotIds.size > 0,
      enableOnFormTags: true,
      enableOnContentEditable: true,
    },
    [savePositions, selectedPlotIds],
  )

  useHotkeys(
    'escape',
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (selectedPlotIds.size > 0) {
        console.log('[BulkEdit] Escape pressed - cancelling')
        cancelEdit()
      }
    },
    {
      enabled: selectedPlotIds.size > 0,
      enableOnFormTags: true,
      enableOnContentEditable: true,
    },
    [cancelEdit, selectedPlotIds],
  )

  // Main drag handling effect
  useEffect(() => {
    if (selectedPlotIds.size === 0) return

    const container = map.getContainer()

    const onMouseDown = (e: MouseEvent) => {
      // Check if clicked on a selected marker
      const target = e.target as HTMLElement
      const isOnSelectedMarker = target.closest('.marker-bulk-selected')

      if (!isOnSelectedMarker) return

      console.log('[BulkEdit] Mouse down on selected marker')

      e.preventDefault()
      e.stopPropagation()

      // Get the click position in lat/lng
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const containerPoint = L.point(x, y)
      const latlng = map.containerPointToLatLng(containerPoint)

      isDraggingRef.current = true
      dragStartLatLngRef.current = latlng

      map.dragging.disable()
      container.classList.add('bulk-dragging')
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !dragStartLatLngRef.current) return

      // Get current mouse position in lat/lng
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const containerPoint = L.point(x, y)
      const currentLatLng = map.containerPointToLatLng(containerPoint)

      // Calculate delta from drag start
      const deltaLat = currentLatLng.lat - dragStartLatLngRef.current.lat
      const deltaLng = currentLatLng.lng - dragStartLatLngRef.current.lng

      // Move all markers
      moveMarkersByDelta(deltaLat, deltaLng)
      setHasDragged(true)
    }

    const onMouseUp = () => {
      if (!isDraggingRef.current) return

      console.log('[BulkEdit] Mouse up - drag ended, hasDragged:', hasDragged)

      isDraggingRef.current = false
      dragStartLatLngRef.current = null

      map.dragging.enable()
      container.classList.remove('bulk-dragging')

      // Show instruction toast if markers were moved
      if (currentPositionsRef.current.size > 0) {
        // Check if any positions actually changed
        let anyChanged = false
        currentPositionsRef.current.forEach((currPos, plotId) => {
          const origPos = originalPositionsRef.current.get(plotId)
          if (origPos) {
            const [origLat, origLng] = origPos
            const [currLat, currLng] = currPos
            if (Math.abs(origLat - currLat) > 1e-8 || Math.abs(origLng - currLng) > 1e-8) {
              anyChanged = true
            }
          }
        })

        if (anyChanged) {
          toast.info('Press Enter to save, Escape to cancel', { duration: 4000 })
        }
      }
    }

    // Use capture phase to intercept before Leaflet
    document.addEventListener('mousedown', onMouseDown, true)
    document.addEventListener('mousemove', onMouseMove, true)
    document.addEventListener('mouseup', onMouseUp, true)

    return () => {
      document.removeEventListener('mousedown', onMouseDown, true)
      document.removeEventListener('mousemove', onMouseMove, true)
      document.removeEventListener('mouseup', onMouseUp, true)

      // Cleanup
      map.dragging.enable()
      container.classList.remove('bulk-dragging')
    }
  }, [map, selectedPlotIds, moveMarkersByDelta, hasDragged])

  // Show initial instruction when markers are selected
  useEffect(() => {
    if (selectedPlotIds.size > 0) {
      toast.info(`${selectedPlotIds.size} marker${selectedPlotIds.size > 1 ? 's' : ''} selected. Drag to reposition.`, {
        duration: 3000,
      })
    }
  }, [selectedPlotIds.size])

  return null
}

// Utility to detect markers in polygon
export function getMarkersInPolygon(markers: ConvertedMarker[], polygonLatLngs: L.LatLng[]): string[] {
  if (polygonLatLngs.length < 3) return []

  try {
    // Convert Leaflet LatLngs to Turf polygon (note: Turf uses [lng, lat])
    const turfCoords: Array<[number, number]> = polygonLatLngs.map((ll) => [ll.lng, ll.lat] as [number, number])
    turfCoords.push(turfCoords[0]) // Close the polygon
    const poly = turfPolygon([turfCoords])

    const selectedIds: string[] = []

    markers.forEach((marker) => {
      const [lat, lng] = marker.position
      const pt = point([lng, lat])

      if (booleanPointInPolygon(pt, poly)) {
        selectedIds.push(marker.plot_id)
      }
    })

    return selectedIds
  } catch (error) {
    console.error('[getMarkersInPolygon] Error:', error)
    return []
  }
}
