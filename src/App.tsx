import { Capacitor } from '@capacitor/core'
import { Suspense } from 'react'
import React from 'react'
import { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'

import { RequireAdmin, RequireAuth, RequireUser } from '@/authRoutes'
import Spinner from '@/components/ui/spinner'
const ErrorFallback = React.lazy(() => import('@/components/ErrorFallback'))
const LoginPage = React.lazy(() => import('@/auth/LoginPage'))
const Logout = React.lazy(() => import('@/auth/Logout'))
const UserMap = React.lazy(() => import('@/pages/user/UserMap'))
const ResetPassword = React.lazy(() => import('@/auth/ResetPassword'))
const ForgotPassword = React.lazy(() => import('@/auth/ForgotPassword'))
const UnauthorizedPage = React.lazy(() => import('@/pages/UnauthorizedPage'))
const UserProfile = React.lazy(() => import('@/pages/user/UserProfile'))
const Bookings = React.lazy(() => import('@/pages/admin/bookings/ManageBookings'))
const AdminDashboard = React.lazy(() => import('@/pages/admin/home/AdminDashboard'))
const UserDashboard = React.lazy(() => import('@/pages/user/UserDashboard'))
const AdminMapLayout = React.lazy(() => import('@/pages/admin/map4admin/AdminMapLayout'))
const IntermentSetup = React.lazy(() => import('@/pages/admin/interment/IntermentSetup'))
const AdminControlPanel = React.lazy(() => import('@/pages/admin/control/AdminControlPanel'))
const AdminIntermentDeceasedPage = React.lazy(() => import('@/pages/admin/interment/deceased-records/deceased'))
const AdminIntermentLotOwnersPage = React.lazy(() => import('@/pages/admin/interment/lot-owners/lot-owners'))
const AdminIntermentCustomerPage = React.lazy(() => import('@/pages/admin/interment/customer/CustomersLayout'))
const AdminLayout = React.lazy(() => import('@/layout/AdminLayout'))
const UserLayout = React.lazy(() => import('@/layout/UserLayout'))
const AndroidLandingPage = React.lazy(() => import('@/pages/android/AndroidLandingPage'))
const IosLandingPage = React.lazy(() => import('@/pages/ios/iosLandingPage'))
const PublicMap = React.lazy(() => import('@/pages/webmap/PublicWebMap'))
import LandingLayout from '@/layout/LandingLayout'

function AppRoutes() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Only redirect native platforms to their specific landing pages when on root path
    if (Capacitor.isNativePlatform() && location.pathname === '/') {
      const platform = Capacitor.getPlatform()
      if (platform === 'android') {
        navigate('/landing-android', { replace: true })
      } else if (platform === 'ios') {
        navigate('/landing-ios', { replace: true })
      }
    }
    // Web users can navigate freely between all routes
  }, [navigate, location.pathname])

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
          <Route path="/" element={<LandingLayout />} />
          <Route path="/map" element={<PublicMap />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/landing-android" element={<AndroidLandingPage />} />
          <Route path="/landing-ios" element={<IosLandingPage />} />

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
            <Route element={<AdminMapLayout />} path="map" />
            <Route element={<Bookings />} path="bookings" />
            <Route element={<AdminControlPanel />} path="control-panel" />
          </Route>

          {/* Catch all unmatched routes */}
          <Route element={<Navigate to="/" />} path="*" />
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
