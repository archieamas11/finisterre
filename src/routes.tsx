
import { lazy } from "react";
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const UserDashboard = lazy(() => import("@/pages/user/UserDashboard"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const MapPage = lazy(() => import("@/pages/MapPage"));
import LoginPage from "@/auth/LoginPage";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";

export const routes = [
  { path: "/", element: <LandingPage /> },
  { path: "/user", element: <UserDashboard /> },
  { path: "/admin", element: <AdminDashboard /> },
  { path: "/map", element: <MapPage /> },

  // auth page
  { path: "/login", element: <LoginPage /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> }
];
