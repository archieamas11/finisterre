import { Filter, Locate, Home, ArrowLeft } from 'lucide-react'
import { useContext, useCallback, useEffect } from 'react'
import { BiBorderAll } from 'react-icons/bi'
import { FaRedo } from 'react-icons/fa'
import { RiMapPinAddLine } from 'react-icons/ri'
import { RiLoginBoxLine } from 'react-icons/ri'
import { Link, useLocation } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import AdminSearchBar from '@/components/webmap/AdminSearchBar'
import ResetMapViewButton from '@/components/webmap/ResetMapViewButton'
import SearchToggle from '@/components/webmap/SearchToggle'
import { LocateContext as WebMapLocateContext } from '@/contexts/MapContext'
import { useMe } from '@/hooks/useMe'
import { cn } from '@/lib/utils'
import { LocateContext } from '@/pages/admin/map4admin/LocateContext'
import ProfileMenu from '@/pages/user/ProfileMenu'
import { isAdmin, isAuthenticated } from '@/utils/auth.utils'

export default function WebMapNavs() {
  const webMapCtx = useContext(WebMapLocateContext)
  const adminCtx = useContext(LocateContext)
  // 🎯 Use admin context if available, otherwise use web map context
  const locateCtx = adminCtx || webMapCtx

  // Define types for different contexts
  interface AdminContext {
    requestLocate: () => void
    isAddingMarker: boolean
    toggleAddMarker: () => void
    isEditingMarker: boolean
    toggleEditMarker: () => void
  }

  interface WebMapContext {
    requestLocate: () => void
    clearRoute: () => void
    selectedGroups: Set<string>
    toggleGroupSelection: (groupKey: string) => void
    resetGroupSelection: () => void
    clusterViewMode: 'all' | 'selective'
    availableGroups: Array<{ key: string; label: string; count: number }>
    handleClusterClick: (groupKey: string) => void
    // 🔍 Search functionality
    searchQuery: string
    setSearchQuery: (query: string) => void
    searchResult: { success: boolean; message: string; data?: unknown } | null
    isSearching: boolean
    searchLot: (lotId: string) => Promise<void>
    clearSearch: () => void
    highlightedNiche: string | null
    // 🎯 Auto popup functionality
    autoOpenPopupFor: string | null
    setAutoOpenPopupFor: (plotId: string | null) => void
  }

  // 🔧 Type guards
  const isAdminContext = useCallback((ctx: unknown): ctx is AdminContext => {
    return typeof ctx === 'object' && ctx !== null && 'isAddingMarker' in ctx && 'toggleAddMarker' in ctx && 'isEditingMarker' in ctx && 'toggleEditMarker' in ctx
  }, [])

  const isWebMapContext = useCallback((ctx: unknown): ctx is WebMapContext => {
    return (
      typeof ctx === 'object' &&
      ctx !== null &&
      'selectedGroups' in ctx &&
      'toggleGroupSelection' in ctx &&
      'resetGroupSelection' in ctx &&
      'handleClusterClick' in ctx &&
      'searchQuery' in ctx &&
      'searchLot' in ctx
    )
  }, [])

  const location = useLocation()

  const { user: meUser, isLoading: isUserLoading } = useMe()

  const onAddMarkerClick = () => {
    if (isAdminContext(locateCtx)) {
      if (locateCtx.isEditingMarker) {
        locateCtx.toggleEditMarker()
      }
      locateCtx.toggleAddMarker()
    }
  }

  const onEditMarkerClick = () => {
    if (isAdminContext(locateCtx)) {
      if (locateCtx.isAddingMarker) {
        locateCtx.toggleAddMarker()
      }
      locateCtx.toggleEditMarker()
    }
  }

  useEffect(() => {
    if (!isAdminContext(locateCtx) || !locateCtx.isAddingMarker) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        if (isAdminContext(locateCtx)) {
          locateCtx.toggleAddMarker()
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [locateCtx, isAdminContext])

  return (
    <nav
      className={cn(
        // Positioning: full width at top similar to mobile map apps
        'absolute top-2 right-0 left-0 z-[990] mx-auto flex w-full max-w-full flex-col gap-2 px-3 sm:top-3 sm:px-4 md:top-4 md:px-2 lg:max-w-2xl',
      )}
      aria-label="Map navigation"
    >
      {/* 🔍 Full-width search bar*/}
      {isWebMapContext(locateCtx) && (
        <div className="flex w-full items-center gap-2">
          <div className="flex-1">
            <div className="mx-auto w-full max-w-3xl xl:max-w-4xl">
              <SearchToggle context={locateCtx} className="w-full" />
            </div>
          </div>
          {/* 👤 Auth controls aligned right of search with matched height */}
          {!isAuthenticated() ? (
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
      )}
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

      {/* 🎛️ Controls row: horizontally scrollable on small screens, center on large */}
      <div
        className={cn('no-scrollbar flex w-full flex-nowrap items-center gap-2 overflow-x-auto pt-0 pb-1 md:mx-auto', 'lg:justify-center')}
        role="group"
        aria-label="Map controls"
      >
        {/* 🏠 Home Button */}
        {location.pathname === '/map' && (
          <Link to="/" className="shrink-0">
            <Button variant="secondary" size="sm" className="bg-background rounded-full text-xs sm:text-sm">
              <Home className="text-accent-foreground h-3 w-3 sm:h-4 sm:w-4" />
              <span>Home</span>
            </Button>
          </Link>
        )}

        {/* 🎯 Cluster Control Dropdown */}
        {location.pathname !== '/admin/map' && isWebMapContext(locateCtx) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="bg-background shrink-0 rounded-full text-xs sm:text-sm">
                <Filter className="text-accent-foreground h-3 w-3 sm:h-4 sm:w-4" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {locateCtx.availableGroups.map((group: { key: string; label: string; count: number }) => (
                <DropdownMenuCheckboxItem key={group.key} checked={locateCtx.selectedGroups.has(group.key)} onCheckedChange={() => locateCtx.toggleGroupSelection(group.key)}>
                  {group.label} ({group.count})
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <div className="flex w-full gap-2">
                <div className="flex-1">
                  <DropdownMenuItem
                    className="w-full"
                    onClick={() => {
                      locateCtx.availableGroups.forEach((group) => {
                        if (!locateCtx.selectedGroups.has(group.key)) {
                          locateCtx.toggleGroupSelection(group.key)
                        }
                      })
                    }}
                  >
                    <BiBorderAll />
                    <span>Show All</span>
                  </DropdownMenuItem>
                </div>
                <div className="flex-1">
                  <DropdownMenuItem
                    className="w-full"
                    onClick={() => {
                      if (isWebMapContext(locateCtx)) {
                        locateCtx.clearSearch()
                      }
                      locateCtx.resetGroupSelection()
                    }}
                  >
                    <FaRedo />
                    <span>Reset</span>
                  </DropdownMenuItem>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* 🔙 Back to Clusters Button */}
        {location.pathname !== '/admin/map' && isWebMapContext(locateCtx) && locateCtx.clusterViewMode === 'selective' && (
          <Button
            variant="secondary"
            size="sm"
            className="bg-background shrink-0 rounded-full"
            onClick={() => {
              if (isWebMapContext(locateCtx)) {
                locateCtx.clearSearch()
              }
              locateCtx.resetGroupSelection()
            }}
            aria-label="Back to all clusters"
          >
            <ArrowLeft className="text-accent-foreground h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        )}

        {/* 📍 Locate user */}
        {location.pathname !== '/admin/map' && (
          <Button
            variant="secondary"
            size="sm"
            className="bg-background shrink-0 rounded-full text-xs sm:text-sm"
            onClick={() => locateCtx?.requestLocate()}
            aria-label="Locate me"
          >
            <Locate className="text-accent-foreground h-3 w-3 sm:h-4 sm:w-4" />
            <span>Where am I?</span>
          </Button>
        )}

        {/* 🔄 Reset Map View */}
        <div className="shrink-0">
          <ResetMapViewButton context={locateCtx as AdminContext | WebMapContext | null | undefined} />
        </div>

        {/* ➕ Admin add/edit marker controls */}
        {isAdmin() && location.pathname === '/admin/map' && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="bg-background shrink-0 rounded-full">
                <RiMapPinAddLine
                  className={cn('h-3 w-3 sm:h-4 sm:w-4', {
                    'text-primary-foreground': isAdminContext(locateCtx) && locateCtx.isAddingMarker,
                    'text-accent-foreground': !(isAdminContext(locateCtx) && locateCtx.isAddingMarker),
                  })}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onAddMarkerClick}>{isAdminContext(locateCtx) && locateCtx.isAddingMarker ? 'Cancel Add' : 'Add Marker'}</DropdownMenuItem>
              <DropdownMenuItem onClick={onEditMarkerClick}>{isAdminContext(locateCtx) && locateCtx.isEditingMarker ? 'Cancel Edit' : 'Edit Marker'}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Auth controls moved to search bar row */}
      </div>
    </nav>
  )
}
