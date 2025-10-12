import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { SiteHeader } from '@/components/sidebar/site-header'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { findSidebarItemByPath, getSidebarItems, type UserRole } from '@/navigation/sidebar/sidebar-items'
import { isAuthenticated } from '@/utils/auth.utils'
import { useAuthQuery } from '@/hooks/useAuthQuery'

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { data: auth } = useAuthQuery()
  const role = (auth?.user?.role ?? (localStorage.getItem('role') as UserRole | null) ?? 'user') as UserRole

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login')
      return
    }
    if (role === 'user') navigate('/user')
  }, [navigate, role])

  const breadcrumbItem = useMemo(() => findSidebarItemByPath(location.pathname, role), [location.pathname, role])

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar items={getSidebarItems(role)} variant="floating" />
      <SidebarInset>
        <SiteHeader breadcrumbItem={breadcrumbItem} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
