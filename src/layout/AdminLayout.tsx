import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { SiteHeader } from '@/components/sidebar/site-header'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { findSidebarItemByPath, getSidebarItems } from '@/navigation/sidebar/sidebar-items'
import { isAuthenticated, isAdmin } from '@/utils/auth.utils'

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login')
      return
    }
    if (!isAdmin()) {
      navigate('/user')
      return
    }
  }, [navigate])

  // Find the current main/sub item for breadcrumb
  const breadcrumbItem = findSidebarItemByPath(location.pathname, true)

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar items={getSidebarItems(true)} variant="floating" />
      <SidebarInset>
        <SiteHeader breadcrumbItem={breadcrumbItem} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
