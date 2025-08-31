import { MdFamilyRestroom } from 'react-icons/md'
import { useLocation } from 'react-router-dom'
import { Locate, Home, ArrowLeft, Info } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { isNativePlatform } from '@/utils/platform.utils'

import { Button } from '@/components/ui/button'
import AdminControls from '@/components/webmap/AdminControls'
import ClusterFilterDropdown from '@/components/webmap/ClusterFilterDropdown'
import ResetMapViewButton from '@/components/webmap/ResetMapViewButton'
import LoginRequiredModal from '@/components/modals/LoginRequiredModal'
import { cn } from '@/lib/utils'
import { isAdmin, isAuthenticated } from '@/utils/auth.utils'
import type { AdminContext, WebMapContext } from '@/hooks/useNavigationContext'
import { Fab } from 'konsta/react'
import { Link } from 'react-router-dom'

interface WebMapControlsRowProps {
  context: WebMapContext | AdminContext | null | undefined
  onBack?: () => void
  onLegendClick?: () => void
}

export default function WebMapControlsRow({ context, onBack, onLegendClick }: WebMapControlsRowProps) {
  const location = useLocation()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleMyPlotsClick = () => {
    if (!isAuthenticated()) {
      setShowLoginModal(true)
      return
    }
    if (context && 'showUserPlotsOnly' in context) {
      const webMapCtx = context as WebMapContext
      if (webMapCtx.userOwnedPlotsCount > 0) {
        webMapCtx.showUserPlotsOnly()
      } else {
        toast.info('No owned plots or records found')
      }
    }
  }

  const ArrowLeftIcon = <ArrowLeft className="h-6 w-6" />
  const LocateIcon = <Locate className="h-6 w-6" />
  const homeIcon = <Home className="h-6 w-6" />
  const HiOutlineLocationMarkerIcon = <MdFamilyRestroom />
  return (
    <div
      className={cn('flex w-full flex-nowrap items-center gap-2 overflow-x-auto pt-0 pb-1 md:mx-auto', 'lg:justify-center', !isNativePlatform() && 'no-scrollbar')}
      role="group"
      aria-label="Map controls"
      style={{ touchAction: 'pan-x', overscrollBehavior: 'contain' }}
    >
      {/* Home Button */}
      {location.pathname !== '/admin/map' && isNativePlatform() && (
        <>
          {isNativePlatform() ? (
            <button onClick={onBack} className="no-long-press shrink-0 touch-manipulation">
              <Fab className="k-color-brand-green h-10" icon={homeIcon} style={{ transform: 'none !important', transition: 'none !important' }} />
            </button>
          ) : (
            <Link to="/" className="shrink-0">
              <Button variant="secondary" size="sm" className="bg-background no-long-press touch-manipulation rounded-full text-xs sm:text-sm">
                <Home className="text-accent-foreground h-3 w-3 sm:h-4 sm:w-4" />
                <span>Home</span>
              </Button>
            </Link>
          )}
        </>
      )}

      {/* Should only display this if the user is authenticated */}
      {/* Show only all the owned plots of the user */}
      {location.pathname !== '/admin/map' && (
        <>
          {isNativePlatform() ? (
            <button className="no-long-press touch-manipulation bg-transparent" onClick={handleMyPlotsClick}>
              <Fab className="k-color-brand-green h-10" icon={HiOutlineLocationMarkerIcon} style={{ transform: 'none !important', transition: 'none !important' }} />
            </button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              className="bg-background no-long-press shrink-0 touch-manipulation rounded-full text-xs sm:text-sm"
              onClick={handleMyPlotsClick}
              aria-label="My Plots"
            >
              <MdFamilyRestroom className="text-accent-foreground h-3 w-3 sm:h-4 sm:w-4" />
              <span>My Plots</span>
            </Button>
          )}
        </>
      )}

      {/* 🎯 Cluster Control Dropdown */}
      {location.pathname !== '/admin/map' && context && 'selectedGroups' in context && <ClusterFilterDropdown context={context as WebMapContext} />}

      {/* 🔙 Back to Clusters Button (visible in selective or user-plots modes) */}
      {location.pathname !== '/admin/map' && context && 'clusterViewMode' in context && (context as WebMapContext).clusterViewMode !== 'all' && (
        <>
          {isNativePlatform() ? (
            <button
              onClick={() => {
                if (context && 'clearSearch' in context && 'resetGroupSelection' in context) {
                  const webMapCtx = context as WebMapContext
                  webMapCtx.clearSearch()
                  webMapCtx.resetGroupSelection()
                }
              }}
              className="no-long-press touch-manipulation"
            >
              <Fab className="k-color-brand-green h-10" icon={ArrowLeftIcon} style={{ transform: 'none !important', transition: 'none !important' }} />
            </button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              className="bg-background no-long-press shrink-0 touch-manipulation rounded-full"
              onClick={() => {
                if (context && 'clearSearch' in context && 'resetGroupSelection' in context) {
                  const webMapCtx = context as WebMapContext
                  webMapCtx.clearSearch()
                  webMapCtx.resetGroupSelection()
                }
              }}
              aria-label="Back to clusters"
            >
              <ArrowLeft className="text-accent-foreground h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          )}
        </>
      )}

      {/* 📍 Locate user */}
      {location.pathname !== '/admin/map' && (
        <>
          {isNativePlatform() ? (
            <button className="no-long-press touch-manipulation bg-transparent" onClick={() => context?.requestLocate()}>
              <Fab className="k-color-brand-green h-10" icon={LocateIcon} style={{ transform: 'none !important', transition: 'none !important' }} />
            </button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              className="bg-background no-long-press shrink-0 touch-manipulation rounded-full text-xs sm:text-sm"
              onClick={() => context?.requestLocate()}
              aria-label="Locate me"
            >
              <Locate className="text-accent-foreground h-3 w-3 sm:h-4 sm:w-4" />
              <span>Where am I?</span>
            </Button>
          )}
        </>
      )}

      {/* 🔄 Reset Map View */}
      <div className="shrink-0">
        <ResetMapViewButton context={context} />
      </div>

      {/* 📊 Legend Button - only on small/medium screens */}
      {onLegendClick && (
        <>
          {isNativePlatform() ? (
            <button onClick={onLegendClick} className="no-long-press shrink-0 touch-manipulation lg:hidden">
              <Fab className="k-color-brand-green h-10" icon={<Info className="h-6 w-6" />} style={{ transform: 'none !important', transition: 'none !important' }} />
            </button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              className="bg-background no-long-press shrink-0 touch-manipulation rounded-full text-xs sm:text-sm lg:hidden"
              onClick={onLegendClick}
              aria-label="Show legend"
            >
              <Info className="text-accent-foreground h-3 w-3 sm:h-4 sm:w-4" />
              <span>Legend</span>
            </Button>
          )}
        </>
      )}

      {/* ➕ Admin add/edit marker controls */}
      {isAdmin() && location.pathname === '/admin/map' && <AdminControls />}

      {/* Login Required Modal */}
      <LoginRequiredModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} feature="My Plots" />
    </div>
  )
}
