import { useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import type { Customer } from '@/api/customer.api'
import type { DeceasedData as DeceasedType } from '@/types/deceased.types'
import type { DeceasedRecords } from '@/types/interment.types'
import type { ConvertedMarker } from '@/types/map.types'

import { Button } from '@/components/ui/button'
import { useCustomers } from '@/hooks/customer-hooks/customer.hooks'
import { useCreateDeceasedRecord } from '@/hooks/deceased-hooks/useCreateDeceasedRecord'
import { useCreateLotOwner } from '@/hooks/lot-owner-hooks/useCreateLotOwner'
import { usePlotDetails } from '@/hooks/plots-hooks/usePlotDetails'
import { CreateDeceasedRecordDialog } from '@/pages/admin/map4admin/columbarium-dialogs/CreateDeceasedRecordDialog'
import { DeceasedSection } from '@/pages/admin/map4admin/DeceasedSection'
import CustomerSelectForm from '@/components/customers/CustomerSelectForm'
import LotOwnerCredentialsDialog, { type LotOwnerCredentials } from '@/components/lot-owners/LotOwnerCredentialsDialog'

import PlotInfo from './PlotInfo'

interface PlotLocationsProps {
  marker: ConvertedMarker
  backgroundColor?: string
  popupCloseTick?: number
}

export default function SinglePlotLocations({ marker, popupCloseTick }: PlotLocationsProps) {
  const { data: plotDetails, isLoading: isLoadingDetails } = usePlotDetails(marker.plot_id)

  type OwnerData = {
    lot_id?: string
    fullname?: string
    email?: string
    contact?: string
    customer_id?: string
  }

  type DeceasedItem = Partial<Pick<DeceasedType, 'dead_fullname' | 'dead_interment' | 'deceased_id'>>

  const ownerData = useMemo(() => (plotDetails?.owner as OwnerData) ?? null, [plotDetails])

  const deceasedList: DeceasedItem[] = useMemo(() => {
    const data = plotDetails?.deceased
    if (!Array.isArray(data)) return []
    return data.map((d: unknown) => {
      const dd = d as Record<string, unknown>
      return {
        deceased_id: typeof dd?.deceased_id === 'number' ? dd.deceased_id : undefined,
        dead_fullname: typeof dd?.dead_fullname === 'string' ? dd.dead_fullname : undefined,
        dead_interment: typeof dd?.dead_interment === 'string' ? dd.dead_interment : undefined,
      } as DeceasedItem
    })
  }, [plotDetails?.deceased])

  const [isDeceasedDialogOpen, setIsDeceasedDialogOpen] = useState(false)
  const [showCustomerCombo, setShowCustomerCombo] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<string>('')
  const [isSavingOwner, setIsSavingOwner] = useState(false)
  const [credentialsDialogOpen, setCredentialsDialogOpen] = useState(false)
  const [lotOwnerCredentials, setLotOwnerCredentials] = useState<LotOwnerCredentials | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const queryClient = useQueryClient()
  const { data: customers = [] } = useCustomers()
  const createLotOwnerMutation = useCreateLotOwner()
  const createDeceasedMutation = useCreateDeceasedRecord()

  useEffect(() => {
    if (popupCloseTick !== undefined) {
      setShowCustomerCombo(false)
      setSelectedCustomer('')
      setIsDeceasedDialogOpen(false)
    }
  }, [popupCloseTick])

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const popupEl = el.closest('.leaflet-popup') as Element | null
    if (!popupEl) return

    const observer = new MutationObserver(() => {
      if (!document.body.contains(popupEl)) {
        setShowCustomerCombo(false)
        setSelectedCustomer('')
        setIsDeceasedDialogOpen(false)
        observer.disconnect()
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [popupCloseTick])

  const openAddFlow = useCallback(() => {
    const existingCount = Array.isArray(deceasedList) ? deceasedList.filter(Boolean).length : 0
    if (existingCount >= 2) {
      toast.error('This plot already reached the maximum of 2 bodies.')
      return
    }

    if (!ownerData) {
      setShowCustomerCombo(true)
      return
    }

    setIsDeceasedDialogOpen(true)
  }, [ownerData, deceasedList])

  const handleSaveOwner = useCallback(
    async (customerId?: string) => {
      const customerToUse = customerId ?? selectedCustomer
      if (!customerToUse) {
        toast.error('Select a customer first')
        return
      }
      setIsSavingOwner(true)

      const payload = {
        selected: 1,
        plot_id: marker.plot_id,
        customer_id: customerToUse,
        niche_number: null,
      } as const

      try {
        const result = await createLotOwnerMutation.mutateAsync(payload)

        if (!result?.success) {
          throw new Error(result?.message || 'Failed to save owner')
        }

        toast.success('Owner saved successfully')

        if (result?.credentials) {
          const credentialsWithCategory = {
            ...result.credentials,
            plot_category: marker.category,
          }

          setLotOwnerCredentials(credentialsWithCategory as LotOwnerCredentials)
          setCredentialsDialogOpen(true)
        } else {
          console.log('No credentials found in response')
        }

        const customer = (customers as Customer[]).find((c) => String(c.customer_id) === String(customerToUse))
        const optimisticOwner = customer
          ? {
              lot_id: undefined,
              customer_id: String(customer.customer_id),
              fullname: `${customer.first_name} ${customer.last_name}`.trim(),
              email: customer.email ?? '',
              contact: customer.contact_number ?? '',
            }
          : null

        queryClient.setQueryData(['plotDetails', marker.plot_id], (old: unknown) => ({
          ...(old as Record<string, unknown>),
          owner: optimisticOwner || null,
          deceased: (old as Record<string, unknown>)?.deceased ?? [],
        }))

        setShowCustomerCombo(false)
        setSelectedCustomer('')
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to save owner'
        toast.error(errorMessage)
      } finally {
        setIsSavingOwner(false)
      }
    },
    [createLotOwnerMutation, marker.plot_id, marker.category, customers, queryClient, selectedCustomer],
  )

  const handleCreateDeceased = useCallback(
    async (values: DeceasedRecords) => {
      const lotId = ownerData?.lot_id
      const payload = {
        ...values,
        lot_id: values?.lot_id || lotId || '',
        plot_id: marker.plot_id,
        customer_id: ownerData?.customer_id || '',
      }

      try {
        await toast.promise(createDeceasedMutation.mutateAsync(payload), {
          loading: 'Saving deceased record...',
          success: 'Deceased record created',
          error: (e: unknown) => (e instanceof Error ? e.message : 'Failed to create deceased record'),
        })

        setIsDeceasedDialogOpen(false)
      } catch (error) {
        console.error('Failed to create deceased record:', error)
      }
    },
    [createDeceasedMutation, marker.plot_id, ownerData],
  )

  const handleAdd = useCallback(() => openAddFlow(), [openAddFlow])

  return (
    <div ref={rootRef} className="max-w-full">
      {!showCustomerCombo && !isDeceasedDialogOpen && (
        <div className="mb-3 grid grid-cols-1 gap-2">
          <Button
            variant="secondary"
            size="lg"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation()
              handleAdd()
            }}
            className="bg-card text-card-foreground hover:bg-card/90 flex items-center gap-1 border px-2 py-1 text-xs"
          >
            <Plus className="h-3 w-3" />
            Add
          </Button>
        </div>
      )}

      {showCustomerCombo && (
        <div className="text-card-foreground py-3">
          <CustomerSelectForm
            title="Select Customer for Reservation"
            isSaving={isSavingOwner}
            onCancel={() => {
              setShowCustomerCombo(false)
              setSelectedCustomer('')
            }}
            onSave={(customer_id) => {
              handleSaveOwner(customer_id)
            }}
            headingClassName="text-card-foreground mb-3 text-sm"
            containerClassName="bg-card mt-4 rounded-lg border p-4 text-card-foreground"
          />
        </div>
      )}

      {ownerData && (
        <CreateDeceasedRecordDialog
          open={isDeceasedDialogOpen}
          onOpenChange={setIsDeceasedDialogOpen}
          onSubmit={handleCreateDeceased}
          initialValues={ownerData ? ({ lot_id: ownerData?.lot_id } as unknown as DeceasedRecords) : undefined}
          isPending={false}
        />
      )}

      <LotOwnerCredentialsDialog open={credentialsDialogOpen} onOpenChange={setCredentialsDialogOpen} credentials={lotOwnerCredentials} />
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <PlotInfo marker={marker} />
        <div className="space-y-2">
          <DeceasedSection owner={ownerData ?? null} deceased={deceasedList} isLoading={isLoadingDetails} />
        </div>
      </div>
    </div>
  )
}
