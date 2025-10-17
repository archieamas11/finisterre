import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { useLogoutMutation } from '@/hooks/useAuthMutations'
import { logout as clearAuthStorage } from '@/utils/auth.utils'
import { isNativePlatform } from '@/utils/platform.utils'

type ClearClientStateFn = () => void

export function useLogout() {
  const navigate = useNavigate()
  const mutation = useLogoutMutation()
  const qc = useQueryClient()

  const performLogout = useCallback(
    async (clearClientState?: ClearClientStateFn, redirect?: string) => {
      const redirectPath = redirect ?? (isNativePlatform() ? '/landing-android' : '/')
      try {
        await toast.promise(mutation.mutateAsync(), {
          loading: 'Logging out...',
          success: 'You have been logged out successfully',
          error: 'Failed to log out. Please try again.',
        })

        try {
          clearAuthStorage()
        } catch (err) {
          console.error('Error clearing local auth storage:', err)
        }

        try {
          qc.cancelQueries({ queryKey: ['auth', 'me'] })
          qc.removeQueries({ queryKey: ['auth', 'me'] })
        } catch {
          console.error('Error clearing auth queries')
        }

        if (typeof clearClientState === 'function') {
          try {
            clearClientState()
          } catch {
            console.error('Error clearing client state:')
          }
        }

        try {
          if (isNativePlatform()) {
            navigate(redirectPath, { replace: true })
          } else {
            window.location.replace(redirectPath)
          }
        } catch {
          navigate(redirectPath, { replace: true })
        }
        return true
      } catch (error) {
        console.error('Logout error:', error)
        return false
      }
    },
    [mutation, navigate, qc],
  )

  return { performLogout, isPending: mutation.isPending }
}
