import { useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/api/axiosInstance'

interface MeResponse {
  success: boolean
  message: string
  user?: {
    user_id: number | null
    username: string | null
    role: 'admin' | 'staff' | 'user'
    iat: number | null
    exp: number | null
  }
}

export function useAuthQuery() {
  const qc = useQueryClient()
  const query = useQuery<MeResponse>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await api.get<MeResponse>('auth/me.php')
      return res.data
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('token'),
    staleTime: 1000 * 60, // 1 minute
  })

  function setAuthFromToken() {
    try {
      const token = localStorage.getItem('token')
      if (!token) return
      const payload = JSON.parse(atob(token.split('.')[1] ?? ''))
      qc.setQueryData<MeResponse>(['auth', 'me'], () => ({
        success: true,
        message: 'Cached',
        user: {
          user_id: payload.user_id ?? null,
          username: payload.username ?? null,
          role: (payload.role as 'admin' | 'staff' | 'user') ?? 'user',
          iat: payload.iat ?? null,
          exp: payload.exp ?? null,
        },
      }))
    } catch {
      // ignore
    }
  }

  return { ...query, setAuthFromToken }
}
