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
import DeceasedTablePage from "@/pages/admin/interment/DeceasedTablePage";
import LotOwnersTablePage from "@/pages/admin/interment/LotOwnersTablePage";

import MapLibre from "./components/webmap/testing/MapLibre";
import CustomersPage from "./pages/admin/interment/customer/CustomerPage";

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route element={<LandingLayout />} path="/" />
          <Route element={<MapPage />} path="/map" />
          <Route element={<MapLibre />} path="/mapLibre" />
          <Route
            element={
              <Layout>
                <LoginV2 />
              </Layout>
            }
            path="/login"
          />
          <Route element={<ForgotPassword />} path="/forgot-password" />
          <Route element={<ResetPassword />} path="/reset-password" />
          <Route element={<Logout />} path="/logout" />
          <Route element={<UnauthorizedPage />} path="/unauthorized" />

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
              <Route element={<CustomersPage />} path="customers" />
              <Route element={<LotOwnersTablePage />} path="lot-owners" />
              <Route element={<DeceasedTablePage />} path="deceased-records" />
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
