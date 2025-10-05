import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import type { LotInfo } from '@/api/customer.api'
import { updateDeceasedStatus } from '@/api/deceased.api'
import { useEditLotOwner } from '@/hooks/lot-owner-hooks/useUpdateLotOwner'
import type { LotOwners } from '@/types/interment.types'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RiHeart2Fill } from 'react-icons/ri'

const lotStatusOptions = ['active', 'completed', 'cancelled'] as const
const deceasedStatusSuggestions = ['transferred', 'cancelled', 'active'] as const

type LotStatusOption = (typeof lotStatusOptions)[number]

const propertiesSchema = z.object({
  lotStatus: z.enum(lotStatusOptions),
  deceasedStatuses: z.array(
    z.object({
      deceasedId: z.string(),
      status: z.string().nullable().optional(),
    }),
  ),
})

type PropertiesFormValues = z.infer<typeof propertiesSchema>

interface PropertiesActionProps {
  open: boolean
  lot: LotInfo | null
  customerId?: string | number | null
  onOpenChange: (open: boolean) => void
  onUpdated?: (payload: {
    lotId: string
    lotStatus?: LotInfo['lot_status']
    deceasedStatuses?: Array<{ deceasedId: string; status: string | null }>
  }) => void
}

function normalizeLotStatus(status?: string | null): LotStatusOption | null {
  if (!status) return null
  if (status === 'canceled') return 'cancelled'
  if (lotStatusOptions.includes(status as LotStatusOption)) {
    return status as LotStatusOption
  }
  return null
}

