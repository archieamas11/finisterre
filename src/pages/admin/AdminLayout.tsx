import { Outlet } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

export default function AdminLayout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="flex h-14 shrink-0 items-center gap-2 ml-4">
                <SidebarTrigger />
            </div>
            <SidebarInset>
                {/* The Outlet renders the matched child route */}
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    )
}
