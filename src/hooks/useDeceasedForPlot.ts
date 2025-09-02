import { useQuery } from '@tanstack/react-query'

import { getDeceasedRecordsForPlot } from '@/api/deceased.api'
import { useAuth } from '@/hooks/useAuth'

export function useDeceasedForPlot(plotId: string) {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['deceased', 'plot', plotId],
    queryFn: async () => {
      const response = await getDeceasedRecordsForPlot(plotId)
      if (!response.success) {
        throw new Error(response.message)
      }
      return response.deceased || []
    },
    enabled: isAuthenticated && !!plotId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
