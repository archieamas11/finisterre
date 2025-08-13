import { Suspense } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import LoginV2 from "@/auth/page";
import Layout from "@/auth/layout";
import Logout from "@/auth/Logout";
import UserMap from "@/pages/user/contents/Map";
import ResetPassword from "@/auth/ResetPassword";
import ForgotPassword from "@/auth/ForgotPassword";
import MapPage from "@/components/layout/WebMapLayout";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import UserProfile from "@/pages/user/contents/Profile";
import UserServices from "@/pages/user/contents/Services";
import Bookings from "@/pages/admin/bookings/ManageBookings";
import LandingLayout from "@/components/layout/LandingLayout";
// Admin Imports
import AdminDashboard from "@/pages/admin/home/AdminDashboard";
// User Imports
import UserDashboard from "@/pages/user/contents/UserDashboard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminMapLayout from "@/pages/admin/map4admin/AdminMapLayout";
import IntermentSetup from "@/pages/admin/interment/IntermentSetup";
import { RequireAdmin, RequireAuth, RequireUser } from "@/authRoutes";
import AdminControlPanel from "@/pages/admin/control/AdminControlPanel";
import AdminIntermentDeceasedPage from "@/pages/admin/interment/deceased";
import AdminIntermentLotOwnersPage from "@/pages/admin/interment/lot-owners";
import AdminIntermentCustomerPage from "./pages/admin/interment/customer/customers";

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingLayout />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/login" element={<Layout><LoginV2 /></Layout>} />
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
    </BrowserRouter>
  );
}
