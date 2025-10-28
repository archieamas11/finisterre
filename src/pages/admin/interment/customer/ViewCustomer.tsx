import type { Customer, LotInfo } from '@/api/customer.api'
import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'

import { editCustomer } from '@/api/customer.api'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { formatDate } from '@/lib/format'
import CustomerForm from '@/pages/admin/interment/customer/dialog/CustomerForm'
import { CustomerProfileHeader, InfoItem, PrintableCustomerDetails, PropertyDeceasedCard, SectionHeader } from './components'
import PropertiesAction from './dialog/PropertiesAction'

interface ViewCustomerDialogProps {
  open: boolean
  customer: Customer
  onOpenChange: (open: boolean) => void
}

export default function ViewCustomer({ open, customer, onOpenChange }: ViewCustomerDialogProps) {
  const [editOpen, setEditOpen] = React.useState(false)
  const [propertiesOpen, setPropertiesOpen] = React.useState(false)
  const [activeLot, setActiveLot] = React.useState<LotInfo | null>(null)
  const [localCustomer, setLocalCustomer] = React.useState<Customer>(customer)
  const contentRef = useRef<HTMLDivElement>(null)
  const reactToPrintFn = useReactToPrint({ contentRef })

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

  const handleEditClick = React.useCallback(() => {
    setEditOpen(true)
    onOpenChange(false)
  }, [onOpenChange])

  const customerData = localCustomer

  if (!customerData) {
    return null
  }

  return (
    <>
      <Sheet onOpenChange={onOpenChange} open={open}>
        <SheetTitle className="sr-only">View Customer</SheetTitle>
        <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-md">
          {/* Profile Header */}
          <CustomerProfileHeader customer={customerData} onEditClick={handleEditClick} onPrintClick={reactToPrintFn} />

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
          birth_date: customerData.birth_date ? new Date(customerData.birth_date).toISOString().slice(0, 10) : '',
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
      <PrintableCustomerDetails ref={contentRef} customer={customerData} />
    </>
  )
}
