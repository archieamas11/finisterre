import type { ConvertedMarker } from '@/types/map.types'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import L from 'leaflet'
import { useHotkeys } from 'react-hotkeys-hook'
import { Marker } from 'react-leaflet'
import { toast } from 'sonner'

import { updatePlotCoordinates } from '@/api/plots.api'

interface EditableMarkerProps {
  plotId: string
  position: [number, number]
  icon: L.DivIcon
  children: React.ReactNode
  isEditable: boolean
  isSelected: boolean
  onMarkerClick: (plotId: string) => void
  onEditComplete: () => void
  onSaveSuccess?: () => void
  onPopupOpen?: () => void
  onPopupClose?: () => void
  autoOpenPlotId?: string | null
  registerMarkerRef?: (plotId: string, marker: L.Marker | null) => void
}

export default function EditableMarker({
  plotId,
  position,
  icon,
  children,
  isEditable,
  isSelected,
  onMarkerClick,
  onEditComplete,
  onSaveSuccess,
  onPopupOpen,
  onPopupClose,
  autoOpenPlotId,
  registerMarkerRef,
}: EditableMarkerProps) {
  const markerRef = useRef<L.Marker | null>(null)
  const isDraggingRef = useRef(false)
  const currentPositionRef = useRef<[number, number]>(position)
  const [localPosition, setLocalPosition] = useState<[number, number]>(position)
  const queryClient = useQueryClient()

  useEffect(() => {
    const [currentLat, currentLng] = localPosition
    const [newLat, newLng] = position

    if (currentLat !== newLat || currentLng !== newLng) {
      setLocalPosition(position)
    }
  }, [position, localPosition])

  useEffect(() => {
    if (markerRef.current) {
      const currentLatLng = markerRef.current.getLatLng()
      const [newLat, newLng] = localPosition

      if (currentLatLng.lat !== newLat || currentLatLng.lng !== newLng) {
        markerRef.current.setLatLng(localPosition)
        currentPositionRef.current = localPosition
      }
    }
  }, [localPosition])

  useEffect(() => {
    const m = markerRef.current
    if (registerMarkerRef) {
      registerMarkerRef(plotId, m ?? null)
    }
    return () => {
      if (registerMarkerRef) registerMarkerRef(plotId, null)
    }
  }, [plotId, registerMarkerRef])

  useEffect(() => {
    let style = document.getElementById('selected-marker-styles')
    if (style) return
    style = document.createElement('style')
    style.id = 'selected-marker-styles'
    style.innerHTML = `
      @keyframes markerPulse {
        0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
        100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
      }
      
      .marker-selected {
        animation: markerPulse 1.5s infinite;
        filter: drop-shadow(0 0 8px #3b82f6) brightness(1.2);
        z-index: 1000 !important;
        transition: all 0.3s ease;
      }
      
      .marker-editing-indicator {
        position: absolute;
        top: 45%;
        left: 49%;
        transform: translate(-50%, -50%);
        width: 150%;
        height: 150%;
        border: 3px dashed #3b82f6;
        border-radius: 50%;
        animation: rotate 10s linear infinite;
        z-index: -1;
        pointer-events: none;
      }
      
      @keyframes rotate {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to { transform: translate(-50%, -50%) rotate(360deg); }
      }
      
      .leaflet-marker-draggable {
        cursor: move !important;
      }
    `
    document.head.appendChild(style)
  }, [])

  const markerIcon = useMemo(() => {
    if (!isSelected || !isEditable) {
      return icon
    }
    let originalHtml = ''
    if (typeof icon.options.html === 'string') {
      originalHtml = icon.options.html
    } else if (icon.options.html && typeof icon.options.html === 'object' && 'outerHTML' in icon.options.html) {
      originalHtml = (icon.options.html as HTMLElement).outerHTML
    }
    const enhancedHtml = `
      <div style="position: relative; display: inline-block;">
        ${originalHtml}
        <div class="marker-editing-indicator"></div>
      </div>
    `
    return L.divIcon({
      ...icon.options,
      html: enhancedHtml,
      className: `${icon.options.className || ''} marker-selected`.trim(),
    })
  }, [icon, isSelected, isEditable])

  const updateCoordinatesMutation = useMutation({
    mutationFn: async ({ plot_id, coordinates }: { plot_id: string; coordinates: string }) => {
      return updatePlotCoordinates(plot_id, coordinates)
    },
    onMutate: async ({ plot_id, coordinates }) => {
      await queryClient.cancelQueries({ queryKey: ['plots'] })
      await queryClient.cancelQueries({ queryKey: ['plotDetails', plot_id] })

      const previousPlots = queryClient.getQueryData<ConvertedMarker[]>(['plots'])
      const previousPlotsClone = previousPlots ? JSON.parse(JSON.stringify(previousPlots)) : undefined

      const parts = String(coordinates)
        .split(',')
        .map((s) => parseFloat(s.trim()))
      const [lng, lat] = parts.length >= 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1]) ? [parts[0], parts[1]] : [undefined, undefined]

      if (lat !== undefined && lng !== undefined) {
        setLocalPosition([lat, lng])
        currentPositionRef.current = [lat, lng]
      }

      if (previousPlots) {
        queryClient.setQueryData(['plots'], (old: ConvertedMarker[] | undefined) => {
          if (!old) return old
          return old.map((plot: ConvertedMarker) =>
            plot.plot_id === plot_id
              ? {
                  ...plot,
                  // change the exact field your UI reads. keep the string too if needed.
                  coordinates: `${lng}, ${lat}`,
                  position: lat !== undefined && lng !== undefined ? [lat, lng] : plot.position,
                }
              : plot,
          )
        })
      }

      return { previousPlots: previousPlotsClone }
    },

    onError: (_err, _variables, context) => {
      if (context?.previousPlots) {
        queryClient.setQueryData(['plots'], context.previousPlots)
      }
      setLocalPosition(position)
      currentPositionRef.current = position
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['plots'] })
      if (variables?.plot_id) {
        queryClient.invalidateQueries({
          queryKey: ['plotDetails', variables.plot_id],
        })
      }
    },
    onSuccess: () => {
      onSaveSuccess?.()
    },
  })

  const savePosition = useCallback(async () => {
    const [lat, lng] = currentPositionRef.current
    try {
      await toast.promise(
        updateCoordinatesMutation.mutateAsync({
          plot_id: plotId,
          coordinates: `${lng}, ${lat}`,
        }),
        {
          loading: 'Updating marker position...',
          success: 'Marker position updated.',
          error: 'Failed to update marker position.',
        },
      )
    } catch (e) {}
  }, [plotId, updateCoordinatesMutation])

  const cancelEditing = useCallback(() => {
    setLocalPosition(position)
    onEditComplete()
  }, [position, onEditComplete])

  useHotkeys(
    'enter, escape',
    (event) => {
      if (!isSelected) return
      const key = (event as KeyboardEvent).key
      if (key === 'Enter') {
        event.preventDefault()
        void savePosition()
      } else if (key === 'Escape') {
        event.preventDefault()
        cancelEditing()
      }
    },
    { enabled: isSelected },
    [isSelected, savePosition, cancelEditing],
  )

  useEffect(() => {
    const marker = markerRef.current
    if (!marker) return

    marker.off('dragstart').off('drag').off('dragend')

    if (isSelected && isEditable) {
      if (!marker.dragging?.enabled()) {
        marker.dragging?.enable()
      }

      marker.on('dragstart', () => {
        isDraggingRef.current = true
      })

      marker.on('drag', (e) => {
        const { lat, lng } = e.target.getLatLng()
        currentPositionRef.current = [lat, lng]
      })

      marker.on('dragend', () => {
        isDraggingRef.current = false
      })

      const mapContainer = document.querySelector('.leaflet-container') as HTMLElement
      if (mapContainer && mapContainer.getAttribute('tabindex') !== '0') {
        mapContainer.setAttribute('tabindex', '0')
        mapContainer.style.outline = 'none'
      }
    } else {
      if (marker.dragging?.enabled()) {
        marker.dragging?.disable()
      }
    }
  }, [isSelected, isEditable, savePosition])

  useEffect(() => {
    const marker = markerRef.current
    if (!autoOpenPlotId) return
    if (!marker) {
      console.log('[EditableMarker] auto-open skipped: no marker ref', { plotId, autoOpenPlotId, isEditable })
      return
    }
    if (autoOpenPlotId !== plotId) {
      return
    }
    if (isEditable) {
      console.log('[EditableMarker] auto-open skipped (edit mode active)', { plotId })
      return
    }

    let cancelled = false
    let attempts = 0

    const tryOpen = () => {
      if (cancelled) return
      const popup = marker.getPopup?.()
      const onMap = Boolean((marker as any)._map)
      console.log('[EditableMarker] tryOpen', { plotId, attempts, hasPopup: Boolean(popup), onMap })
      if (!popup || !onMap) {
        attempts += 1
        if (attempts < 15) {
          window.setTimeout(tryOpen, 100)
        }
        return
      }

      try {
        if (marker.isPopupOpen()) {
          console.log('[EditableMarker] popup already open → invoking onPopupOpen', { plotId })
          onPopupOpen?.()
        } else {
          console.log('[EditableMarker] opening popup', { plotId })
          marker.openPopup()
          window.setTimeout(() => {
            if (!marker.isPopupOpen()) {
              console.log('[EditableMarker] openPopup had no effect, firing click()', { plotId })
              try {
                marker.fire('click')
              } catch {}
            }
          }, 80)
        }
      } catch {
        // no-op
      }
    }

    const immediate = window.setTimeout(tryOpen, 120)
    marker.once('add', tryOpen)

    return () => {
      cancelled = true
      window.clearTimeout(immediate)
      marker.off('add', tryOpen)
    }
  }, [autoOpenPlotId, plotId, isEditable, onPopupOpen])

  const handleMarkerClick = useCallback(() => {
    if (isDraggingRef.current) return
    if (isEditable) {
      onMarkerClick(plotId)
      setTimeout(() => {
        const mapContainer = document.querySelector('.leaflet-container') as HTMLElement
        if (mapContainer) {
          mapContainer.focus()
        }
      }, 0)
    }
  }, [isEditable, onMarkerClick, plotId])

  const eventHandlers = useMemo(() => {
    const handlers: Record<string, () => void> = {
      click: function () {
        console.log('[EditableMarker] click plot', plotId, 'editable', isEditable, 'selected', isSelected)
        handleMarkerClick()
      },
    }
    if (!isEditable) {
      if (onPopupOpen)
        handlers.popupopen = function () {
          console.log('[EditableMarker] popupopen plot', plotId)
          onPopupOpen()
        }
      if (onPopupClose)
        handlers.popupclose = function () {
          console.log('[EditableMarker] popupclose plot', plotId)
          onPopupClose()
        }
    }
    return handlers
  }, [handleMarkerClick, isEditable, onPopupOpen, onPopupClose])

  return (
    <Marker ref={markerRef} position={localPosition} icon={markerIcon} eventHandlers={eventHandlers} draggable={isSelected && isEditable}>
      {!isEditable && children}
    </Marker>
  )
}
