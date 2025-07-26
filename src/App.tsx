import { Suspense, type JSX } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/contents/AdminDashboard";
import IntermentSetup from "./pages/admin/contents/IntermentSetup";
import AdminMap from "@/pages/admin/contents/Map";
import Services from "@/pages/admin/contents/Services";
import ManageAccounts from "@/pages/admin/contents/ManageAccounts";
import LandingPage from "@/pages/LandingPage";
import UserDashboard from "@/pages/user/contents/UserDashboard";
import MapPage from "@/pages/MapPage";
import LoginV2 from "@/auth/page";
import ForgotPassword from "@/auth/ForgotPassword";
import ResetPassword from "@/auth/ResetPassword";
import Logout from "@/auth/Logout";
import Layout from "@/auth/layout";

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

// Unauthorized page component (you can create this)
const Unauthorized = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-red-500">Unauthorized Access</h1>
      <p className="mt-2">You don't have permission to view this page.</p>
      <button 
        onClick={() => window.location.href = '/login'}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go to Login
      </button>
    </div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/login" element={
            isAuthenticated() ? 
              (isAdmin() ? <Navigate to="/admin" /> : <Navigate to="/user" />) : 
              <Layout><LoginV2 /></Layout>
          } />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* User Protected Routes */}
          <Route path="/user" element={
            <ProtectedRoute>
              <UserRoute>
                <UserDashboard />
              </UserRoute>
            </ProtectedRoute>
          } />
          
          {/* Admin Protected Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="interment-setup" element={<IntermentSetup />} />
            <Route path="map" element={<AdminMap />} />
            <Route path="services" element={<Services />} />
            <Route path="manage-accounts" element={<ManageAccounts />} />
          </Route>
          
          {/* Catch all unmatched routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}