import { MapPin, User, Calendar, Ruler } from 'lucide-react'
import { Popup } from 'react-map-gl/maplibre'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import type { PlotFeatureProps } from './buildGeoJSON'

type PlotPopupProps = {
  coords: [number, number]
  props: PlotFeatureProps
  onClose: () => void
  onGetDirections?: (destination: [number, number]) => void
}

export function PlotPopup({ coords, props, onClose, onGetDirections }: PlotPopupProps) {
  return (
    <Popup anchor="bottom" longitude={coords[0]} latitude={coords[1]} onClose={onClose} closeOnClick={false} className="rounded-lg shadow-lg">
      <div className="bg-card text-card-foreground max-w-sm rounded-lg border p-4">
        {/* Header */}

        {/* Get direction button */}
        <Button onClick={() => onGetDirections?.(coords)}>Get Direction</Button>
        <div className="mb-3 flex items-center gap-2">
          <MapPin className="text-primary h-4 w-4" />
          <h3 className="text-lg font-semibold">{props.location}</h3>
        </div>

        {/* Status and Category */}
        <div className="mb-3 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground text-sm font-medium">Category:</span>
            <span className="text-sm">{props.category}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground text-sm font-medium">Status:</span>
            <span
              className={cn('rounded-full px-2 py-1 text-xs font-medium', {
                'bg-green-100 text-green-800': props.plotStatus === 'Available',
                'bg-red-100 text-red-800': props.plotStatus === 'Occupied',
                'bg-yellow-100 text-yellow-800': props.plotStatus === 'Reserved',
              })}
            >
              {props.plotStatus}
            </span>
          </div>
        </div>

        {/* Deceased Info */}
        {props.deceased.dead_fullname && (
          <div className="bg-muted/50 mb-3 rounded-md p-2">
            <div className="mb-1 flex items-center gap-1">
              <User className="text-muted-foreground h-3 w-3" />
              <span className="text-sm font-medium">Deceased</span>
            </div>
            <p className="text-sm">{props.deceased.dead_fullname}</p>
            {props.deceased.dead_interment && (
              <div className="mt-1 flex items-center gap-1">
                <Calendar className="text-muted-foreground h-3 w-3" />
                <span className="text-muted-foreground text-xs">Interment: {props.deceased.dead_interment}</span>
              </div>
            )}
          </div>
        )}

        {/* Owner Info */}
        {props.owner.fullname && (
          <div className="bg-muted/50 mb-3 rounded-md p-2">
            <div className="mb-1 flex items-center gap-1">
              <User className="text-muted-foreground h-3 w-3" />
              <span className="text-sm font-medium">Owner</span>
            </div>
            <p className="text-sm">{props.owner.fullname}</p>
            {props.owner.email && <p className="text-muted-foreground text-xs">{props.owner.email}</p>}
            {props.owner.contact && <p className="text-muted-foreground text-xs">{props.owner.contact}</p>}
          </div>
        )}

        {/* Dimensions and Location */}
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center gap-1">
            <Ruler className="text-muted-foreground h-3 w-3" />
            <span className="text-sm">
              Dimensions: {props.dimensions.length} x {props.dimensions.width} ({props.dimensions.area} sqm)
            </span>
          </div>
          {props.rows && <div className="text-muted-foreground text-sm">Row: {props.rows}</div>}
          {props.columns && <div className="text-muted-foreground text-sm">Column: {props.columns}</div>}
        </div>
      </div>
    </Popup>
  )
}
