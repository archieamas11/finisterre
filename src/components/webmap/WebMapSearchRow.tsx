import { Link } from 'react-router-dom'
import { RiLoginBoxLine } from 'react-icons/ri'
import { memo } from 'react'

import ProfileMenu from '@/components/ProfileMenu'
import { Button } from '@/components/ui/button'
import SearchToggle from '@/components/webmap/SearchToggle'
import { useMe } from '@/hooks/useMe'
import { isAuthenticated } from '@/utils/auth.utils'
import { isNativePlatform } from '@/utils/platform.utils'
import type { WebMapContext } from '@/hooks/useNavigationContext'

interface WebMapSearchRowProps {
  context: WebMapContext
}

function WebMapSearchRow({ context }: WebMapSearchRowProps) {
  const { user: meUser, isLoading: isUserLoading } = useMe()

  if (!context) return null

  return (
    <>
      <div className="flex w-full items-center gap-2 pr-3">
        <div className="mx-auto w-full">
          <SearchToggle context={context} className="w-full" />
        </div>
        {!isAuthenticated() && !isNativePlatform() ? (
          <Link to="/login" className="shrink-0">
            <Button variant="secondary" size="sm" className="bg-background h-9 rounded-full text-xs sm:text-sm md:h-10">
              <RiLoginBoxLine className="h-4 w-4" />
              <span>Login</span>
            </Button>
          </Link>
        ) : !isNativePlatform() && meUser && !isUserLoading ? (
          <div className="shrink-0">
            <ProfileMenu user={meUser} />
          </div>
        ) : null}
      </div>
    </>
  )
}

// Memoize to prevent re-renders when parent state changes
export default memo(WebMapSearchRow, (prevProps, nextProps) => {
  // Only re-render if the context search-related properties change
  return prevProps.context.searchQuery === nextProps.context.searchQuery && prevProps.context.isSearching === nextProps.context.isSearching
})
