import { Outlet } from 'react-router-dom'
import UserDashboardNavbar from '@/components/layout/UserDashboardNavbar'

export default function UserLayout() {
  return (
    <div className="bg-background scrollbar-gutter-stable min-h-screen">
      <UserDashboardNavbar />
      <main className="container mx-auto px-4 py-6 pt-16">
        <Outlet />
      </main>
    </div>
  )
}
