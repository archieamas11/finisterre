import { Outlet, useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/sidebar/site-header";
import { getSidebarItems } from "@/navigation/sidebar/sidebar-items";
import { useEffect, useState } from "react";
import { isAuthenticated, isAdmin } from "@/utils/auth";
import { Toaster } from "sonner";

interface DashboardLayoutProps {
  role: 'admin' | 'user';
}

export default function DashboardLayout({ role }: DashboardLayoutProps) {
  const location = useLocation();
  const [sidebarItems, setSidebarItems] = useState<any[]>([]);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      window.location.href = "/login";
      return;
    }

    // Check role authorization
    const userIsAdmin = isAdmin();
    if ((role === 'admin' && !userIsAdmin) || (role === 'user' && userIsAdmin)) {
      window.location.href = userIsAdmin ? "/admin" : "/user";
      return;
    }

    // Set sidebar items based on role
    const items = getSidebarItems(role === 'admin');
    setSidebarItems(items.flatMap(group => group.items));
  }, [role]);

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
      <AppSidebar items={getSidebarItems(role === 'admin')} variant="floating" />
      <SidebarInset>
        <Toaster />
        <SiteHeader activeItem={activeItem} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}