import { BoltIcon, BookOpenIcon, ChevronDownIcon, Layers2Icon, LogOutIcon, PinIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

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
import { useLogout } from '@/hooks/useLogout'
import { ucwords } from '@/lib/format'
import { getInitials } from '@/utils/avatar'

interface ProfileUser {
  avatar: string
  email: string
  name: string
}

export default function ProfileMenu({ user }: { user: ProfileUser }) {
  const { performLogout, isPending } = useLogout()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const current = (theme === 'system' ? resolvedTheme : theme) as 'light' | 'dark' | undefined
  const isDark = current === 'dark'

  const onToggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 outline-0 hover:bg-transparent dark:hover:bg-transparent" aria-label="User menu">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} className="bg-background rounded-full p-0" />
            <AvatarFallback className="bg-background">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <ChevronDownIcon size={16} className="opacity-60" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate font-medium">{ucwords(user.name ?? '')}</span>
          <span className="truncate text-xs">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BoltIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Option 1</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Layers2Icon size={16} className="opacity-60" aria-hidden="true" />
            <span>Option 2</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BookOpenIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Option 3</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <PinIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Option 4</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onToggleTheme} disabled={!isMounted} aria-label="Toggle theme">
            {isMounted && isDark ? <SunIcon size={16} className="opacity-60" aria-hidden="true" /> : <MoonIcon size={16} className="opacity-60" aria-hidden="true" />}
            <span>{isMounted ? (isDark ? 'Light Mode' : 'Dark Mode') : 'Change Theme'}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => performLogout()} disabled={isPending} aria-label="Logout">
          <LogOutIcon />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
