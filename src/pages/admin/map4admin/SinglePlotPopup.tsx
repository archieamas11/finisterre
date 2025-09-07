import { useQueryClient } from '@tanstack/react-query'
import { Plus, ChevronsUpDown, Check, Save, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import type { Customer } from '@/api/customer.api'
import type { DeceasedData as DeceasedType } from '@/types/deceased.types'
import type { DeceasedRecords } from '@/types/interment.types'
import type { ConvertedMarker } from '@/types/map.types'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useCustomers } from '@/hooks/customer-hooks/customer.hooks'
import { useCreateDeceasedRecord } from '@/hooks/deceased-hooks/useCreateDeceasedRecord'
import { useCreateLotOwner } from '@/hooks/lot-owner-hooks/useCreateLotOwner'
import { usePlotDetails } from '@/hooks/plots-hooks/usePlotDetails'
import { cn } from '@/lib/utils'
import { CreateDeceasedRecordDialog } from '@/pages/admin/map4admin/columbarium-dialogs/CreateDeceasedRecordDialog'
import { DeceasedSection } from '@/pages/admin/map4admin/DeceasedSection'

import PlotInfo from './PlotInfo'

interface PlotLocationsProps {
  marker: ConvertedMarker
  backgroundColor?: string
  popupCloseTick?: number
}

