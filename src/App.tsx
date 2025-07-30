import { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RequireAuth, RequireAdmin, RequireUser } from "@/authRoutes";
import DashboardLayout from "@/components/layout/DashboardLayout";
import LandingLayout from "@/components/layout/LandingLayout";
import Layout from "@/auth/layout";
import ForgotPassword from "@/auth/ForgotPassword";
import LoginV2 from "@/auth/page";
import Logout from "@/auth/Logout";
import ManageAccounts from "@/pages/admin/accounts/ManageAccounts";
import MapPage from "@/components/layout/WebMapLayout";
import ResetPassword from "@/auth/ResetPassword";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
// Admin Imports 
import AdminDashboard from "@/pages/admin/home/AdminDashboard";
import AdminMap from "@/pages/admin/map4admin/AdminMap";
import CustomersTablePage from "@/pages/admin/interment/CustomersTablePage";
import LotOwnersTablePage from "@/pages/admin/interment/LotOwnersTablePage";
import DeceasedTablePage from "@/pages/admin/interment/DeceasedTablePage";
import Bookings from "@/pages/admin/bookings/ManageBookings";
import AdminControlPanel from '@/pages/admin/control/AdminControlPanel';
import IntermentSetup from "@/pages/admin/interment/IntermentSetup";
// User Imports
import UserDashboard from "@/pages/user/contents/UserDashboard";
import UserMap from "@/pages/user/contents/Map";
import UserProfile from "@/pages/user/contents/Profile";
import UserServices from "@/pages/user/contents/Services";

// ...existing code...

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
					<Route path="/user" element={
						<RequireAuth>
							<RequireUser>
								<DashboardLayout role="user" />
							</RequireUser>
						</RequireAuth>
					}>
						<Route index element={<UserDashboard />} />
						<Route path="profile" element={<UserProfile />} />
						<Route path="services" element={<UserServices />} />
						<Route path="map" element={<UserMap />} />
					</Route>

					{/* Admin Protected Routes */}
					<Route path="/admin" element={
						<RequireAuth>
							<RequireAdmin>
								<DashboardLayout role="admin" />
							</RequireAdmin>
						</RequireAuth>
					}>
						<Route index element={<AdminDashboard />} />
						<Route path="interment-setup" element={<IntermentSetup />}>
							<Route path="customers" element={<CustomersTablePage />} />
							<Route path="lot-owners" element={<LotOwnersTablePage />} />
							<Route path="deceased-records" element={<DeceasedTablePage />} />
						</Route>
						<Route path="map" element={<AdminMap />} />
						<Route path="bookings" element={<Bookings />} />
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