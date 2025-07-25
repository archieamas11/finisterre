import * as React from "react"
import {
  MapIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  CircleUser,
  PaintBucket,
  MapPin,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar"


// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
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
    <Sidebar className="border-r-0" {...props}>
      <div className="flex justify-center items-center py-4">
        <MapPin className="text-primary" size={50} />
      </div>
      <SidebarHeader>
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
      </SidebarContent>
      <NavUser user={data.user} />
    </Sidebar>
  )
}
