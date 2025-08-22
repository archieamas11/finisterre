import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { useLogoutMutation } from '@/hooks/useAuthMutations'

export function useLogout(redirectTo: string = '/') {
  const navigate = useNavigate()
  const mutation = useLogoutMutation()

  const performLogout = async (clearClientState?: () => void) => {
    try {
      toast.promise(mutation.mutateAsync(), {
        loading: 'Logging out...',
        success: 'You have been logged out successfully',
        error: 'Failed to log out. Please try again.'
      })

      if (clearClientState) {
        try {
          clearClientState()
        } catch (err) {
          console.error('Error clearing client state:', err)
        }
      }

      navigate(redirectTo)
      return true
    } catch (error) {
      console.error('Logout error:', error)
      return false
    }
  }

  return { performLogout, isPending: mutation.isPending }
}
