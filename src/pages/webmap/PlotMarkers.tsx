import L from 'leaflet'
import { memo, useState, useCallback } from 'react'
import { Marker, Popup } from 'react-leaflet'

import type { ConvertedMarker } from '@/types/map.types'

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle
} from '@/components/ui/drawer'
import ColumbariumPopup from '@/pages/admin/map4admin/ColumbariumPopup'
import PlotLocations from '@/pages/webmap/WebMapPopup'
import { getCategoryBackgroundColor, getStatusColor } from '@/types/map.types'

// Icon caching
const iconCache: Record<string, L.DivIcon> = {}
const getIcon = (color: string) => {
  if (!iconCache[color]) {
    iconCache[color] = L.divIcon({
      className: 'plot-marker-icon',
      iconSize: [15, 15],
      html: `<div class="" style="width: 15px; height: 15px; border-radius: 50%; background: ${color}; border: 2px solid #fff; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`
    })
  }
  return iconCache[color]
}

interface PlotMarkersProps {
  markers: ConvertedMarker[]
  isDirectionLoading: boolean
  onDirectionClick: (to: [number, number]) => void
  block: string
}

const PlotMarkers: React.FC<PlotMarkersProps> = memo(
  ({ markers, isDirectionLoading, onDirectionClick }) => {
    const [openDrawerPlotId, setOpenDrawerPlotId] = useState<
      string | number | null
    >(null)

    const handleMarkerClick = useCallback((plotId: string | number) => {
      requestAnimationFrame(() => {
        setOpenDrawerPlotId(plotId)
      })
    }, [])

    const handleDrawerOpenChange = useCallback(
      (open: boolean, plotId: string | number) => {
        requestAnimationFrame(() => {
          setOpenDrawerPlotId(open ? plotId : null)
        })
      },
      []
    )

    return (
      <>
        {markers.map((marker) => {
          const statusColor = getStatusColor(marker.plotStatus)
          const circleIcon = getIcon(statusColor)

          const onDir = () =>
            onDirectionClick(marker.position as [number, number])

          return (
            <Marker
              key={`plot-${marker.plot_id}`}
              position={marker.position}
              icon={circleIcon}
              eventHandlers={{
                click: () => {
                  if (marker.rows && marker.columns) {
                    handleMarkerClick(marker.plot_id)
                  }
                }
              }}
            >
              {marker.rows && marker.columns ? (
                <Popup
                  className='leaflet-theme-popup hidden md:block'
                  minWidth={450}
                  closeButton={false}
                >
                  <div className='w-full py-2'>
                    <ColumbariumPopup
                      onDirectionClick={onDir}
                      isDirectionLoading={isDirectionLoading}
                      marker={marker}
                    />
                  </div>
                </Popup>
              ) : (
                <Popup
                  className='leaflet-theme-popup'
                  minWidth={250}
                  closeButton={false}
                >
                  <PlotLocations
                    backgroundColor={getCategoryBackgroundColor(
                      marker.category
                    )}
                    onDirectionClick={onDir}
                    isDirectionLoading={isDirectionLoading}
                    marker={marker}
                  />
                </Popup>
              )}

              {marker.rows && marker.columns ? (
                <Drawer
                  open={openDrawerPlotId === marker.plot_id}
                  onOpenChange={(open) =>
                    handleDrawerOpenChange(open, marker.plot_id)
                  }
                >
                  <DrawerContent className='z-9999 max-h-[85vh] overflow-hidden rounded-t-xl md:hidden'>
                    <DrawerTitle>
                      <span className='sr-only'>Columbarium plot details</span>
                    </DrawerTitle>
                    <DrawerDescription>
                      <span className='sr-only'>
                        Columbarium plot details and actions.
                      </span>
                    </DrawerDescription>
                    <div className='max-h-[85vh] touch-pan-y overflow-y-auto overscroll-contain px-2 pt-2 pb-4'>
                      <ColumbariumPopup
                        onDirectionClick={onDir}
                        isDirectionLoading={isDirectionLoading}
                        marker={marker}
                      />
                    </div>
                  </DrawerContent>
                </Drawer>
              ) : null}
            </Marker>
          )
        })}
      </>
    )
  }
)

export default PlotMarkers
