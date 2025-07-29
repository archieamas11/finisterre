import { Suspense, type JSX } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "@/pages/admin/home/AdminDashboard";
import AdminMap from "@/pages/admin/map4admin/AdminMap";
import CustomersTablePage from "@/pages/admin/interment/CustomersTablePage";
import LotOwnersTablePage from "@/pages/admin/interment/LotOwnersTablePage";
import DeceasedTablePage from "@/pages/admin/interment/DeceasedTablePage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ForgotPassword from "@/auth/ForgotPassword";
import LandingLayout from "@/components/layout/LandingLayout";
import Layout from "@/auth/layout";
import LoginV2 from "@/auth/page";
import Logout from "@/auth/Logout";
import ManageAccounts from "@/pages/admin/accounts/ManageAccounts";
import MapPage from "@/components/layout/WebMapLayout";
import ResetPassword from "@/auth/ResetPassword";
import Services from "@/pages/admin/services/Services";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import UserDashboard from "@/pages/user/contents/UserDashboard";
import UserMap from "@/pages/user/contents/Map";
import UserProfile from "@/pages/user/contents/Profile";
import UserServices from "@/pages/user/contents/Services";
import IntermentSetup from "./pages/admin/interment/IntermentSetup";
import AdminControlPanel from '@/pages/admin/control/AdminControlPanel';

// Auth utility functions
const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

const isAdmin = (): boolean => {
  return localStorage.getItem("isAdmin") === "1";
};

// Protected Route Components
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() && isAdmin() ? children : <Navigate to="/unauthorized" />;
};

const UserRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() && !isAdmin() ? children : <Navigate to="/unauthorized" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingLayout />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/login" element={
            isAuthenticated() ?
              (isAdmin() ? <Navigate to="/admin" /> : <Navigate to="/user" />) :
              <Layout><LoginV2 /></Layout>
          } />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* User Protected Routes */}
          <Route path="/user" element={
            <ProtectedRoute>
              <UserRoute>
                <DashboardLayout role="user" />
              </UserRoute>
            </ProtectedRoute>
          }>
            <Route index element={<UserDashboard />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="services" element={<UserServices />} />
            <Route path="map" element={<UserMap />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminRoute>
                <DashboardLayout role="admin" />
              </AdminRoute>
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="interment-setup" element={<IntermentSetup />}>
              <Route path="customers" element={<CustomersTablePage />} />
              <Route path="lot-owners" element={<LotOwnersTablePage />} />
              <Route path="deceased-records" element={<DeceasedTablePage />} />
            </Route>
            <Route path="map" element={<AdminMap />} />
            <Route path="services" element={<Services />} />
            <Route path="manage-accounts" element={<ManageAccounts />} />
            <Route path="control-panel" element={<AdminControlPanel />} />
          </Route>

          {/* Catch all unmatched routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}