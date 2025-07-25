import { Outlet, useLocation } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    MapIcon,
    LayoutDashboardIcon,
    SettingsIcon,
    CircleUser,
    PaintBucket
} from "lucide-react"

const sidebarItems = [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboardIcon },
    { title: "Interment Setup", url: "/admin/interment-setup", icon: SettingsIcon },
    { title: "Map", url: "/admin/map", icon: MapIcon },
    { title: "Services", url: "/admin/services", icon: PaintBucket, badge: "10" },
    { title: "Accounts", url: "/admin/manage-accounts", icon: CircleUser, badge: "10" }
];

export default function AdminLayout() {
    const location = useLocation();

    // Find the currently active item
    const activeItem = sidebarItems.find(item => item.url === location.pathname);
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader activeItem={activeItem} />
                {/* The Outlet renders the matched child route */}
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    )
}
