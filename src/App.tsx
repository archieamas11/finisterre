import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/contents/AdminDashboard";
import IntermentSetup from "./pages/admin/contents/IntermentSetup";
import AdminMap from "@/pages/admin/contents/Map";
import Services from "@/pages/admin/contents/Services";
import ManageAccounts from "@/pages/admin/contents/ManageAccounts";
import LandingPage from "@/pages/LandingPage";
import UserDashboard from "@/pages/user/UserDashboard";
import MapPage from "@/pages/MapPage";
import LoginPage from "@/auth/LoginPage";
import ForgotPassword from "@/auth/ForgotPassword";
import ResetPassword from "@/auth/ResetPassword";
import Logout from "@/auth/Logout";

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="interment-setup" element={<IntermentSetup />} />
            <Route path="map" element={<AdminMap />} />
            <Route path="services" element={<Services />} />
            <Route path="manage-accounts" element={<ManageAccounts />} />
          </Route>
          <Route path="/map" element={<MapPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}