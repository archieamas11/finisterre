import { useQuery } from '@tanstack/react-query'

import { getUserDashboard, parseCoordinates, testHealthCheck } from '@/api/users.api'
import { isAuthenticated } from '@/utils/auth.utils'

export function useUserDashboard() {
  const enabled = isAuthenticated()

  return useQuery({
    queryKey: ['user', 'dashboard'],
    queryFn: async () => {
      // 🏥 Temporary health check for debugging
      try {
        await testHealthCheck()
      } catch {
        console.log('Health check failed, but continuing with dashboard request')
      }

      try {
        const response = await getUserDashboard()
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch dashboard data')
        }

        // ⚠️ Ensure data structure is complete with fallbacks
        const data = response.data || {}

        // 🧮 Transform lots data with proper coordinate parsing
        const transformedLots = (data.lots || []).map((lot) => ({
          ...lot,
          coordinates: parseCoordinates(lot.coordinates),
        }))

        return {
          connected_memorials: data.connected_memorials || 0,
          active_lots: data.active_lots || 0,
          upcoming_events: data.upcoming_events || 0,
          lots: transformedLots,
          deceased_records: data.deceased_records || [],
          customer_id: data.customer_id || null,
        }
      } catch (error) {
        // ⚠️ Handle network errors gracefully
        if (error instanceof Error) {
          throw error
        }
        throw new Error('An unexpected error occurred while fetching dashboard data')
      }
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    // ⚡️ Add retry logic for better UX
    retry: (failureCount, error) => {
      // Don't retry authentication errors
      if (error instanceof Error && error.message.includes('token')) {
        return false
      }
      // Retry up to 2 times for other errors
      return failureCount < 2
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}
