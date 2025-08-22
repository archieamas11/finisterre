import { useAuthQuery } from '@/hooks/useAuthQuery'

interface AuthState {
  isAdmin: boolean
  isAuthenticated: boolean
  isLoading: boolean
}

export function useAuth(): AuthState {
  const { data, isSuccess, isPending } = useAuthQuery()
  const tokenExists =
    typeof window !== 'undefined' && !!localStorage.getItem('token')
  const isAuthenticated = !!(tokenExists && isSuccess && data?.success)
  const isAdmin = !!data?.user?.isAdmin
  return { isAdmin, isAuthenticated, isLoading: tokenExists && isPending }
}
