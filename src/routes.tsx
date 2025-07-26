import { lazy } from "react";
import AdminLayout from "@/pages/admin/AdminLayout";
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const AdminDashboard = lazy(() => import("@/pages/admin/contents/AdminDashboard"));
import IntermentSetup from "./pages/admin/contents/IntermentSetup";
const AdminMap = lazy(() => import("@/pages/admin/contents/Map"));
const Services = lazy(() => import("@/pages/admin/contents/Services"));
const ManageAccounts = lazy(() => import("@/pages/admin/contents/ManageAccounts"));
const MapPage = lazy(() => import("@/pages/MapPage"));
import LoginV2 from "@/auth/page";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import Logout from "./auth/Logout";
import UserLayout from "@/pages/user/UserLayout";
import Layout from "@/auth/layout";
const UserDashboard = lazy(() => import("@/pages/user/contents/UserDashboard"));
const UserOrdersStatus = lazy(() => import("@/pages/user/contents/OrdersStatus"));
const UserServices = lazy(() => import("@/pages/user/contents/Services"));
const UserMap = lazy(() => import("@/pages/user/contents/Map"));

export const routes = [
  { path: "/", element: <LandingPage /> },
  {
    // admin dashboard
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
  {
    // user dashboard
    path: "/user",
    element: <UserLayout />,
    children: [
      { path: "", element: <UserDashboard /> },
      { path: "orders-status", element: <UserOrdersStatus /> },
      { path: "services", element: <UserServices /> },
      { path: "map", element: <UserMap /> },
    ],
  },
  { path: "/map", element: <MapPage /> },

  // auth page
  { path: "/login", element: <Layout><LoginV2 /></Layout> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/logout", element: <Logout /> },
];
