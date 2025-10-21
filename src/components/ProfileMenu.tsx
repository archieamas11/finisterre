import { useCallback } from 'react'
import { LayoutDashboard, LogOutIcon } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ThemeToggleMenuItem } from '@/components/ui/theme-toggle-button'
import { useLogout } from '@/hooks/useLogout'
import { ucwords } from '@/lib/format'
import { getInitials } from '@/utils/avatar'

interface ProfileUser {
  avatar: string
  email: string
  name: string
  role?: string
}

export default function ProfileMenu({ user }: { user: ProfileUser }) {
  const { performLogout, isPending } = useLogout()
  const navigate = useNavigate()
  const location = useLocation()

  const dashboardPath = user.role === 'admin' || user.role === 'staff' ? '/admin' : '/user'
  const onDashboard = location.pathname.startsWith(dashboardPath)

  const handleNavigateToDashboard = useCallback(() => {
    navigate(dashboardPath)
  }, [navigate, dashboardPath])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={'icon'}
          className="flex rounded-full p-0 ring-0 outline-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar} alt={user.name} className="bg-background rounded-full" />
            <AvatarFallback className="bg-background">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate font-medium">{ucwords(user.name ?? '')}</span>
          <span className="truncate text-xs">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {!onDashboard && (
            <DropdownMenuItem onClick={handleNavigateToDashboard} aria-label="Go to dashboard">
              <LayoutDashboard size={16} className="opacity-60" aria-hidden="true" />
              <span>Dashboard</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuGroup>{!onDashboard && <ThemeToggleMenuItem variant="circle-blur" start="top-right" showTitle />}</DropdownMenuGroup>
        <DropdownMenuItem className="text-destructive" onClick={() => performLogout()} disabled={isPending} aria-label="Logout">
          <LogOutIcon className="text-destructive" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
