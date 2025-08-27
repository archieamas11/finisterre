import { HouseIcon, MapPin, User, Settings } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import ProfileMenu from '@/pages/user/contents/ProfileMenu'

import { Button } from '@/components/ui/button'
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useMe } from '@/hooks/useMe'
import InfoMenu from '@/components/info-menu'
import NotificationMenu from '@/components/notification-menu'

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: '/user', label: 'Home', icon: HouseIcon, active: true },
  { href: '/user/map', label: 'Map', icon: MapPin },
  { href: '/user/services', label: 'Services', icon: Settings },
  { href: '/user/profile', label: 'Profile', icon: User },
]

export default function UserDashboardNavbar() {
  const { user: meUser } = useMe()
  const location = useLocation()

  // Update navigation links to be dynamic based on current location
  const dynamicNavigationLinks = navigationLinks.map((link) => ({
    ...link,
    active: location.pathname === link.href,
  }))

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 scrollbar-gutter-stable fixed top-0 right-0 left-0 z-50 w-full border-b px-4 backdrop-blur md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="group size-8 md:hidden" variant="ghost" size="icon">
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path d="M4 12H20" className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45" />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {dynamicNavigationLinks.map((link, index) => {
                    const Icon = link.icon
                    return (
                      <NavigationMenuItem key={index} className="w-full">
                        <Link to={link.href} className="flex-row items-center gap-2 py-1.5">
                          <Icon size={16} className="text-muted-foreground/80" aria-hidden="true" />
                          <span>{link.label}</span>
                        </Link>
                      </NavigationMenuItem>
                    )
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/user" className="text-primary hover:text-primary/90">
              <MapPin />
            </Link>
          </div>
        </div>
        {/* Middle area */}
        <NavigationMenu className="max-md:hidden">
          <NavigationMenuList className="gap-2">
            {dynamicNavigationLinks.map((link, index) => {
              const Icon = link.icon
              return (
                <NavigationMenuItem key={index}>
                  <Link to={link.href} className="text-foreground hover:text-primary flex-row items-center gap-2 py-1.5 font-medium">
                    <Icon size={16} className="text-muted-foreground/80" aria-hidden="true" />
                    <span>{link.label}</span>
                  </Link>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>
        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <div className="flex items-center gap-2">
            <InfoMenu />
            <NotificationMenu />
            {meUser && <ProfileMenu user={meUser} />}
          </div>
        </div>
      </div>
    </header>
  )
}
