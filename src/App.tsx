import { Suspense } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import LandingLayout from "@/components/layout/LandingLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import MapPage from "@/components/layout/WebMapLayout";
import { RequireAdmin, RequireAuth, RequireUser } from "@/authRoutes";
import { ErrorBoundary } from "react-error-boundary";
import React from "react";

// Type for ErrorFallback props
interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

// Lazy imports
const LoginPage = React.lazy(() => import("@/auth/LoginPage"));
const Logout = React.lazy(() => import("@/auth/Logout"));
const UserMap = React.lazy(() => import("@/pages/user/contents/Map"));
const ResetPassword = React.lazy(() => import("@/auth/ResetPassword"));
const ForgotPassword = React.lazy(() => import("@/auth/ForgotPassword"));
const UnauthorizedPage = React.lazy(() => import("@/pages/UnauthorizedPage"));
const UserProfile = React.lazy(() => import("@/pages/user/contents/Profile"));
const UserServices = React.lazy(() => import("@/pages/user/contents/Services"));
const Bookings = React.lazy(() => import("@/pages/admin/bookings/ManageBookings"));
const AdminDashboard = React.lazy(() => import("@/pages/admin/home/AdminDashboard"));
const UserDashboard = React.lazy(() => import("@/pages/user/contents/UserDashboard"));
const AdminMapLayout = React.lazy(() => import("@/pages/admin/map4admin/AdminMapLayout"));
const IntermentSetup = React.lazy(() => import("@/pages/admin/interment/IntermentSetup"));
const AdminControlPanel = React.lazy(() => import("@/pages/admin/control/AdminControlPanel"));
const AdminIntermentDeceasedPage = React.lazy(() => import("@/pages/admin/interment/deceased"));
const AdminIntermentLotOwnersPage = React.lazy(() => import("@/pages/admin/interment/lot-owners/lot-owners"));
const AdminIntermentCustomerPage = React.lazy(() => import("./pages/admin/interment/customer/CustomersLayout"));

// Loading Component
const LoadingSpinner = () => (
  <div className="bg-background flex min-h-screen items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="border-primary h-12 w-12 animate-spin rounded-full border-b-2"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Error Fallback Component with proper TypeScript types
const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => (
  <div className="bg-background flex min-h-screen items-center justify-center">
    <div className="max-w-md p-6 text-center">
      <h2 className="text-destructive mb-2 text-xl font-bold">Something went wrong</h2>
      <p className="text-muted-foreground mb-4">{error.message}</p>
      <button onClick={resetErrorBoundary} className="bg-primary text-primary-foreground rounded-md px-4 py-2 transition-opacity hover:opacity-90" type="button">
        Try again
      </button>
    </div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingLayout />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* User Protected Routes */}
            <Route
              element={
                <RequireAuth>
                  <RequireUser>
                    <DashboardLayout role="user" />
                  </RequireUser>
                </RequireAuth>
              }
              path="/user"
            >
              <Route element={<UserDashboard />} index />
              <Route element={<UserProfile />} path="profile" />
              <Route element={<UserServices />} path="services" />
              <Route element={<UserMap />} path="map" />
            </Route>

            {/* Admin Protected Routes */}
            <Route
              element={
                <RequireAuth>
                  <RequireAdmin>
                    <DashboardLayout role="admin" />
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
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
