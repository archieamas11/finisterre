import React from 'react'
import { RiBuilding4Line } from 'react-icons/ri'
import type { LotInfo } from '@/api/customer.api'
import { Badge } from '@/components/ui/badge'
import { ucwords } from '@/lib/format'
import { DeceasedInfoCard } from './DeceasedInfoCard'
import { PropertyActions } from './PropertyActions'

interface PropertyDeceasedCardProps {
  lot: LotInfo
  onViewMap: (lot: LotInfo) => void
  onOpenProperties: (lot: LotInfo) => void
}

export function PropertyDeceasedCard({ lot, onViewMap, onOpenProperties }: PropertyDeceasedCardProps) {
  // Normalize to [lat, lng]. If incoming is [lng, lat], swap based on value ranges.
  const toLatLng = React.useCallback((coords?: unknown): [number, number] | null => {
    if (coords == null) return null

    const extractNumbers = (input: unknown): number[] => {
      if (Array.isArray(input))
        return input
          .slice(0, 2)
          .map((v) => (typeof v === 'string' ? parseFloat(v) : Number(v)))
          .filter((n) => !Number.isNaN(n))
      if (typeof input === 'object') {
        const o = input as Record<string, unknown>
        if (o.lat !== undefined && o.lng !== undefined) return [Number(o.lat), Number(o.lng)].filter((n) => !Number.isNaN(n))
        if (o.latitude !== undefined && o.longitude !== undefined) return [Number(o.latitude), Number(o.longitude)].filter((n) => !Number.isNaN(n))
        if (o.x !== undefined && o.y !== undefined) return [Number(o.y), Number(o.x)].filter((n) => !Number.isNaN(n))
      }
      if (typeof input === 'string') {
        const s = input
          .trim()
          .replace(/^POINT\s*\(/i, '')
          .replace(/\)$/, '')
        const parts = s.split(/\s*,\s*|\s+/).filter(Boolean)
        return parts
          .map((p) => parseFloat(p))
          .filter((n) => !Number.isNaN(n))
          .slice(0, 2)
      }
      return []
    }

    const nums = extractNumbers(coords)
    if (nums.length < 2) return null

    const [a, b] = nums
    const isLngLat = Math.abs(a) > 90 && Math.abs(b) <= 90
    return isLngLat ? [b, a] : [a, b]
  }, [])

  const coordsLatLng = toLatLng(lot.coordinates)
  const plotIdentifier = lot.plot_id ?? lot.lot_plot_id
  const isViewDisabled = plotIdentifier == null

  const handleViewMap = React.useCallback(() => {
    if (isViewDisabled) return
    onViewMap(lot)
  }, [isViewDisabled, lot, onViewMap])

  const handleOpenProperties = React.useCallback(() => {
    onOpenProperties(lot)
  }, [lot, onOpenProperties])

  const hasGraveLot = lot.block != null && lot.block !== '' && lot.lot_plot_id != null
  const hasNiche = lot.category != null && lot.category !== '' && lot.niche_number != null
  const hasDeceased = Array.isArray(lot.deceased_info) && lot.deceased_info.length > 0

  const locationLabel = hasGraveLot
    ? `Block ${lot.block ?? ''} Grave ${lot.lot_plot_id ?? ''}`
    : hasNiche
      ? `${lot.category ?? ''} ${lot.plot_id ?? ''} Niche ${lot.niche_number ?? ''}`
      : 'Unknown location'

  const lotStatusBadge: Record<string, string> = {
    Active: 'bg-amber-200 text-amber-800',
    Completed: 'bg-emerald-200 text-emerald-800',
    Cancelled: 'bg-rose-200 text-rose-800',
  }

  return (
    <div className="bg-card space-y-4 rounded-lg border p-4">
      {/* Property Information Header */}
      <div className="flex items-center justify-between border-b pb-2">
        <h4 className="flex items-center gap-2 text-sm font-medium">Property Information</h4>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {ucwords(lot.lot_status ?? '') && <Badge className={lotStatusBadge[ucwords(lot.lot_status ?? '')]}>{ucwords(lot.lot_status ?? '')}</Badge>}
        </div>
      </div>

      {/* Property Details */}
      <div className="space-y-2">
        {hasGraveLot && (
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary rounded p-2 text-sm">
                <RiBuilding4Line />
              </div>
              <div className="leading-none">
                <p className="font-medium">Block {lot.block}</p>
                <p className="text-muted-foreground text-sm">Grave {lot.lot_plot_id}</p>
              </div>
            </div>
            <PropertyActions
              coordsLatLng={coordsLatLng}
              locationLabel={locationLabel}
              onViewMap={handleViewMap}
              isViewDisabled={isViewDisabled}
              onOpenProperties={handleOpenProperties}
            />
          </div>
        )}

        {hasNiche && (
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary rounded p-2 text-sm">
                <RiBuilding4Line />
              </div>
              <div className="leading-none">
                {lot.category} {lot.plot_id ?? ''}
                <p className="text-muted-foreground text-sm">Niche {lot.niche_number}</p>
              </div>
            </div>
            <PropertyActions
              coordsLatLng={coordsLatLng}
              locationLabel={locationLabel}
              onViewMap={handleViewMap}
              isViewDisabled={isViewDisabled}
              onOpenProperties={handleOpenProperties}
            />
          </div>
        )}
      </div>

      {/* Deceased Information Section */}
      <div className="space-y-3">
        <div className="border-b pb-2">
          <h4 className="flex items-center gap-2 text-sm font-medium">Deceased Information</h4>
        </div>

        {hasDeceased ? (
          <div className="space-y-3">
            {lot.deceased_info.map((deceased, idx) => (
              <DeceasedInfoCard key={`${deceased.deceased_id}-${idx}`} deceased={deceased} />
            ))}
          </div>
        ) : (
          <div className="bg-muted/20 rounded-lg border border-dashed py-4 text-center">
            <p className="text-muted-foreground text-sm">No deceased records found for this property</p>
            <p className="text-muted-foreground mt-1 text-xs">This property is available for interment</p>
          </div>
        )}
      </div>
    </div>
  )
}
