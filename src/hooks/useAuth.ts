import { useAuthQuery } from '@/hooks/useAuthQuery'

interface AuthState {
  isAdmin: boolean
  role: 'admin' | 'staff' | 'user' | null
  isAuthenticated: boolean
  isLoading: boolean
}

export function useAuth(): AuthState {
  const { data, isSuccess, isPending } = useAuthQuery()
  const tokenExists = typeof window !== 'undefined' && !!localStorage.getItem('token')
  const isAuthenticated = !!(tokenExists && isSuccess && data?.success)
  const role = (data?.user?.role as 'admin' | 'staff' | 'user' | undefined) ?? (localStorage.getItem('role') as 'admin' | 'staff' | 'user' | null)
  const isAdmin = role === 'admin'
  return { isAdmin, role: role ?? null, isAuthenticated, isLoading: tokenExists && isPending }
}
