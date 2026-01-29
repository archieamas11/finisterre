import type { ConvertedMarker } from '@/types/map.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { updateMultiplePlotCoordinates } from '@/api/plots.api'

interface CoordinateUpdate {
  plot_id: string
  coordinates: string
}

export const useBulkUpdateCoordinates = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: CoordinateUpdate[]) => {
      console.log('[useBulkUpdateCoordinates] Sending updates:', updates)
      const response = await updateMultiplePlotCoordinates(updates)
      console.log('[useBulkUpdateCoordinates] Response:', response)
      return response
    },
    onMutate: async (updates) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: ['plots'] })

      // Snapshot previous state for rollback
      const previousPlots = queryClient.getQueryData<ConvertedMarker[]>(['plots'])
      const previousPlotsClone = previousPlots ? JSON.parse(JSON.stringify(previousPlots)) : undefined

      // Optimistically update the cache
      if (previousPlots) {
        queryClient.setQueryData(['plots'], (old: ConvertedMarker[] | undefined) => {
          if (!old) return old

          return old.map((plot: ConvertedMarker) => {
            const update = updates.find((u) => u.plot_id === plot.plot_id)
            if (!update) return plot

            // Parse coordinates
            const parts = String(update.coordinates)
              .split(',')
              .map((s) => parseFloat(s.trim()))
            const [lng, lat] = parts.length >= 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1]) ? [parts[0], parts[1]] : [undefined, undefined]

            if (lat === undefined || lng === undefined) return plot

            return {
              ...plot,
              coordinates: `${lng}, ${lat}`,
              position: [lat, lng] as [number, number],
            }
          })
        })
      }

      return { previousPlotsClone }
    },
    onError: (error, _updates, context) => {
      // Rollback on error
      if (context?.previousPlotsClone) {
        queryClient.setQueryData(['plots'], context.previousPlotsClone)
      }
      console.error('[useBulkUpdateCoordinates] Error updating coordinates:', error)
      toast.error('Failed to update marker positions')
    },
    onSuccess: (data) => {
      toast.success(`Successfully updated ${data.updated_count || 'multiple'} markers`)
    },
    onSettled: () => {
      // Refetch to ensure sync with backend
      queryClient.invalidateQueries({ queryKey: ['plots'] })
    },
  })
}
