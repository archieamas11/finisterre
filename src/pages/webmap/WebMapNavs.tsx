import { RefreshCw, Search, Filter, Locate, Layers, Home } from 'lucide-react'
import { useContext, useEffect, useCallback } from 'react'
import { RiMapPinAddLine } from 'react-icons/ri'
import { RiLoginBoxLine } from 'react-icons/ri'
import { RiListSettingsFill } from 'react-icons/ri'
import { Link, useLocation } from 'react-router-dom'

import { LocateContext as WebMapLocateContext } from '@/components/layout/WebMapLayout'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { LocateContext } from '@/pages/admin/map4admin/LocateContext'
import { isAdmin, isAuthenticated } from '@/utils/auth.utils'

export default function WebMapNavs() {
  const webMapCtx = useContext(WebMapLocateContext)
  const adminCtx = useContext(LocateContext)
  // 🎯 Use admin context if available, otherwise use web map context
  const locateCtx = adminCtx || webMapCtx

  // Define a type for the admin context
  interface AdminContext {
    requestLocate: () => void
    isAddingMarker: boolean
    toggleAddMarker: () => void
    isEditingMarker: boolean
    toggleEditMarker: () => void
  }

  // 🔧 Type guard for admin context
  const isAdminContext = useCallback((ctx: unknown): ctx is AdminContext => {
    return typeof ctx === 'object' && ctx !== null && 'isAddingMarker' in ctx && 'toggleAddMarker' in ctx && 'isEditingMarker' in ctx && 'toggleEditMarker' in ctx
  }, [])

  const location = useLocation()

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
      className="pointer-events-auto absolute top-4 right-4 z-[990] flex flex-col gap-3 sm:top-8 sm:right-8 sm:gap-4 md:top-8 md:right-auto md:left-1/2 md:-translate-x-1/2 md:flex-row md:gap-4"
      style={{ pointerEvents: 'auto' }}
    >
      <Button variant={'secondary'} className="bg-background rounded-full" size="icon">
        <Search className="text-accent-foreground" />
      </Button>
      <Button variant={'secondary'} className="bg-background rounded-full" size="icon">
        <RiListSettingsFill className="text-accent-foreground" />
      </Button>
      <Button variant={'secondary'} className="bg-background rounded-full" size="icon">
        <Filter className="text-accent-foreground" />
      </Button>
      <Button variant={'secondary'} className="bg-background rounded-full" size="icon">
        <RefreshCw className="text-accent-foreground" />
      </Button>
      {(isAdmin() && location.pathname === '/') || (!isAdmin() && location.pathname === '/map') ? (
        <Button variant={'secondary'} className="bg-background rounded-full" onClick={() => locateCtx?.requestLocate()} aria-label="Locate me" size="icon">
          <Locate className="text-accent-foreground" />
        </Button>
      ) : null}

      {/* 🗺️ Layer Toggle Button */}
      <Button variant={'secondary'} className="bg-background rounded-full" size="icon">
        <Layers className="text-accent-foreground" />
      </Button>

      {/* 🏠 Home Button */}
      {(isAdmin() && location.pathname === '/map') || (!isAdmin() && location.pathname === '/map') ? (
        <Link to="/">
          <Button variant={'secondary'} className="bg-background rounded-full" size="icon">
            <Home className="text-accent-foreground" />
          </Button>
        </Link>
      ) : null}

      {/* ➕ Add Marker Button for Admin */}
      {isAdmin() && location.pathname === '/admin/map' && (
        <>
          {/* Dropdown for Add Marker Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="bg-background rounded-full" size="icon">
                <RiMapPinAddLine className={isAdminContext(locateCtx) && locateCtx.isAddingMarker ? 'text-primary-foreground' : 'text-accent-foreground'} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onAddMarkerClick}>{isAdminContext(locateCtx) && locateCtx.isAddingMarker ? 'Cancel Add' : 'Add Marker'}</DropdownMenuItem>
              <DropdownMenuItem onClick={onEditMarkerClick}>{isAdminContext(locateCtx) && locateCtx.isEditingMarker ? 'Cancel Edit' : 'Edit Marker'}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}

      {!isAuthenticated() && (
        <Link to="/login">
          <Button variant="secondary" size="default" className="lg:size-default md:size-icon sm:size-icon bg-background rounded-full transition-all duration-200 lg:gap-2">
            <RiLoginBoxLine className="h-4 w-4" />
            <span className="hidden lg:inline">Login</span>
          </Button>
        </Link>
      )}
    </nav>
  )
}
