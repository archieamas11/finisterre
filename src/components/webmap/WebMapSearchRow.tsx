import type { WebMapContext } from '@/hooks/useNavigationContext'
import { RiLoginBoxLine } from 'react-icons/ri'
import { Link, useLocation } from 'react-router-dom'

import ProfileMenu from '@/components/ProfileMenu'
import { Button } from '@/components/ui/button'
import SearchToggle from '@/components/webmap/SearchToggle'
import { useMe } from '@/hooks/useMe'
import { isAuthenticated } from '@/utils/auth.utils'
import { isNativePlatform } from '@/utils/platform.utils'

interface WebMapSearchRowProps {
  context: WebMapContext
}

export default function WebMapSearchRow({ context }: WebMapSearchRowProps) {
  const { user: meUser, isLoading: isUserLoading } = useMe()
  const location = useLocation()
  const isMapRoute = location.pathname === '/map'

  if (!context) return null

  return (
    <>
      <div className="flex w-full items-center gap-2 pr-3">
        <div className="flex-1">
          <div className="mx-auto w-full max-w-3xl xl:max-w-4xl">
            <SearchToggle context={context} className="w-full" />
          </div>
        </div>
        {!isAuthenticated() && !isNativePlatform() ? (
          <Link to="/login" className="shrink-0">
            <Button
              variant="secondary"
              size="sm"
              className="bg-background text-background-foreground hover:bg-background/80 h-9 rounded-lg text-xs sm:text-sm md:h-10"
            >
              <RiLoginBoxLine className="h-4 w-4" />
              <span>Login</span>
            </Button>
          </Link>
        ) : !isNativePlatform() && meUser && !isUserLoading && isMapRoute ? (
          <div className="shrink-0">
            <ProfileMenu user={meUser} />
          </div>
        ) : null}
      </div>
    </>
  )
}
