import { useQuery } from '@tanstack/react-query'

import { fetchMe } from '@/api/auth.api'
import { isAuthenticated } from '@/utils/auth.utils'
import { dicebearAdventurerUrl } from '@/utils/avatar'

// Simple hook to get current user info from token backend
export function useMe() {
  const enabled = isAuthenticated()
  const query = useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
    enabled,
    staleTime: 5 * 60 * 1000,
  })

  const user = query.data?.user
  return {
    user: user
      ? {
          // Map backend fields to ProfileMenu expected props
          name: user.username ?? 'User',
          email: user.username ? `${user.username}@example.com` : 'unknown@example.com',
          avatar: dicebearAdventurerUrl(user.username || String(user.user_id || 'guest')),
          isAdmin: user.isAdmin,
          customerId: user.customer_id ?? null,
        }
      : null,
    isLoading: query.isLoading,
    isError: query.isError || (query.data && !query.data.success),
  }
}