export default function SinglePlotLocations({ marker, popupCloseTick }: PlotLocationsProps) {
  const { data: plotDetails, isLoading: isLoadingDetails } = usePlotDetails(marker.plot_id)

  // owner can be of varying shapes depending on the API response; declare
  // a narrow OwnerData type that matches what the UI actually consumes.
  type OwnerData = {
    lot_id?: string
    fullname?: string
    email?: string
    contact?: string
    customer_id?: string
  }

  // Match the DeceasedSection's minimal shape to avoid cross-module type collisions
  type DeceasedItem = Partial<Pick<DeceasedType, 'dead_fullname' | 'dead_interment' | 'deceased_id'>>

  const ownerData = (plotDetails?.owner as OwnerData) ?? null
  const deceasedData = plotDetails?.deceased

  // DeceasedSection expects a narrow shape (Partial of DeceasedType).
  // Map the API response to that shape to avoid cross-module type conflicts.
  const deceasedList: DeceasedItem[] = Array.isArray(deceasedData)
    ? deceasedData.map((d: unknown) => {
        const dd = d as Record<string, unknown>
        return {
          deceased_id: typeof dd?.deceased_id === 'number' ? dd.deceased_id : undefined,
          dead_fullname: typeof dd?.dead_fullname === 'string' ? dd.dead_fullname : undefined,
          dead_interment: typeof dd?.dead_interment === 'string' ? dd.dead_interment : undefined,
        } as DeceasedItem
      })
    : []

  // UI state for Add actions
  const [isDeceasedDialogOpen, setIsDeceasedDialogOpen] = useState(false)
  const [showCustomerCombo, setShowCustomerCombo] = useState(false)
  const [comboOpen, setComboOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<string>('')
  const [isSavingOwner, setIsSavingOwner] = useState(false)

  const queryClient = useQueryClient()
  const { data: customers = [], isLoading: isLoadingCustomers } = useCustomers()
  const createLotOwnerMutation = useCreateLotOwner()
  const createDeceasedMutation = useCreateDeceasedRecord()

  // Reset UI when popup closes
  useEffect(() => {
    if (popupCloseTick !== undefined) {
      setShowCustomerCombo(false)
      setComboOpen(false)
      setSelectedCustomer('')
      setIsDeceasedDialogOpen(false)
    }
  }, [popupCloseTick])

  function openAddFlow() {
    if (!ownerData) {
      setShowCustomerCombo(true)
      return
    }
    setIsDeceasedDialogOpen(true)
  }

  function handleCustomerSelect(customerId: string) {
    setSelectedCustomer(customerId)
    setComboOpen(false)
  }

  async function handleSaveOwner() {
    if (!selectedCustomer) {
      toast.error('Select a customer first')
      return
    }
    setIsSavingOwner(true)

    const payload = {
      selected: 1,
      plot_id: marker.plot_id,
      customer_id: selectedCustomer,
      niche_number: null,
    } as const

    try {
      // ✨ Use the mutation hook instead of direct API call
      const result = await createLotOwnerMutation.mutateAsync(payload)

      if (!result?.success) {
        throw new Error(result?.message || 'Failed to save owner')
      }

      toast.success('Owner saved successfully')

      // 🔄 Optimistically update plot details cache
      const customer = (customers as Customer[]).find((c) => String(c.customer_id) === String(selectedCustomer))
      const optimisticOwner = customer
        ? {
            lot_id: undefined,
            customer_id: String(customer.customer_id),
            fullname: `${customer.first_name} ${customer.last_name}`.trim(),
            email: customer.email ?? '',
            contact: customer.contact_number ?? '',
          }
        : null

      queryClient.setQueryData(['plotDetails', marker.plot_id], (old: ConvertedMarker) => ({
        ...(old || {}),
        owner: optimisticOwner || null,
        deceased: old?.deceased ?? [],
      }))

      // Close UI
      setShowCustomerCombo(false)
      setSelectedCustomer('')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save owner'
      toast.error(errorMessage)
    } finally {
      setIsSavingOwner(false)
    }
  }

  async function handleCreateDeceased(values: DeceasedRecords) {
    const lotId = ownerData?.lot_id
    const payload = {
      ...values,
      lot_id: values?.lot_id || lotId || '',
      // ✨ Fallback parameters in case lot_id is not available
      plot_id: marker.plot_id,
      customer_id: ownerData?.customer_id || '',
    }

    try {
      await toast.promise(createDeceasedMutation.mutateAsync(payload), {
        loading: 'Saving deceased record...',
        success: 'Deceased record created',
        error: (e) => e.message || 'Failed to create deceased record',
      })

      setIsDeceasedDialogOpen(false)
    } catch (error) {
      // Error is already handled by the toast
      console.error('Failed to create deceased record:', error)
    }
  }

  const handleAdd = () => {
    openAddFlow()
  }

  return (
    <div className="max-w-full">
      <div className="mb-3 grid grid-cols-1 gap-2">
        <Button
          variant="secondary"
          size="lg"
          onClick={handleAdd}
          className="bg-card text-accent-foreground hover:bg-accent/90 flex items-center gap-1 border px-2 py-1 text-xs"
        >
          <Plus className="h-3 w-3" />
          Add
        </Button>
      </div>

      {/* Customer selection dialog for assigning owner */}
      {showCustomerCombo && (
        <div className="bg-card relative mb-3 rounded-lg border p-3">
          <h4 className="text-card-foreground mb-2 text-sm font-medium">Select Customer for Reservation</h4>
          <Popover open={comboOpen} onOpenChange={setComboOpen}>
            <PopoverTrigger asChild className="bg-accent text-muted-foreground">
              <Button className="w-full justify-between" disabled={isLoadingCustomers} aria-expanded={comboOpen} variant="outline" role="combobox">
                {selectedCustomer
                  ? (() => {
                      const c = (customers as Customer[]).find((x) => String(x.customer_id) === String(selectedCustomer))
                      return c ? `${c.first_name} ${c.last_name} | ID: ${c.customer_id}` : 'Select a customer'
                    })()
                  : isLoadingCustomers
                    ? 'Loading customers...'
                    : 'Select a customer'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-130 p-0">
              <Command className="w-full">
                <CommandInput placeholder="Search customer..." className="h-9" />
                <CommandList>
                  <CommandEmpty>{isLoadingCustomers ? 'Loading customers...' : 'No customer found.'}</CommandEmpty>
                  <CommandGroup>
                    {(customers as Customer[]).map((c: Customer) => (
                      <CommandItem
                        value={`${c.first_name} ${c.last_name} ${c.customer_id}`}
                        onSelect={() => handleCustomerSelect(String(c.customer_id))}
                        key={c.customer_id}
                      >
                        {c.first_name} {c.last_name} | ID: {c.customer_id}
                        <Check className={cn('ml-auto h-4 w-4', String(selectedCustomer) === String(c.customer_id) ? 'opacity-100' : 'opacity-0')} />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="mt-3 flex gap-2">
            <Button
              onClick={() => {
                setShowCustomerCombo(false)
                setSelectedCustomer('')
              }}
              variant="destructive"
              size="sm"
              className="flex-1 leading-none"
            >
              <X className="mr-1 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSaveOwner} disabled={isSavingOwner || !selectedCustomer} size="sm" className="flex-1 leading-none">
              <Save className="mr-1 h-4 w-4" />
              {isSavingOwner ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      )}

      {/* Deceased creation dialog */}
      {ownerData && (
        <CreateDeceasedRecordDialog
          open={isDeceasedDialogOpen}
          onOpenChange={setIsDeceasedDialogOpen}
          onSubmit={handleCreateDeceased}
          // If ownerData is available provide initial lot_id; cast to the
          // expected type to satisfy the dialog prop without requiring a
          // full DeceasedRecords object here.
          initialValues={ownerData ? ({ lot_id: ownerData?.lot_id } as unknown as DeceasedRecords) : undefined}
          isPending={false}
          mode="add"
        />
      )}

      {/* Main Content Grid - Two Columns */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <PlotInfo marker={marker} />

        {/* Right Column - Combined Owner & Deceased */}
        <div className="space-y-2">
          <DeceasedSection owner={ownerData ?? null} deceased={deceasedList} isLoading={isLoadingDetails} />
        </div>
      </div>
    </div>
  )
}
