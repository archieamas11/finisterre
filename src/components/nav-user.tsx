"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LogOut,
  MoonStar, SunIcon, EclipseIcon
} from "lucide-react"
import { useDarkMode } from "@/hooks/useDarkMode"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom"
import React from "react";

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()

  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/logout");
  };

  const { isDark, toggleDarkMode } = useDarkMode();
  // Add system theme support
  const [theme, setTheme] = React.useState<'system' | 'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as 'system' | 'light' | 'dark' || 'system';
    }
    return 'system';
  });

  const handleThemeChange = (value: 'system' | 'light' | 'dark') => {
    setTheme(value);
    localStorage.setItem('theme', value);
    if (value === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark !== isDark) toggleDarkMode();
    } else if ((value === 'dark') !== isDark) {
      toggleDarkMode();
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
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
              {/* Theme toggle group */}
              <DropdownMenuLabel className="pt-2 pb-1 text-xs font-semibold">Theme</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ToggleGroup type="single" value={theme} className="flex border-1 border-sidebar-accent rounded-lg">
                <ToggleGroupItem
                  value="system"
                  aria-label="System"
                  onClick={() => handleThemeChange('system')}
                  className={theme === 'system' ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                >
                  <EclipseIcon/>
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="light"
                  aria-label="Light Mode"
                  onClick={() => handleThemeChange('light')}
                  className={theme === 'light' ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                >
                  <SunIcon/>
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="dark"
                  aria-label="Dark Mode"
                  onClick={() => handleThemeChange('dark')}
                  className={theme === 'dark' ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                >
                  <MoonStar/>
                </ToggleGroupItem>
              </ToggleGroup>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
