import type { plots } from '@/types/map.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createPlots, editPlots, getPlots } from '@/api/plots.api'

export function useEditPlots() {
  const qc = useQueryClient()
  return useMutation<plots, Error, plots>({
    mutationFn: async (data) => {
      return await editPlots(data)
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['plots'] })
      if (variables.plot_id) {
        qc.invalidateQueries({ queryKey: ['plotDetails', variables.plot_id] })
      }
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
    staleTime: 30000, // Data considered fresh for 30 seconds
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

export { editPlots, createPlots }
