import { useQuery } from '@tanstack/react-query'

import { getUserDashboard, parseCoordinates } from '@/api/users.api'
import { isAuthenticated } from '@/utils/auth.utils'

// Default data structure to ensure consistent response shape
const DEFAULT_DASHBOARD_DATA = {
  connected_memorials: 0,
  active_lots: 0,
  upcoming_events: 0,
  lots: [],
  deceased_records: [],
  customer_id: null,
}

export function useUserDashboard() {
  const enabled = isAuthenticated()

  return useQuery({
    queryKey: ['user', 'dashboard'],
    queryFn: async () => {
      const response = await getUserDashboard()

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch dashboard data')
      }

      const data = response.data || {}

      // Transform lots data with coordinate parsing
      const transformedLots = (data.lots || []).map((lot) => ({
        ...lot,
        coordinates: parseCoordinates(lot.coordinates),
      }))

      return {
        connected_memorials: data.connected_memorials ?? DEFAULT_DASHBOARD_DATA.connected_memorials,
        active_lots: data.active_lots ?? DEFAULT_DASHBOARD_DATA.active_lots,
        upcoming_events: data.upcoming_events ?? DEFAULT_DASHBOARD_DATA.upcoming_events,
        lots: transformedLots,
        deceased_records: data.deceased_records ?? DEFAULT_DASHBOARD_DATA.deceased_records,
        customer_id: data.customer_id ?? DEFAULT_DASHBOARD_DATA.customer_id,
      }
    },
    enabled,
  })
}
