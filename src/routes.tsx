import { lazy } from "react";
const LandingLayout = lazy(() => import("@/components/layout/LandingLayout"));
const IntermentSetup = lazy(() => import("@/pages/admin/interment/IntermentSetup"));
const AdminMapLayout = lazy(() => import("@/pages/admin/map4admin/AdminMapLayout"));
const Bookings = lazy(() => import("@/pages/admin/bookings/ManageBookings"));
const MapPage = lazy(() => import("@/components/layout/WebMapLayout"));
const MapLibre = lazy(() => import("@/components/webmap/testing/MapLibre"));
const AdminControlPanel = lazy(() => import("@/pages/admin/control/AdminControlPanel"));
const DashboardLayout = lazy(() => import("@/components/layout/DashboardLayout"));

import LoginV2 from "@/auth/page";
import Logout from "@/auth/Logout";
import Layout from "@/auth/layout";
import ResetPassword from "@/auth/ResetPassword";
import ForgotPassword from "@/auth/ForgotPassword";

const AdminDashboard = lazy(() => import("@/pages/admin/home/AdminDashboard"));
const UserDashboard = lazy(() => import("@/pages/user/contents/UserDashboard"));
const UserOrdersStatus = lazy(() => import("@/pages/user/contents/OrdersStatus"));
const UserServices = lazy(() => import("@/pages/user/contents/Services"));
const UserMap = lazy(() => import("@/pages/user/contents/Map"));
const UnauthorizedPage = lazy(() => import("@/pages/UnauthorizedPage"));

export const routes = [
  { path: "/", element: <LandingLayout /> },
  {
    // admin dashboard
    path: "/admin",
    element: <DashboardLayout role="admin" />,
    children: [
      { path: "", element: <AdminDashboard /> },
      {
        path: "interment-setup",
        element: <IntermentSetup />,
        children: [
          { path: "customers", element: <div>Customers Table Page</div> },
          { path: "lot-owners", element: <div>Lot Owners Table Page</div> },
          {
            path: "deceased-records",
            element: <div>Deceased Records Table Page</div>,
          },
        ],
      },
      { path: "map", element: <AdminMapLayout /> },
      { path: "bookings", element: <Bookings /> },
      { path: "control-panel", element: <AdminControlPanel /> },
    ],
  },
  {
    // user dashboard
    path: "/user",
    element: <DashboardLayout role="user" />,
    children: [
      { path: "", element: <UserDashboard /> },
      { path: "orders-status", element: <UserOrdersStatus /> },
      { path: "services", element: <UserServices /> },
      { path: "map", element: <UserMap /> },
    ],
  },
  { path: "/map", element: <MapPage /> },
  { path: "/mapLibre", element: <MapLibre /> },

  // auth page
  {
    path: "/login",
    element: (
      <Layout>
        <LoginV2 />
      </Layout>
    ),
  },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/logout", element: <Logout /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },
];
