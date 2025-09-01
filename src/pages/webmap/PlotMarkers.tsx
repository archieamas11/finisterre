import L from 'leaflet'
import { memo, useState, useCallback, useContext, useEffect, useRef } from 'react'
import { Marker, Popup } from 'react-leaflet'

import type { ConvertedMarker } from '@/types/map.types'

import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/ui/drawer'
import { LocateContext } from '@/contexts/MapContext'
import { useIsMobile } from '@/hooks/use-mobile'
import ColumbariumPopup from '@/pages/admin/map4admin/ColumbariumPopup'
import PlotLocations from '@/pages/webmap/WebMapPopup'
import { getCategoryBackgroundColor, getStatusColor } from '@/types/map.types'

// Icon caching
const iconCache: Record<string, L.DivIcon> = {}
const getIcon = (color: string, shape: string) => {
  const cacheKey = `${color}-${shape}`
  if (!iconCache[cacheKey]) {
    let html = ''
    switch (shape) {
      case 'square':
        html = `<div class="" style="width: 15px; height: 15px; border-radius: 0; background: ${color}; border: 2px solid #fff; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`
        break
      case 'diamond':
        html = `<div class="" style="width: 15px; height: 15px; background: ${color}; border: 2px solid #fff; box-shadow: 0 0 5px rgba(0,0,0,0.5); transform: rotate(45deg);"></div>`
        break
      default: // circle
        html = `<div class="" style="width: 15px; height: 15px; border-radius: 50%; background: ${color}; border: 2px solid #fff; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`
    }
    iconCache[cacheKey] = L.divIcon({
      className: 'plot-marker-icon',
      iconSize: [15, 15],
      popupAnchor: [0, -5],
      html,
    })
  }
  return iconCache[cacheKey]
}

interface PlotMarkersProps {
  markers: ConvertedMarker[]
  isDirectionLoading: boolean
  onDirectionClick: (to: [number, number]) => void
  block: string
}

const PlotMarkers: React.FC<PlotMarkersProps> = memo(({ markers, isDirectionLoading, onDirectionClick }) => {
  const [openDrawerPlotId, setOpenDrawerPlotId] = useState<string | null>(null)
  const isSmallScreen = useIsMobile()

  // 🎯 Get search context for auto popup functionality
  const locateContext = useContext(LocateContext)
  // const { autoOpenPopupFor, forceClosePopupsToken } = usePopupState()
  const autoOpenPopupFor = locateContext?.autoOpenPopupFor
  const forceClosePopupsToken = locateContext?.forceClosePopupsToken
  const markerRefs = useRef<{ [key: string]: L.Marker | null }>({})

  const idToKey = useCallback((id: string | number) => String(id), [])

  const handleMarkerClick = useCallback(
    (plotId: string | number) => {
      if (!isSmallScreen) return
      requestAnimationFrame(() => {
        setOpenDrawerPlotId(idToKey(plotId))
      })
    },
    [isSmallScreen, idToKey],
  )

  const handleDrawerOpenChange = useCallback(
    (open: boolean, plotId: string | number) => {
      requestAnimationFrame(() => {
        setOpenDrawerPlotId(open ? idToKey(plotId) : null)
      })
    },
    [idToKey],
  )

  // 🎯 Auto-open popup OR drawer when search result is found
  useEffect(() => {
    if (!autoOpenPopupFor) return

    const targetIdKey = idToKey(autoOpenPopupFor)
    const targetMarker = markers.find((m) => idToKey(m.plot_id) === targetIdKey)
    if (!targetMarker) return

    // Mobile + columbarium (rows/columns) => open drawer instead of (hidden) popup
    if (isSmallScreen && targetMarker.rows && targetMarker.columns) {
      // Open drawer immediately (frame deferred for safety)
      requestAnimationFrame(() => {
        setOpenDrawerPlotId(targetIdKey)
        locateContext?.setAutoOpenPopupFor?.(null)
      })
      return
    }

    // Otherwise open the Leaflet popup (desktop or non-columbarium plots)
    const leafletMarker = markerRefs.current[targetIdKey]
    if (leafletMarker) {
      setTimeout(() => {
        leafletMarker.openPopup()
        locateContext?.setAutoOpenPopupFor?.(null)
      }, 200) // Allow render/layout settle before opening popup
    }
  }, [autoOpenPopupFor, isSmallScreen, markers, locateContext, idToKey])

  // Declarative close: when forceClosePopupsToken changes, close any open drawer
  useEffect(() => {
    setOpenDrawerPlotId(null)
  }, [forceClosePopupsToken])

  return (
    <>
      {markers.map((marker) => {
        // Determine marker color: blue for owned plots, otherwise use status color
        const statusColor = marker.is_owned ? '#2563EB' : getStatusColor(marker.plotStatus)

        let shape = 'circle'
        if (marker.category.toLowerCase() === 'chambers') {
          shape = 'square'
        } else if (marker.category.toLowerCase() === 'columbarium') {
          shape = 'diamond'
        }
        const circleIcon = getIcon(statusColor, shape)

        const onDir = () => {
          onDirectionClick(marker.position as [number, number])

          // Use the new context method to request popup close
          // This will close the popup only after route is loaded and flyTo animation completes
          if (locateContext?.requestPopupClose) {
            locateContext.requestPopupClose()
          }

          // Close any open drawer immediately for mobile
          setOpenDrawerPlotId(null)
        }

        return (
          <Marker
            key={`plot-${marker.plot_id}`}
            position={marker.position}
            icon={circleIcon}
            ref={(ref) => {
              if (ref) {
                markerRefs.current[idToKey(marker.plot_id)] = ref
              }
            }}
            eventHandlers={{
              click: () => {
                if (marker.rows && marker.columns) {
                  handleMarkerClick(marker.plot_id)
                }
              },
            }}
          >
            {marker.rows && marker.columns ? (
              <Popup className="leaflet-theme-popup hidden md:block" minWidth={450} closeButton={false}>
                <div className="w-full py-2">
                  <ColumbariumPopup onDirectionClick={onDir} isDirectionLoading={isDirectionLoading} marker={marker} />
                </div>
              </Popup>
            ) : (
              <Popup className="leaflet-theme-popup" minWidth={250} closeButton={false}>
                <PlotLocations backgroundColor={getCategoryBackgroundColor(marker.category)} onDirectionClick={onDir} isDirectionLoading={isDirectionLoading} marker={marker} />
              </Popup>
            )}

            {marker.rows && marker.columns && isSmallScreen ? (
              <Drawer open={openDrawerPlotId === idToKey(marker.plot_id)} onOpenChange={(open) => handleDrawerOpenChange(open, marker.plot_id)}>
                <DrawerContent className="z-9999 max-h-[85vh] overflow-hidden rounded-t-xl md:hidden">
                  <DrawerTitle>
                    <span className="sr-only">Columbarium plot details</span>
                  </DrawerTitle>
                  <DrawerDescription>
                    <span className="sr-only">Columbarium plot details and actions.</span>
                  </DrawerDescription>
                  <div className="max-h-[85vh] touch-pan-y overflow-y-auto overscroll-contain px-2 pt-2 pb-4">
                    <ColumbariumPopup onDirectionClick={onDir} isDirectionLoading={isDirectionLoading} marker={marker} />
                  </div>
                </DrawerContent>
              </Drawer>
            ) : null}
          </Marker>
        )
      })}
    </>
  )
})

export default PlotMarkers
