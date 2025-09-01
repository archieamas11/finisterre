import { Outlet } from 'react-router-dom'

import UserDashboardNavbar from '@/pages/user/components/UserDashboardNavbar'

export default function UserLayout() {
  return (
    <div className="bg-background scrollbar-gutter-stable min-h-screen">
      <UserDashboardNavbar />
      <main className="mx-auto pt-12">
        <Outlet />
      </main>
    </div>
  )
}
