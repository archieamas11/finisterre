
import { lazy } from "react";
import AdminLayout from "@/pages/admin/AdminLayout";
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const UserDashboard = lazy(() => import("@/pages/user/UserDashboard"));
const AdminDashboard = lazy(() => import("@/pages/admin/contents/AdminDashboard"));
import IntermentSetup from "./pages/admin/contents/IntermentSetup";
const AdminMap = lazy(() => import("@/pages/admin/contents/Map"));
const Services = lazy(() => import("@/pages/admin/contents/Services"));
const ManageAccounts = lazy(() => import("@/pages/admin/contents/ManageAccounts"));
const MapPage = lazy(() => import("@/pages/MapPage"));
import LoginPage from "@/auth/LoginPage";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import Logout from "./auth/Logout";

export const routes = [
  { path: "/", element: <LandingPage /> },
  { path: "/user", element: <UserDashboard /> },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "", element: <AdminDashboard /> },
      { path: "interment-setup", element: <IntermentSetup /> },
      { path: "map", element: <AdminMap /> },
      { path: "services", element: <Services /> },
      { path: "manage-accounts", element: <ManageAccounts /> },
    ],
  },
  { path: "/map", element: <MapPage /> },

  // auth page
  { path: "/login", element: <LoginPage /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/logout", element: <Logout /> },

  // UserDashboard
  { path: "/user-dashboard", element: <ForgotPassword /> },
  { path: "/interment-setup", element: <ResetPassword /> },
  { path: "/manage-accounts", element: <Logout /> },
  { path: "/manage-services", element: <Logout /> },
  { path: "/mananage-map", element: <Logout /> },
];
