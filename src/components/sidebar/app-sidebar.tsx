import { MapPin } from 'lucide-react'
// src/components/sidebar/app-sidebar.tsx
import * as React from 'react'

import { NavMain } from '@/components/sidebar/nav-main'
import {
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarMenu,
  SidebarRail,
  Sidebar,
} from '@/components/ui/sidebar'
import { type NavGroup } from '@/navigation/sidebar/sidebar-items'

import { NavUser } from './nav-user'

export function AppSidebar({ items, ...props }: React.ComponentProps<typeof Sidebar> & { items: NavGroup[] }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-2">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground mr-2 flex aspect-square size-8 items-center justify-center rounded-lg">
                  <MapPin />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Finisterre</span>
                  <span className="truncate text-xs">Dashboard</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {items.map((group) => (
          <SidebarGroup key={group.id}>
            {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
            <NavMain items={group.items} />
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