export default function PropertiesAction({ open, onOpenChange, lot, customerId, onUpdated }: PropertiesActionProps) {
  const queryClient = useQueryClient()
  const editLotOwnerMutation = useEditLotOwner()
  const deceasedStatusMutation = useMutation({
    mutationFn: ({ deceasedId, status }: { deceasedId: string; status: string }) => updateDeceasedStatus(deceasedId, status),
  })

  const form = useForm<PropertiesFormValues>({
    resolver: zodResolver(propertiesSchema),
    defaultValues: {
      lotStatus: normalizeLotStatus(lot?.lot_status) ?? 'active',
      deceasedStatuses: (lot?.deceased_info ?? []).map((record) => ({
        deceasedId: record.deceased_id ? String(record.deceased_id) : '',
        status: record.status ?? null,
      })),
    },
  })

  const initialLotStatus = React.useMemo(() => normalizeLotStatus(lot?.lot_status), [lot?.lot_status])
  const initialDeceasedStatusMap = React.useMemo(() => {
    const map = new Map<string, string | null>()
    lot?.deceased_info?.forEach((record, index) => {
      const key = record.deceased_id ? String(record.deceased_id) : `record-${index}`
      map.set(key, record.status ?? null)
    })
    return map
  }, [lot?.deceased_info])

  React.useEffect(() => {
    if (!open) {
      form.reset()
      return
    }

    form.reset({
      lotStatus: normalizeLotStatus(lot?.lot_status) ?? 'active',
      deceasedStatuses: (lot?.deceased_info ?? []).map((record, index) => ({
        deceasedId: record.deceased_id ? String(record.deceased_id) : `record-${index}`,
        status: record.status ?? null,
      })),
    })
  }, [lot, open, form])

  const locationLabel = React.useMemo(() => {
    if (!lot) return 'Unknown location'
    const hasGraveLot = lot.block != null && lot.block !== '' && lot.lot_plot_id != null
    const hasNiche = lot.category != null && lot.category !== '' && lot.niche_number != null
    if (hasGraveLot) {
      return `Block ${lot.block ?? ''} • Grave ${lot.lot_plot_id ?? ''}`
    }
    if (hasNiche) {
      return `${lot.category ?? ''} ${lot.plot_id ?? ''} • Niche ${lot.niche_number ?? ''}`
    }
    return 'Unknown location'
  }, [lot])

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!lot || !lot.lot_id) {
      toast.error('Unable to update property. Missing lot identifier.')
      return
    }

    const nextLotStatus = normalizeLotStatus(values.lotStatus) ?? 'active'
    const lotStatusChanged = initialLotStatus == null || nextLotStatus !== initialLotStatus

    // When lot is cancelled, backend handles deceased & plot updates automatically
    const isCancellingLot = nextLotStatus === 'cancelled' && lotStatusChanged

    const deceasedUpdates = (lot.deceased_info ?? []).map((record, index) => {
      const field = values.deceasedStatuses?.[index]
      const nextStatus = field?.status?.trim() ?? ''
      const key = record.deceased_id ? String(record.deceased_id) : `record-${index}`
      const currentStatus = initialDeceasedStatusMap.get(key) ?? ''
      return {
        record,
        nextStatus,
        shouldUpdate: Boolean(record.deceased_id) && nextStatus !== '' && nextStatus !== currentStatus,
      }
    })

    const hasLotUpdate = lotStatusChanged
    const hasDeceasedUpdate = !isCancellingLot && deceasedUpdates.some((entry) => entry.shouldUpdate)

    if (!hasLotUpdate && !hasDeceasedUpdate) {
      toast.info('No changes detected.')
      return
    }

    const mutationPromise = (async () => {
      if (hasLotUpdate) {
        const payload: Partial<LotOwners> = {
          lot_id: String(lot.lot_id),
          lot_status: nextLotStatus,
        }

        // Backend automatically handles:
        // - Setting all deceased to 'cancelled' when lot is cancelled
        // - Setting plot to 'available' if niche_number is NULL
        // Only set niche_status to available if it exists and lot is being cancelled
        if (nextLotStatus === 'cancelled' && 'niche_status' in lot && lot.niche_status != null) {
          payload.niche_status = 'available'
        }

        await editLotOwnerMutation.mutateAsync(payload)
      }

      // Only update individual deceased statuses if NOT cancelling the lot
      if (hasDeceasedUpdate) {
        await Promise.all(
          deceasedUpdates
            .filter((entry) => entry.shouldUpdate && entry.record.deceased_id)
            .map((entry) =>
              deceasedStatusMutation.mutateAsync({
                deceasedId: String(entry.record.deceased_id),
                status: entry.nextStatus,
              }),
            ),
        )
      }

      const invalidations: Array<Promise<unknown>> = [
        queryClient.invalidateQueries({ queryKey: ['customers'] }),
        queryClient.invalidateQueries({ queryKey: ['lotOwner'] }),
        queryClient.invalidateQueries({ queryKey: ['deceased'] }),
        queryClient.invalidateQueries({ queryKey: ['plots'] }),
        queryClient.invalidateQueries({ queryKey: ['niches'] }),
        queryClient.invalidateQueries({ queryKey: ['map-stats', 'chambers'] }),
        queryClient.invalidateQueries({ queryKey: ['map-stats', 'serenity'] }),
      ]

      if (customerId) {
        invalidations.push(queryClient.invalidateQueries({ queryKey: ['customer', String(customerId)] }))
      }

      await Promise.all(invalidations)

      onUpdated?.({
        lotId: String(lot.lot_id),
        lotStatus: nextLotStatus,
        deceasedStatuses: isCancellingLot
          ? (lot.deceased_info ?? [])
              .filter((record) => record.deceased_id)
              .map((record) => ({ deceasedId: String(record.deceased_id), status: 'cancelled' }))
          : deceasedUpdates
              .filter((entry) => entry.shouldUpdate && entry.record.deceased_id)
              .map((entry) => ({ deceasedId: String(entry.record.deceased_id), status: entry.nextStatus })),
      })

      form.reset({
        lotStatus: nextLotStatus,
        deceasedStatuses: (lot.deceased_info ?? []).map((record, index) => ({
          deceasedId: record.deceased_id ? String(record.deceased_id) : `record-${index}`,
          status: isCancellingLot
            ? 'cancelled'
            : deceasedUpdates[index]?.shouldUpdate
              ? (deceasedUpdates[index]?.nextStatus ?? null)
              : (record.status ?? null),
        })),
      })
    })()

    await toast.promise(mutationPromise, {
      loading: 'Saving changes...',
      success: isCancellingLot ? 'Lot cancelled. All related records updated automatically.' : 'Property details updated successfully.',
      error: 'Failed to update property details.',
    })

    onOpenChange(false)
  })

  const isSubmitting = form.formState.isSubmitting || editLotOwnerMutation.isPending || deceasedStatusMutation.isPending

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Property properties</DialogTitle>
          <DialogDescription>
            {lot ? (
              <div className="space-y-1">
                <div className="font-medium">Update lot and deceased statuses</div>
                <div className="text-muted-foreground text-sm">{locationLabel}</div>
              </div>
            ) : (
              'Select a property to update its statuses.'
            )}
          </DialogDescription>
        </DialogHeader>

        {lot ? (
          <Form {...form}>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <FormField
                  control={form.control}
                  name="lotStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lot status</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger aria-label="Select lot status" className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {lotStatusOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option === 'cancelled' ? 'Cancelled' : option.charAt(0).toUpperCase() + option.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* with deceased information section */}
              {(lot.deceased_info ?? []).length > 0 && (
                <div className="space-y-3">
                  {lot.deceased_info.map((deceased, index) => (
                    <div key={deceased.deceased_id || index} className="bg-background/50 border-border rounded-md border p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="text-muted-foreground flex items-center gap-1 font-medium">
                          <RiHeart2Fill />
                          {deceased.dead_fullname || `Deceased ${index + 1}`}
                        </div>
                        <div className="text-muted-foreground text-sm">#{deceased.deceased_id ?? index}</div>
                      </div>
                      <div className="mt-3">
                        <FormField
                          control={form.control}
                          name={`deceasedStatuses.${index}.status`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-1">Deceased status</FormLabel>
                              <FormControl>
                                <Select value={field.value || ''} onValueChange={field.onChange}>
                                  <SelectTrigger aria-label="Select deceased status" className="w-full">
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {deceasedStatusSuggestions.map((option) => (
                                      <SelectItem key={option} value={option}>
                                        {option.charAt(0).toUpperCase() + option.slice(1)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <DialogFooter className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="text-muted-foreground py-6 text-sm">Select a property to modify its statuses.</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
