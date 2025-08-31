import { useQuery } from '@tanstack/react-query'

import { getUserDashboard } from '@/api/users.api'
import { isAuthenticated } from '@/utils/auth.utils'

export function useUserDashboard() {
  const enabled = isAuthenticated()

  return useQuery({
    queryKey: ['user', 'dashboard'],
    queryFn: async () => {
      const response = await getUserDashboard()
      if (!response.success) {
        throw new Error(response.message)
      }
      return response.data
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
