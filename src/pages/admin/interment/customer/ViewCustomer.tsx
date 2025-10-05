import { RiBuilding4Line } from 'react-icons/ri'
import { RiHeart2Fill } from 'react-icons/ri'
import { Printer } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BiMessageSquareEdit } from 'react-icons/bi'
import type { Customer, LotInfo, DeceasedInfo } from '@/api/customer.api'
import { editCustomer } from '@/api/customer.api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import CustomerForm from '@/pages/admin/interment/customer/CustomerForm'
import { calculateYearsBuried } from '@/utils/date.utils'
import { ShareButton } from '@/pages/webmap/components/share-button'
import { formatDate } from '@/lib/format'
import { ViewCustomerButton } from '@/pages/webmap/components/view-customer-button'
import PropertiesAction from './dialog/PropertiesAction'
import { MoreActionsButton } from '../components/view-more-action'

interface ViewCustomerDialogProps {
  open: boolean
  customer: Customer
  onOpenChange: (open: boolean) => void
}

const prettifyStatus = (value?: string | null) => {
  if (!value) return ''
  return value
    .toString()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function DeceasedInfoCard({ deceased }: { deceased: DeceasedInfo }) {
  return (
    <div className="bg-muted/30 space-y-2 rounded-lg border border-dashed p-3">
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
          <RiHeart2Fill />
        </div>
        <div className="flex flex-1 items-center justify-between leading-none">
          <div>
            <p className="truncate text-sm font-medium">{deceased.dead_fullname}</p>
            <p className="text-muted-foreground truncate text-xs">Deceased ID: {deceased.deceased_id}</p>
          </div>
          {prettifyStatus(deceased.status) && (
            <Badge variant="outline" className="ml-3 flex-shrink-0 text-xs">
              {prettifyStatus(deceased.status)}
            </Badge>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Death Date:</span>
          <div className="font-medium">{formatDate(deceased.dead_date_death ?? undefined)}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Interment:</span>
          <div className="font-medium">{formatDate(deceased.dead_interment ?? undefined)}</div>
        </div>
      </div>
      <div className="text-xs">
        <span className="text-muted-foreground">Years Buried:</span>
        <Badge variant="secondary" className="ml-2 text-xs">
          {calculateYearsBuried(String(deceased.dead_date_death ?? ''))}
        </Badge>
      </div>
    </div>
  )
}

// Component for rendering combined property and deceased information
function PropertyDeceasedCard({
  lot,
  onViewMap,
  onOpenProperties,
}: {
  lot: LotInfo
  onViewMap: (lot: LotInfo) => void
  onOpenProperties: (lot: LotInfo) => void
}) {
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
        // split by comma or whitespace
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

    // If first looks like longitude (>90) and second looks like latitude (<=90), swap to [lat, lng]
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
          {prettifyStatus(lot.lot_status) && (
            <Badge className={lotStatusBadge[prettifyStatus(lot.lot_status)]}>{prettifyStatus(lot.lot_status)}</Badge>
          )}
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

function PropertyActions({
  coordsLatLng,
  locationLabel,
  onViewMap,
  isViewDisabled,
  onOpenProperties,
}: {
  coordsLatLng: [number, number] | null
  locationLabel: string
  onViewMap: () => void
  isViewDisabled: boolean
  onOpenProperties: () => void
}) {
  return (
    <div className="flex gap-2">
      <ViewCustomerButton
        className="h-8 w-8 rounded-full"
        title="View Customer"
        size="sm"
        variant="outline"
        onClick={onViewMap}
        disabled={isViewDisabled}
      />
      {coordsLatLng && (
        <ShareButton coords={coordsLatLng} location={locationLabel} side="bottom" className="h-8 w-8 rounded-full" variant="outline" size="sm" />
      )}

      {/* // More actions button (currently does nothing) */}
      <MoreActionsButton onClick={onOpenProperties} />
    </div>
  )
}

// Section header component
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <div className="bg-border h-px flex-1" />
      <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">{title}</h3>
      <div className="bg-border h-px flex-1" />
    </div>
  )
}

// Info item component
function InfoItem({ label, value, children }: { label: string; value?: string | null; children?: React.ReactNode }) {
  return (
    <div>
      <div className="text-muted-foreground mb-1 text-xs">{label}</div>
      <div className="font-medium">
        {value !== undefined && value !== null ? value : '-'}
        {children}
      </div>
    </div>
  )
}

export default function ViewCustomer({ open, customer, onOpenChange }: ViewCustomerDialogProps) {
  const [editOpen, setEditOpen] = React.useState(false)
  const [propertiesOpen, setPropertiesOpen] = React.useState(false)
  const [activeLot, setActiveLot] = React.useState<LotInfo | null>(null)
  const [localCustomer, setLocalCustomer] = React.useState<Customer>(customer)
  const navigate = useNavigate()

  const viewOnMap = React.useCallback(
    (lot: LotInfo) => {
      const plotIdentifier = lot.plot_id ?? lot.lot_plot_id
      if (!plotIdentifier) return

      const focusPlotId = String(plotIdentifier)
      const nicheValue = lot.niche_number
      const focusNicheNumber = nicheValue != null && nicheValue !== '' ? String(nicheValue) : null

      onOpenChange(false)
      navigate('/admin/map', {
        state: {
          focusPlotId,
          focusNicheNumber,
        },
      })
    },
    [navigate, onOpenChange],
  )
  React.useEffect(() => {
    if (open) setEditOpen(false)
  }, [open])

  React.useEffect(() => {
    setLocalCustomer(customer)
  }, [customer])

  const handleOpenProperties = React.useCallback((lot: LotInfo) => {
    setActiveLot(lot)
    setPropertiesOpen(true)
  }, [])

  const handlePropertiesOpenChange = React.useCallback((state: boolean) => {
    setPropertiesOpen(state)
    if (!state) {
      setActiveLot(null)
    }
  }, [])

  const handlePropertiesUpdated = React.useCallback(
    (payload: { lotId: string; lotStatus?: LotInfo['lot_status']; deceasedStatuses?: Array<{ deceasedId: string; status: string | null }> }) => {
      setLocalCustomer((prev) => {
        if (!prev?.lot_info) return prev

        const nextLotInfo = prev.lot_info.map((lotItem) => {
          const lotId = lotItem.lot_id != null ? String(lotItem.lot_id) : lotItem.plot_id != null ? String(lotItem.plot_id) : null
          if (lotId === payload.lotId) {
            const updatedDeceased = Array.isArray(lotItem.deceased_info)
              ? lotItem.deceased_info.map((record) => {
                  const match = payload.deceasedStatuses?.find((entry) => entry.deceasedId === String(record.deceased_id))
                  return match ? { ...record, status: match.status } : record
                })
              : lotItem.deceased_info

            return {
              ...lotItem,
              lot_status: payload.lotStatus ?? lotItem.lot_status ?? null,
              deceased_info: updatedDeceased ?? lotItem.deceased_info,
            }
          }
          return lotItem
        })

        return {
          ...prev,
          lot_info: nextLotInfo,
        }
      })

      setActiveLot((prev) => {
        if (!prev) return prev
        const lotId = prev.lot_id != null ? String(prev.lot_id) : prev.plot_id != null ? String(prev.plot_id) : null
        if (lotId === payload.lotId) {
          const updatedDeceased = Array.isArray(prev.deceased_info)
            ? prev.deceased_info.map((record) => {
                const match = payload.deceasedStatuses?.find((entry) => entry.deceasedId === String(record.deceased_id))
                return match ? { ...record, status: match.status } : record
              })
            : prev.deceased_info

          return {
            ...prev,
            lot_status: payload.lotStatus ?? prev.lot_status ?? null,
            deceased_info: updatedDeceased ?? prev.deceased_info,
          }
        }
        return prev
      })
    },
    [],
  )

  const customerData = localCustomer

  if (!customerData) {
    return null
  }

  return (
    <>
      <Sheet onOpenChange={onOpenChange} open={open}>
        <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-md">
          {/* Profile Header */}
          <div className="bg-primary/5 relative flex flex-col items-center pt-12 pb-6">
            {/* Buttons in top right */}
            <div className="absolute top-2 left-2 flex gap-2">
              <Button
                aria-label="Edit customer"
                size="icon"
                variant="ghost"
                className="gap-1"
                onClick={() => {
                  setEditOpen(true)
                  onOpenChange(false)
                }}
              >
                <BiMessageSquareEdit />
              </Button>
              <Button aria-label="Print" size="icon" variant="ghost" className="gap-1">
                <Printer />
              </Button>
            </div>

            {/* Avatar */}
            <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full text-lg font-semibold">
              {customerData.first_name.charAt(0)}
            </div>

            {/* Name */}
            <h2 className="mt-4 text-center text-xl font-bold tracking-tight">
              {customerData.first_name}
              {customerData.middle_name ? ` ${customerData.middle_name}` : ''} {customerData.last_name ? ` ${customerData.last_name}` : ''}
            </h2>

            {/* Footer Dates */}
            <div className="text-muted-foreground mt-5 flex w-[90%] justify-around rounded-lg border p-3 text-center text-sm">
              <div>
                <div>Created</div>
                <div className="font-medium">{formatDate(customerData.created_at ?? undefined)}</div>
              </div>
              <div>
                <div>Last Updated</div>
                <div className="font-medium">{formatDate(customerData.updated_at ?? undefined)}</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6 p-5">
            {/* Contact Section */}
            <div className="bg-card rounded-lg border p-4">
              <SectionHeader title="Contact Information" />
              <div className="space-y-4">
                <InfoItem label="Email" value={customerData.email} />
                <InfoItem label="Contact Number" value={customerData.contact_number} />
                <InfoItem label="Address" value={customerData.address} />
              </div>
            </div>

            {/* Personal Section */}
            <div className="bg-card rounded-lg border p-4">
              <SectionHeader title="Personal Details" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoItem label="Birth Date" value={formatDate(customerData.birth_date ?? undefined)} />
                <InfoItem label="Occupation" value={customerData.occupation} />
                <InfoItem label="Religion" value={customerData.religion} />
                <InfoItem label="Citizenship" value={customerData.citizenship} />
              </div>
            </div>

            {/* Property & Deceased Information - Combined */}
            <div className="bg-card rounded-lg border p-4">
              <SectionHeader title="Property & Deceased Information" />
              {Array.isArray(customerData.lot_info) && customerData.lot_info.length > 0 ? (
                <div className="space-y-4">
                  {customerData.lot_info?.map((lot, idx) => (
                    <PropertyDeceasedCard
                      key={`${lot.plot_id}-${lot.niche_number}-${idx}`}
                      lot={lot}
                      onViewMap={viewOnMap}
                      onOpenProperties={handleOpenProperties}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed py-6 text-center">
                  <p className="text-muted-foreground">No property information available</p>
                  <p className="text-muted-foreground mt-1 text-sm">This customer doesn't own any plots or niches</p>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <PropertiesAction
        open={propertiesOpen}
        onOpenChange={handlePropertiesOpenChange}
        lot={activeLot}
        customerId={customerData.customer_id}
        onUpdated={handlePropertiesUpdated}
      />

      {/* Edit Dialog (outside Sheet so it stays mounted) */}
      <CustomerForm
        mode="edit"
        open={editOpen}
        initialValues={{
          email: customerData.email || '',
          address: customerData.address || '',
          middle_name: customerData.middle_name ?? undefined,
          gender: customerData.gender === 'Female' ? 'Female' : 'Male',
          religion: customerData.religion || '',
          last_name: customerData.last_name || '',
          status:
            customerData.status === 'Married'
              ? 'Married'
              : customerData.status === 'Widowed'
                ? 'Widowed'
                : customerData.status === 'Divorced'
                  ? 'Divorced'
                  : customerData.status === 'Separated'
                    ? 'Separated'
                    : 'Single',
          first_name: customerData.first_name || '',
          occupation: customerData.occupation || '',
          citizenship: customerData.citizenship || '',
          contact_number: customerData.contact_number || '',
          birth_date: customerData.birth_date ? String(customerData.birth_date).slice(0, 10) : '',
        }}
        onOpenChange={setEditOpen}
        onSubmit={async (values) => {
          const payload: Partial<Customer> = {
            ...values,
            middle_name: values.middle_name ?? null,
            occupation: values.occupation || null,
            citizenship: values.citizenship || null,
            birth_date: values.birth_date || null,
          }
          await editCustomer(payload as Customer)
        }}
      />
    </>
  )
}
