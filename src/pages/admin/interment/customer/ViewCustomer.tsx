import { RiHeart2Fill } from 'react-icons/ri'
import { AiFillEye } from 'react-icons/ai'
import { HiLibrary } from 'react-icons/hi'
import { Printer } from 'lucide-react'
import React from 'react'
import { BiMessageSquareEdit } from 'react-icons/bi'
import type { Customer, LotInfo, DeceasedInfo } from '@/api/customer.api'
import { editCustomer } from '@/api/customer.api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import CustomerForm from '@/pages/admin/interment/customer/CustomerForm'
import { calculateYearsBuried } from '@/utils/date.utils'
import GetDirectionButton from '@/pages/webmap/components/get-direction-button'
import { ShareButton } from '@/pages/webmap/components/share-button'
import { formatDate } from '@/lib/format'

interface ViewCustomerDialogProps {
  open: boolean
  customer: Customer
  onOpenChange: (open: boolean) => void
}

function DeceasedInfoCard({ deceased }: { deceased: DeceasedInfo }) {
  return (
    <div className="bg-muted/30 space-y-2 rounded-lg border border-dashed p-3">
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
          <RiHeart2Fill />
        </div>
        <div>
          <div className="text-sm font-medium">{deceased.dead_fullname}</div>
          <div className="text-muted-foreground text-xs">Deceased ID: {deceased.deceased_id}</div>
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
function PropertyDeceasedCard({ lot }: { lot: LotInfo }) {
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
  const hasGraveLot = lot.block != null && lot.block !== '' && lot.lot_plot_id != null
  const hasNiche = lot.category != null && lot.category !== '' && lot.niche_number != null
  const hasDeceased = Array.isArray(lot.deceased_info) && lot.deceased_info.length > 0
  const locationLabel = hasGraveLot
    ? `Block ${lot.block ?? ''} Grave ${lot.lot_plot_id ?? ''}`
    : hasNiche
      ? `${lot.category ?? ''} ${lot.plot_id ?? ''} Niche ${lot.niche_number ?? ''}`
      : 'Unknown location'

  return (
    <div className="bg-card space-y-4 rounded-lg border p-4">
      {/* Property Information Header */}
      <div className="border-b pb-2">
        <h4 className="flex items-center gap-2 text-sm font-medium">
          <HiLibrary /> Property Information
        </h4>
      </div>

      {/* Property Details */}
      <div className="space-y-2">
        {hasGraveLot && (
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary rounded p-2 text-sm">🏢</div>
              <div>
                <div className="font-medium">Block {lot.block}</div>
                <div className="text-muted-foreground text-sm">Grave {lot.lot_plot_id}</div>
              </div>
            </div>
            <PropertyActions coordsLatLng={coordsLatLng} locationLabel={locationLabel} />
          </div>
        )}

        {hasNiche && (
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary rounded p-2 text-sm">🏢</div>
              <div>
                <div className="font-medium">
                  {lot.category} {lot.plot_id ?? ''}
                </div>
                <div className="text-muted-foreground text-sm">Niche {lot.niche_number}</div>
              </div>
            </div>
            <PropertyActions coordsLatLng={coordsLatLng} locationLabel={locationLabel} />
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

function PropertyActions({ coordsLatLng, locationLabel }: { coordsLatLng: [number, number] | null; locationLabel: string }) {
  return (
    <div className="flex gap-2">
      <GetDirectionButton className="h-8 w-8 rounded-full text-white" title="Navigate" size="sm" variant="outline" />
      <Button aria-label="View property" size="sm" variant="outline" className="h-8 w-8 rounded-full text-white">
        <AiFillEye />
      </Button>
      {coordsLatLng && (
        <ShareButton coords={coordsLatLng} location={locationLabel} side="bottom" className="h-8 w-8 rounded-full" variant="outline" size="sm" />
      )}
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
  React.useEffect(() => {
    if (open) setEditOpen(false)
  }, [open])

  if (!customer) {
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
              {customer.first_name.charAt(0)}
            </div>

            {/* Name */}
            <h2 className="mt-4 text-center text-xl font-bold tracking-tight">
              {customer.first_name}
              {customer.middle_name ? ` ${customer.middle_name}` : ''} {customer.last_name ? ` ${customer.last_name}` : ''}
            </h2>

            {/* Status Badges */}
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <Badge variant="outline" className="flex items-center gap-2 capitalize">
                Lot Owned
                <span className="bg-accent text-accent-foreground rounded-full border px-2 py-0.5 text-xs font-medium">
                  {customer.lot_info?.length ?? 0}
                </span>
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2 capitalize">
                Deceased
                <span className="bg-accent text-accent-foreground rounded-full border px-2 py-0.5 text-xs font-medium">
                  {customer.lot_info?.reduce((total, lot) => total + (Array.isArray(lot.deceased_info) ? lot.deceased_info.length : 0), 0) ?? 0}
                </span>
              </Badge>
              <Badge className="capitalize" variant="outline">
                {customer.gender}
              </Badge>
              <Badge className="capitalize" variant="outline">
                {customer.status}
              </Badge>
            </div>

            {/* Footer Dates */}
            <div className="text-muted-foreground mt-5 flex w-[90%] justify-around rounded-lg border p-3 text-center text-sm">
              <div>
                <div>Created</div>
                <div className="font-medium">{formatDate(customer.created_at ?? undefined)}</div>
              </div>
              <div>
                <div>Last Updated</div>
                <div className="font-medium">{formatDate(customer.updated_at ?? undefined)}</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6 p-5">
            {/* Contact Section */}
            <div className="bg-card rounded-lg border p-4">
              <SectionHeader title="Contact Information" />
              <div className="space-y-4">
                <InfoItem label="Email" value={customer.email} />
                <InfoItem label="Contact Number" value={customer.contact_number} />
                <InfoItem label="Address" value={customer.address} />
              </div>
            </div>

            {/* Personal Section */}
            <div className="bg-card rounded-lg border p-4">
              <SectionHeader title="Personal Details" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoItem label="Birth Date" value={formatDate(customer.birth_date ?? undefined)} />
                <InfoItem label="Occupation" value={customer.occupation} />
                <InfoItem label="Religion" value={customer.religion} />
                <InfoItem label="Citizenship" value={customer.citizenship} />
              </div>
            </div>

            {/* Property & Deceased Information - Combined */}
            <div className="bg-card rounded-lg border p-4">
              <SectionHeader title="Property & Deceased Information" />
              {Array.isArray(customer.lot_info) && customer.lot_info.length > 0 ? (
                <div className="space-y-4">
                  {customer.lot_info.map((lot, idx) => (
                    <PropertyDeceasedCard key={`${lot.plot_id}-${lot.niche_number}-${idx}`} lot={lot} />
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

      {/* Edit Dialog (outside Sheet so it stays mounted) */}
      <CustomerForm
        mode="edit"
        open={editOpen}
        initialValues={{
          email: customer.email || '',
          address: customer.address || '',
          middle_name: customer.middle_name ?? undefined,
          gender: customer.gender === 'Female' ? 'Female' : 'Male',
          religion: customer.religion || '',
          last_name: customer.last_name || '',
          status:
            customer.status === 'Married'
              ? 'Married'
              : customer.status === 'Widowed'
                ? 'Widowed'
                : customer.status === 'Divorced'
                  ? 'Divorced'
                  : customer.status === 'Separated'
                    ? 'Separated'
                    : 'Single',
          first_name: customer.first_name || '',
          occupation: customer.occupation || '',
          citizenship: customer.citizenship || '',
          contact_number: customer.contact_number || '',
          birth_date: customer.birth_date ? String(customer.birth_date).slice(0, 10) : '',
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
