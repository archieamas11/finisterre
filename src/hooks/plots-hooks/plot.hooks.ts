import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'

import type { plots } from '@/types/map.types'

import { createPlots, editPlots, getPlots } from '@/api/plots.api'

export function useEditPlots() {
  const qc = useQueryClient()
  return useMutation<plots, Error, plots>({
    mutationFn: async (data) => {
      return await editPlots(data)
    },
    onSuccess: (_, variables) => {
      // Invalidate both plots and specific plot details
      qc.invalidateQueries({ queryKey: ['plots'] })
      if (variables.plot_id) {
        qc.invalidateQueries({ queryKey: ['plotDetails', variables.plot_id] })
      }
      // Also invalidate all plot details to be safe
      qc.invalidateQueries({ queryKey: ['plotDetails'] })
    },
  })
}

export function usePlots() {
  return useQuery({
    queryKey: ['plots'],
    queryFn: async () => {
      const r = await getPlots()
      return r.plots ?? []
    },
    staleTime: 0, // Always consider data stale for immediate refetch when invalidated
    gcTime: 5 * 60 * 1000, // 5 minutes garbage collection time
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })
}

export { editPlots, createPlots }
