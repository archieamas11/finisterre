import { useMutation, useQueryClient } from '@tanstack/react-query'

import { loginUser, type LoginResponse } from '@/api/auth.api'

export function useLoginMutation() {
  const qc = useQueryClient()
  return useMutation<void, unknown, { username: string; password: string; csrf_token: string; recaptcha_token?: string; honeypot?: string }, unknown>(
    {
      mutationKey: ['auth', 'login'],
      mutationFn: async (vars) => {
        const res: LoginResponse = await loginUser(vars.username, vars.password, vars.csrf_token, vars.recaptcha_token, vars.honeypot)
        if (!res.success) throw Object.assign(new Error(res.message), { res })
      },
      onSuccess: async () => {
        await qc.invalidateQueries({ queryKey: ['auth', 'me'] })
        await qc.invalidateQueries({ queryKey: ['me'] })
      },
    },
  )
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
      await qc.invalidateQueries({ queryKey: ['me'] })
    },
  })
}
