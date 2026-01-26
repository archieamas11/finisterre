import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { RequireAdmin, RequireAuth, RequireUser } from '@/authRoutes'
import Spinner from '@/components/ui/spinner'
import { useAppLinks } from '@/hooks/useAppLinks'
import LandingLayout from '@/layout/LandingLayout'
import { isNativePlatform } from '@/utils/platform.utils'

const ErrorFallback = React.lazy(() => import('@/components/ErrorFallback'))
const LoginPage = React.lazy(() => import('@/auth/LoginPage'))
const Logout = React.lazy(() => import('@/auth/Logout'))
const UserMap = React.lazy(() => import('@/pages/user/UserMap'))
const ResetPassword = React.lazy(() => import('@/auth/ResetPassword'))
const ForgotPassword = React.lazy(() => import('@/auth/ForgotPassword'))
const UnauthorizedPage = React.lazy(() => import('@/pages/UnauthorizedPage'))
const UserProfile = React.lazy(() => import('@/pages/user/UserProfile'))
const UserAnnouncements = React.lazy(() => import('@/pages/user/AnnouncementsPage'))
const Bookings = React.lazy(() => import('@/pages/admin/bookings/ManageBookings'))
const AdminDashboard = React.lazy(() => import('@/pages/admin/home/AdminDashboard'))
const UserDashboard = React.lazy(() => import('@/pages/user/UserDashboard'))
const AdminMapPage = React.lazy(() => import('@/pages/admin/map4admin/AdminMapPage'))
const IntermentSetup = React.lazy(() => import('@/pages/admin/interment/IntermentSetup'))
const AdminControlPanel = React.lazy(() => import('@/pages/admin/control/AdminControlPanel'))
const AdminIntermentDeceasedPage = React.lazy(() => import('@/pages/admin/interment/deceased-records/deceased'))
const AdminIntermentLotOwnersPage = React.lazy(() => import('@/pages/admin/interment/lot-owners/lot-owners'))
const AdminIntermentCustomerPage = React.lazy(() => import('@/pages/admin/interment/customer/CustomersLayout'))
const AdminLayout = React.lazy(() => import('@/layout/AdminLayout'))
const UserLayout = React.lazy(() => import('@/layout/UserLayout'))
const AndroidLayout = React.lazy(() => import('@/pages/android/AndroidLayout'))
const PublicMap = React.lazy(() => import('@/pages/webmap/PublicWebMap'))
const NewsAndUpdates = React.lazy(() => import('@/pages/admin/news/NewsAndUpdates'))
const NotFound = React.lazy(() => import('@/pages/NotFound'))
const About = React.lazy(() => import('@/pages/public/about'))
const Services = React.lazy(() => import('@/pages/public/products/Services'))
const UnknownQuestionsViewer = React.lazy(() => import('@/pages/public/chatbot/UnknownQuestionsViewer'))

function RootLanding() {
  const location = useLocation()
  if (location.pathname === '/' && isNativePlatform()) {
    return <Navigate to="/landing-android" replace />
  }
  return <LandingLayout />
}

function AppRoutes() {
  // Hook to handle incoming Android App Links and deep links
  useAppLinks()

  return (
    <Suspense
      fallback={
        <div className="relative flex h-screen w-full items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<RootLanding />}>
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
          </Route>
          <Route path="/map" element={<PublicMap />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/landing-android" element={<AndroidLayout />} />
          <Route path="/questions" element={<UnknownQuestionsViewer />} />

          {/* User Protected Routes */}
          <Route
            element={
              <RequireAuth>
                <RequireUser>
                  <UserLayout />
                </RequireUser>
              </RequireAuth>
            }
            path="/user"
          >
            <Route element={<UserDashboard />} index />
            <Route element={<UserProfile />} path="profile" />
            <Route element={<UserMap />} path="map" />
            <Route element={<UserAnnouncements />} path="announcements" />
          </Route>

          {/* Admin Protected Routes */}
          <Route
            element={
              <RequireAuth>
                <RequireAdmin>
                  <AdminLayout />
                </RequireAdmin>
              </RequireAuth>
            }
            path="/admin"
          >
            <Route element={<AdminDashboard />} index />
            <Route element={<IntermentSetup />} path="interment-setup">
              <Route element={<AdminIntermentCustomerPage />} path="customers" />
              <Route element={<AdminIntermentLotOwnersPage />} path="lot-owners" />
              <Route element={<AdminIntermentDeceasedPage />} path="deceased-records" />
            </Route>
            <Route element={<AdminMapPage />} path="map" />
            <Route element={<Bookings />} path="bookings" />
            <Route element={<AdminControlPanel />} path="control-panel" />
            <Route element={<NewsAndUpdates />} path="news" />
          </Route>

          {/* Catch all invalid routes */}
          <Route element={<NotFound />} path="*" />
        </Routes>
      </ErrorBoundary>
    </Suspense>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
