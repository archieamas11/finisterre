import { useQuery } from '@tanstack/react-query'

import { fetchMe } from '@/api/auth.api'
import { isAuthenticated } from '@/utils/auth.utils'
import { dicebearAdventurerUrl } from '@/utils/avatar'

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
          name: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : (user.username ?? 'User'),
          email: user.email ?? (user.username ? `${user.username}@finisterre.site` : 'unknown@gmail.com'),
          avatar: dicebearAdventurerUrl(user.username || String(user.user_id || 'guest')),
          role: user.role,
          customerId: user.customer_id ?? null,
        }
      : null,
    isLoading: query.isLoading,
    isError: query.isError || (query.data && !query.data.success),
  }
}
