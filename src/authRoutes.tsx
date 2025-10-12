import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()
  if (isLoading) return null
  if (!isAuthenticated) {
    return <Navigate state={{ from: location }} to="/login" replace />
  }
  return <>{children}</>
}

export const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const { role, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()
  if (isLoading) return null
  if (!isAuthenticated || (role !== 'admin' && role !== 'staff')) {
    return <Navigate state={{ from: location }} to="/unauthorized" replace />
  }
  return <>{children}</>
}

export const RequireUser = ({ children }: { children: React.ReactNode }) => {
  const { role, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()
  if (isLoading) return null
  if (!isAuthenticated || role !== 'user') {
    return <Navigate state={{ from: location }} to="/unauthorized" replace />
  }
  return <>{children}</>
}
