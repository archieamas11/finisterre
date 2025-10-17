import { useQuery } from '@tanstack/react-query'

import { getCsrfToken } from '@/api/auth.api'

export function useCsrfToken() {
  const query = useQuery({
    queryKey: ['csrfToken'],
    queryFn: getCsrfToken,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 2,
  })

  return {
    token: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
