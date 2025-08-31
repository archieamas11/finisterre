import { Link, useLocation } from 'react-router-dom'
import { RiLoginBoxLine } from 'react-icons/ri'

import ProfileMenu from '@/components/ProfileMenu'
import { Button } from '@/components/ui/button'
import AdminSearchBar from '@/components/webmap/AdminSearchBar'
import SearchToggle from '@/components/webmap/SearchToggle'
import { useMe } from '@/hooks/useMe'
import { isAdmin, isAuthenticated } from '@/utils/auth.utils'
import { isNativePlatform } from '@/utils/platform.utils'
import type { WebMapContext } from '@/hooks/useNavigationContext'

interface WebMapSearchRowProps {
  context: WebMapContext
}

export default function WebMapSearchRow({ context }: WebMapSearchRowProps) {
  const location = useLocation()
  const { user: meUser, isLoading: isUserLoading } = useMe()

  if (!context) return null

  return (
    <>
      {/* 🔍 Full-width search bar for web map */}
      <div className="flex w-full items-center gap-2 pr-3">
        <div className="flex-1">
          <div className="mx-auto w-full max-w-3xl xl:max-w-4xl">
            <SearchToggle context={context} className="w-full" />
          </div>
        </div>
        {/* 👤 Auth controls aligned right of search with matched height */}
        {!isAuthenticated() && !isNativePlatform() ? (
          <Link to="/login" className="shrink-0">
            <Button variant="secondary" size="sm" className="bg-background h-9 rounded-full text-xs sm:text-sm md:h-10">
              <RiLoginBoxLine className="h-4 w-4" />
              <span>Login</span>
            </Button>
          </Link>
        ) : location.pathname === '/map' && meUser && !isUserLoading ? (
          <div className="shrink-0">
            {/* Force trigger to match search bar height via descendant selector override if needed */}
            <ProfileMenu user={meUser} />
          </div>
        ) : null}
      </div>

      {/* Admin search bar variant */}
      {isAdmin() && location.pathname === '/admin/map' && (
        <div className="items-left flex w-full gap-2">
          <div className="flex-1">
            <div className="mx-auto w-full max-w-sm">
              <AdminSearchBar className="w-full" />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
