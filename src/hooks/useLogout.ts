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
      // Determine redirect path based on platform if not explicitly provided
      const redirectPath = redirect ?? (isNativePlatform() ? '/landing-android' : '/')
      try {
        // Ensure we await the mutation so navigation happens after logout completes
        await toast.promise(mutation.mutateAsync(), {
          loading: 'Logging out...',
          success: 'You have been logged out successfully',
          error: 'Failed to log out. Please try again.',
        })

        // Clear client auth (localStorage) before navigating so queries won't retry with a stale token
        try {
          clearAuthStorage()
        } catch (err) {
          console.error('Error clearing local auth storage:', err)
        }

        // Cancel and remove any auth queries so they don't refire with the old token
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

        // Use appropriate navigation method based on platform
        try {
          if (isNativePlatform()) {
            // For native platforms, use React Router navigate to stay within the app
            navigate(redirectPath, { replace: true })
          } else {
            // For web platforms, use window.location.replace for hard navigation
            window.location.replace(redirectPath)
          }
        } catch {
          // fallback to react-router navigate if window isn't available
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
