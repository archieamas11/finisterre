import { Award, CheckCircle, Clock, MapPin, XCircle } from 'lucide-react'

// types (last)
import type { ConvertedMarker } from '@/types/map.types'

import { Badge } from '@/components/ui/badge'
import { CardHeader, Card, CardTitle, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export default function PlotInfo({ marker }: { marker: ConvertedMarker }) {
  return (
    <>
      {/* Left Column - Plot Info */}
      <Card className="h-83">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm leading-0">
            <MapPin className="text-primary h-4 w-4" />
            Plot Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          {/* Location */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-medium">Location</span>
            </div>
            <span className="font-semibold">{marker?.location ?? 'N/A'}</span>
          </div>
          <Separator />

          {/* Status and Category - Row layout */}
          <div className="grid grid-cols-2 gap-2 py-2">
            <div className="text-center">
              <p className="text-muted-foreground mb-1 text-xs">Status</p>
              <Badge
                variant={marker?.plotStatus === 'available' ? 'default' : marker?.plotStatus === 'reserved' ? 'secondary' : 'destructive'}
                className="text-xs"
              >
                {marker?.plotStatus === 'available' && <CheckCircle className="h-2 w-2" />}
                {marker?.plotStatus === 'reserved' && <Clock className="h-2 w-2" />}
                {marker?.plotStatus === 'occupied' && <XCircle className="h-2 w-2" />}
                {marker?.plotStatus ?? 'N/A'}
              </Badge>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground mb-1 text-xs">Category</p>
              <Badge
                variant="outline"
                className={cn(
                  'text-xs',
                  marker?.category === 'bronze' && 'border-amber-400 text-amber-700',
                  marker?.category === 'silver' && 'border-gray-400 text-gray-700',
                  marker?.category === 'platinum' && 'border-yellow-400 text-yellow-700',
                  marker?.category === 'diamond' && 'border-pink-400 text-pink-700',
                  !['bronze', 'silver', 'platinum', 'diamond'].includes(marker?.category ?? '') && 'border-gray-300 text-gray-600',
                )}
              >
                <Award className="h-2 w-2" />
                {marker?.category ? marker.category.charAt(0).toUpperCase() + marker.category.slice(1) : 'N/A'}
              </Badge>
            </div>
          </div>
          <Separator />

          {/* Dimensions - Improved Design */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs font-medium">Dimensions</span>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 text-xs font-semibold">
                <span>
                  {isNaN(Number(marker?.dimensions?.length)) || marker?.dimensions?.length === undefined || marker?.dimensions?.length === null
                    ? 'N/A'
                    : marker.dimensions.length}
                  m
                </span>
                <span className="text-muted-foreground">×</span>
                <span>
                  {isNaN(Number(marker?.dimensions?.width)) || marker?.dimensions?.width === undefined || marker?.dimensions?.width === null
                    ? 'N/A'
                    : marker.dimensions.width}
                  m
                </span>
                <span className="text-muted-foreground">×</span>
                <span>
                  {isNaN(Number(marker?.dimensions?.area)) || marker?.dimensions?.area === undefined || marker?.dimensions?.area === null
                    ? 'N/A'
                    : marker.dimensions.area.toLocaleString()}
                  m²
                </span>
              </div>
              <div className="text-muted-foreground mt-1 text-[10px]">Length × Width × Area</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
