'use client'

import { ChevronsUpDown, BadgeCheck, LogOut, Bell } from 'lucide-react'

import { AvatarFallback, AvatarImage, Avatar } from '@/components/ui/avatar'
import {
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenu,
} from '@/components/ui/dropdown-menu'
import { SidebarMenuButton, SidebarMenuItem, SidebarMenu, useSidebar } from '@/components/ui/sidebar'
import { useLogout } from '@/hooks/useLogout'
import { useMe } from '@/hooks/useMe'
import { getInitials } from '@/utils/avatar'
import { ucwords } from '@/lib/format'
export function NavUser() {
  const { isMobile } = useSidebar()
  const { user: meUser } = useMe()

  const { performLogout, isPending } = useLogout()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground" size="lg">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={meUser?.avatar} alt={meUser?.name} className="bg-red" />
                <AvatarFallback className="rounded-lg">{getInitials(meUser?.name)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{ucwords(meUser?.name ?? '')}</span>
                <span className="truncate text-xs">{meUser?.email ?? ''}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" side={isMobile ? 'bottom' : 'right'} sideOffset={4} align="end">
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={meUser?.avatar} alt={meUser?.name} />
                  <AvatarFallback className="rounded-lg">{getInitials(meUser?.name)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{ucwords(meUser?.name ?? '')}</span>
                  <span className="truncate text-xs">{meUser?.email ?? ''}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => performLogout()} disabled={isPending} aria-label="Logout">
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
