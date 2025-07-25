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
    { title: "Dashboard", url: "/user", icon: LayoutDashboardIcon },
    { title: "Interment Setup", url: "/user/interment-setup", icon: SettingsIcon },
    { title: "Map", url: "/user/map", icon: MapIcon },
    { title: "Services", url: "/user/services", icon: PaintBucket, badge: "10" },
    { title: "Accounts", url: "/user/manage-accounts", icon: CircleUser, badge: "10" }
];

export default function UserLayout() {
    const location = useLocation();

    // Find the currently active item
    const activeItem = sidebarItems.find(item => item.url === location.pathname);
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader activeItem={activeItem} />
                {/* The Outlet renders the matched child route */}
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    )
}
