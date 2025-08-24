import { toast } from 'sonner'

import { useLogoutMutation } from '@/hooks/useAuthMutations'

type ClearClientStateFn = () => void

export function useLogout() {
  const navigate = useNavigate()
  const mutation = useLogoutMutation()

  const performLogout = useCallback(
    async (clearClientState?: ClearClientStateFn, redirect = '/') => {
      try {
        toast.promise(mutation.mutateAsync(), {
          loading: 'Logging out...',
          success: 'You have been logged out successfully',
          error: 'Failed to log out. Please try again.',
        })

        if (typeof clearClientState === 'function') {
          try {
            clearClientState()
          } catch (err) {
            console.error('Error clearing client state:', err)
          }
        }

        navigate(redirect, { replace: true })
        return true
      } catch (error) {
        console.error('Logout error:', error)
        return false
      }
    },
    [mutation, navigate],
  )

  return { performLogout, isPending: mutation.isPending }
}
