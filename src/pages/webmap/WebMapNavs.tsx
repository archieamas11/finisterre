import { Filter, Locate, Home, ArrowLeft } from 'lucide-react'
import { useContext, useCallback, useEffect } from 'react'
import { BiBorderAll } from 'react-icons/bi'
import { FaRedo } from 'react-icons/fa'
import { RiMapPinAddLine } from 'react-icons/ri'
import { RiLoginBoxLine } from 'react-icons/ri'
import { Link, useLocation } from 'react-router-dom'

import { LocateContext as WebMapLocateContext } from '@/components/layout/WebMapLayout'
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
import ResetMapViewButton from '@/components/webmap/ResetMapViewButton'
import SearchToggle from '@/components/webmap/SearchToggle'
import { useMe } from '@/hooks/useMe'
import { cn } from '@/lib/utils'
import { LocateContext } from '@/pages/admin/map4admin/LocateContext'
import ProfileMenu from '@/pages/user/contents/ProfileMenu'
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
      className={cn('absolute top-4 left-4 z-[990] flex flex-col gap-2', {
        'sm:top-6 sm:left-4 sm:flex-col sm:gap-3': true,
        'md:top-8 md:left-4 md:flex-col md:gap-4': true,
        'lg:left-1/2 lg:-translate-x-1/2 lg:flex-row lg:items-center lg:justify-center': true,
      })}
      aria-label="Map Navigation Buttons"
    >
      {/* 🔍 Search functionality - only on map page */}
      {location.pathname === '/map' && isWebMapContext(locateCtx) && <SearchToggle context={locateCtx} />}

      {/* Locate user Button */}
      {(isAdmin() && location.pathname === '/') || (!isAdmin() && location.pathname === '/map') ? (
        <Button
          variant={'secondary'}
          className="bg-background shrink-0 rounded-full text-xs sm:text-sm"
          onClick={() => locateCtx?.requestLocate()}
          aria-label="Locate me"
          size="sm"
        >
          <Locate className="text-accent-foreground h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden lg:inline">Where am I?</span>
        </Button>
      ) : null}

      {/* 🔄 Reset Map View Button (reusable) */}
      <ResetMapViewButton context={locateCtx as AdminContext | WebMapContext | null | undefined} />

      {/* ➕ Add Marker Button for Admin */}
      {isAdmin() && location.pathname === '/admin/map' && (
        <>
          {/* Dropdown for Add Marker Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="bg-background shrink-0 rounded-full" size="sm">
                <RiMapPinAddLine
                  className={`h-3 w-3 sm:h-4 sm:w-4 ${isAdminContext(locateCtx) && locateCtx.isAddingMarker ? 'text-primary-foreground' : 'text-accent-foreground'}`}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onAddMarkerClick}>{isAdminContext(locateCtx) && locateCtx.isAddingMarker ? 'Cancel Add' : 'Add Marker'}</DropdownMenuItem>
              <DropdownMenuItem onClick={onEditMarkerClick}>{isAdminContext(locateCtx) && locateCtx.isEditingMarker ? 'Cancel Edit' : 'Edit Marker'}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}

      <div className="bg-background flex shrink-0 flex-col gap-1 rounded-full sm:flex-col sm:gap-2 lg:flex-row">
        {/* 🎯 Cluster Control Dropdown */}
        {location.pathname === '/map' && isWebMapContext(locateCtx) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={'secondary'} className="bg-background shrink-0 rounded-full text-xs sm:text-sm" size="sm">
                <Filter className="text-accent-foreground h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden lg:inline">Filter</span>
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
                  <DropdownMenuItem className="w-full" onClick={() => locateCtx.resetGroupSelection()}>
                    <FaRedo />
                    <span>Reset</span>
                  </DropdownMenuItem>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* 🔙 Back to Clusters Button */}
        {location.pathname === '/map' && isWebMapContext(locateCtx) && locateCtx.clusterViewMode === 'selective' && (
          <Button variant={'secondary'} className="bg-background shrink-0 rounded-full" size="sm" onClick={() => locateCtx.resetGroupSelection()} aria-label="Back to all clusters">
            <ArrowLeft className="text-accent-foreground h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        )}
      </div>

      {!isAuthenticated() ? (
        <Link to="/login">
          <Button variant="secondary" size="sm" className="bg-background z-0 shrink-0 rounded-full text-xs transition-all duration-200 sm:text-sm">
            <RiLoginBoxLine className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="ml-1 hidden lg:inline">Login</span>
          </Button>
        </Link>
      ) : meUser && !isUserLoading && location.pathname === '/map' ? (
        <ProfileMenu user={meUser} />
      ) : null}

      {/* 🏠 Home Button */}
      {(isAdmin() && location.pathname === '/map') || (!isAdmin() && location.pathname === '/map') ? (
        <Link to="/">
          <Button variant={'secondary'} className="bg-background shrink-0 rounded-full text-xs sm:text-sm" size="sm">
            <Home className="text-accent-foreground h-3 w-3 sm:h-4 sm:w-4" />
            <span className="ml-1 hidden lg:inline">Home</span>
          </Button>
        </Link>
      ) : null}
    </nav>
  )
}
