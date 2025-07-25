import * as React from "react"
import {
  MapIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  CircleUser,
  PaintBucket,
  User2Icon
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "rico",
    email: "archieamas11@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Interment Setup",
      url: "/admin/interment-setup",
      icon: SettingsIcon,
    },
    {
      title: "Map",
      url: "/admin/map",
      icon: MapIcon,
    },
    {
      title: "Services",
      url: "/admin/services",
      icon: PaintBucket,
      badge: "10",
    },
    {
      title: "Accounts",
      url: "/admin/manage-accounts",
      icon: CircleUser,
      badge: "10",
    },
  ]
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <User2Icon />
                <span className="text-base font-semibold">Admin</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
