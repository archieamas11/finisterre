import { useEffect } from 'react'
import { useLocation, useNavigate, Outlet } from 'react-router-dom'

import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { SiteHeader } from '@/components/sidebar/site-header'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import {
  findSidebarItemByPath,
  getSidebarItems
} from '@/navigation/sidebar/sidebar-items'
import { isAuthenticated, isAdmin } from '@/utils/auth.utils'

interface DashboardLayoutProps {
  role: 'admin' | 'user'
}

export default function DashboardLayout({ role }: DashboardLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login')
      return
    }
    const userIsAdmin = isAdmin()
    if (
      (role === 'admin' && !userIsAdmin) ||
      (role === 'user' && userIsAdmin)
    ) {
      navigate(userIsAdmin ? '/admin' : '/user')
      return
    }
  }, [role, navigate])

  // Find the current main/sub item for breadcrumb
  const breadcrumbItem = findSidebarItemByPath(
    location.pathname,
    role === 'admin'
  )

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)'
        } as React.CSSProperties
      }
    >
      <AppSidebar
        items={getSidebarItems(role === 'admin')}
        variant='floating'
      />
      <SidebarInset>
        <SiteHeader breadcrumbItem={breadcrumbItem} />
        <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
