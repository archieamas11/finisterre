import { MapPin } from 'lucide-react'
import { type FC, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useMe } from '@/hooks/useMe'
import { cn } from '@/lib/utils'
import ProfileMenu from '@/pages/user/contents/ProfileMenu'

// Removed isAuthenticated in favor of hook-driven state to avoid stale token based UI desync
import { NavigationMenuSection } from './NavigationMenu'

export const HeaderSection: FC = () => {
  const [scrolled, setScrolled] = useState<boolean>(false)
  const { user: meUser, isLoading: isUserLoading } = useMe()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn('fixed top-2 right-0 left-0 z-50 mx-auto flex max-w-7xl items-center justify-between rounded-xl px-4 py-2 sm:px-6', 'w-[85vw] sm:w-[90vw] md:w-[80vw]', {
        'border-border text-foreground bg-white/60 shadow-lg backdrop-blur-lg': scrolled,
        'bg-transparent text-white': !scrolled,
      })}
      aria-label="Main Navigation"
    >
      <Link
        to="/"
        className={cn('focus:ring-primary flex items-center gap-2 rounded-md font-bold focus:ring-2 focus:ring-offset-2 focus:outline-none', {
          'text-black': scrolled,
          'text-white': !scrolled,
        })}
        aria-label="Go to homepage"
      >
        <MapPin className="h-5 w-5" aria-hidden="true" />
        <span className="hidden md:inline">Finisterre</span>
      </Link>
      <NavigationMenuSection />
      {/* Show profile when user loaded; otherwise show Login */}
      {!isUserLoading && meUser ? (
        location.pathname === '/' && <ProfileMenu user={meUser} />
      ) : (
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            asChild
            type="button"
            className={cn('rounded-full bg-transparent transition-colors', {
              'border-black bg-transparent dark:border-black dark:text-black': scrolled,
              'bg-transparent text-white dark:text-white': !scrolled,
            })}
            aria-label="Login"
            variant="outline"
          >
            <Link to="/login">Login</Link>
          </Button>
        </div>
      )}
    </header>
  )
}
