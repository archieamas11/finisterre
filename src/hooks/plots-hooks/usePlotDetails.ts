import { useQuery } from '@tanstack/react-query'

import type { DeceasedData as DeceasedType } from '@/types/deceased.types'

import { getPlotDetails } from '@/api/plots.api'

interface OwnerData {
  lot_id?: string
  fullname: string
  email: string
  contact: string
  customer_id: string
}

interface PlotDetailsData {
  owner: OwnerData | null
  deceased: DeceasedType[]
}

export const usePlotDetails = (plot_id: string) => {
  return useQuery<PlotDetailsData>({
    queryKey: ['plotDetails', plot_id],
    queryFn: async () => {
      if (!plot_id) {
        throw new Error('Plot ID is required')
      }

      const response = await getPlotDetails(plot_id)

      if (!response?.success) {
        throw new Error(response?.message || 'Failed to fetch plot details')
      }

      return {
        owner: response.owner || null,
        deceased: Array.isArray(response.deceased) ? response.deceased : [], // Ensure array
      }
    },
    enabled: !!plot_id,
    staleTime: 0, // Always consider data stale for immediate refetch when invalidated
    gcTime: 2 * 60 * 1000, // 2 minutes garbage collection time
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchOnMount: true, // Always refetch on component mount
    retry: 2,
  })
}
