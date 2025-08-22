import { useMutation, useQueryClient } from '@tanstack/react-query'

import { loginUser, type LoginResponse } from '@/api/auth.api'

export function useLoginMutation() {
  const qc = useQueryClient()
  return useMutation<
    { username: string; password: string },
    unknown,
    { username: string; password: string },
    unknown
  >({
    mutationKey: ['auth', 'login'],
    mutationFn: async (vars) => {
      const res: LoginResponse = await loginUser(vars.username, vars.password)
      if (!res.success) throw Object.assign(new Error(res.message), { res })
      return vars
    },
    onSuccess: async () => {
      // no-op, caller handles navigation and toasts
      // The token is saved in the caller for explicit control
      await qc.invalidateQueries({ queryKey: ['auth', 'me'] })
    }
  })
}

export function useLogoutMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['auth', 'logout'],
    mutationFn: async () => {
      localStorage.removeItem('token')
      localStorage.removeItem('isAdmin')
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['auth', 'me'] })
    }
  })
}
