import type { AdminContext, WebMapContext } from '@/hooks/useNavigationContext'
import { useState } from 'react'
import { Actions, ActionsButton, ActionsGroup, ActionsLabel, Fab } from 'konsta/react'
import { ArrowLeft, Home, Info, Locate, Map } from 'lucide-react'
import { MdFamilyRestroom } from 'react-icons/md'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'sonner'

import LoginRequiredModal from '@/components/modals/LoginRequiredModal'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ClusterFilterDropdown from '@/components/webmap/ClusterFilterDropdown'
import ResetMapViewButton from '@/components/webmap/ResetMapViewButton'
import { cn } from '@/lib/utils'
import { isAuthenticated } from '@/utils/auth.utils'
import { isNativePlatform } from '@/utils/platform.utils'

interface WebMapControlsRowProps {
  context: WebMapContext | AdminContext | null | undefined
  onBack?: () => void
  onLegendClick?: () => void
}

const MAP_STYLE_PREVIEWS: Record<string, string> = {
  arcgis: 'https://cloud.maptiler.com/static/img/maps/satellite.png?t=1755757107',
  maptilerStreets: 'https://cloud.maptiler.com/static/img/maps/streets-v4.png?t=1760544391',
  osm: 'https://cloud.maptiler.com/static/img/maps/openstreetmap.png?t=1755757107',
}

function TileLayerSelectorNative({ context }: { context: WebMapContext }) {
  const [actionsOpened, setActionsOpened] = useState(false)
  const MapIcon = <Map className="h-5 w-5" />

  return (
    <>
      <button className="no-long-press touch-manipulation" onClick={() => setActionsOpened(true)}>
        <Fab
          className="k-color-brand-green h-10"
          text={context.tileLayerOptions[context.selectedTileLayer].name}
          icon={MapIcon}
          style={{ transform: 'none !important', transition: 'none !important' }}
        />
      </button>

      <Actions opened={actionsOpened} onBackdropClick={() => setActionsOpened(false)}>
        <ActionsGroup>
          <ActionsLabel>Map Style</ActionsLabel>
          {Object.entries(context.tileLayerOptions).map(([key, option]) => (
            <ActionsButton
              key={key}
              bold={context.selectedTileLayer === key}
              onClick={() => {
                context.setSelectedTileLayer(key)
                setActionsOpened(false)
              }}
            >
              <div className="flex items-center gap-4 w-full py-2">
                <img
                  src={MAP_STYLE_PREVIEWS[key]}
                  alt={`${option.name} preview`}
                  className="h-16 w-16 rounded-md border border-gray-300 object-cover shadow-sm"
                  loading="lazy"
                />
                <span className="text-base font-medium">{option.name}</span>
              </div>
            </ActionsButton>
          ))}
        </ActionsGroup>
        <ActionsGroup>
          <ActionsButton onClick={() => setActionsOpened(false)}>Cancel</ActionsButton>
        </ActionsGroup>
      </Actions>
    </>
  )
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
      className={cn(
        'flex min-w-0 max-w-full flex-nowrap items-center mx-auto gap-2 overflow-x-auto pt-0 pb-1 md:mx-auto',
        'lg:w-auto lg:flex-wrap lg:justify-center',
        !isNativePlatform() && 'no-scrollbar',
      )}
      role="group"
      aria-label="Map controls"
      style={{ touchAction: 'pan-x', overscrollBehavior: 'contain' }}
    >
      {location.pathname !== '/user/map' && (
        <>
          {isNativePlatform() ? (
            <button onClick={onBack} className="no-long-press shrink-0 touch-manipulation">
              <Fab className="k-color-brand-green h-10" icon={homeIcon} style={{ transform: 'none !important', transition: 'none !important' }} />
            </button>
          ) : (
            <Link to="/" className="shrink-0">
              <Button
                variant="secondary"
                size="sm"
                className="bg-background no-long-press text-background-foreground hover:bg-background/80 touch-manipulation rounded-full text-xs sm:text-sm"
              >
                <Home className="text-accent-foreground h-3 w-3 sm:h-4 sm:w-4" />
                <span>Home</span>
              </Button>
            </Link>
          )}
        </>
      )}

      {isNativePlatform() ? (
        <button className="no-long-press touch-manipulation bg-transparent" onClick={handleMyPlotsClick}>
          <Fab
            className="k-color-brand-green h-10"
            icon={HiOutlineLocationMarkerIcon}
            style={{ transform: 'none !important', transition: 'none !important' }}
          />
        </button>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          className="bg-background no-long-press text-background-foreground hover:bg-background/80 shrink-0 touch-manipulation rounded-full text-xs sm:text-sm"
          onClick={handleMyPlotsClick}
          aria-label="My Plots"
        >
          <MdFamilyRestroom className="text-accent-foreground h-3 w-3 sm:h-4 sm:w-4" />
          <span>My Plots</span>
        </Button>
      )}
      {context && 'selectedGroups' in context && <ClusterFilterDropdown context={context as WebMapContext} />}
      {context && 'clusterViewMode' in context && (context as WebMapContext).clusterViewMode !== 'all' && (
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
              <Fab
                className="k-color-brand-green h-10"
                icon={ArrowLeftIcon}
                style={{ transform: 'none !important', transition: 'none !important' }}
              />
            </button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              className="bg-background no-long-press text-background-foreground hover:bg-background/80 shrink-0 touch-manipulation rounded-full"
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

      {isNativePlatform() ? (
        <button className="no-long-press touch-manipulation bg-transparent" onClick={() => context?.requestLocate()}>
          <Fab className="k-color-brand-green h-10" icon={LocateIcon} style={{ transform: 'none !important', transition: 'none !important' }} />
        </button>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          className="bg-background no-long-press text-background-foreground hover:bg-background/80 shrink-0 touch-manipulation rounded-full text-xs sm:text-sm"
          onClick={() => context?.requestLocate()}
          aria-label="Locate me"
        >
          <Locate className="text-accent-foreground h-3 w-3 sm:h-4 sm:w-4" />
          <span>Where am I?</span>
        </Button>
      )}
      <div className="shrink-0">
        <ResetMapViewButton context={context} />
      </div>
      {context && 'selectedTileLayer' in context && (
        <div className="shrink-0">
          {isNativePlatform() ? (
            <TileLayerSelectorNative context={context as WebMapContext} />
          ) : (
            <Select
              value={(context as WebMapContext).selectedTileLayer}
              onValueChange={(value) => (context as WebMapContext).setSelectedTileLayer(value)}
            >
              <SelectTrigger className="!h-9 !gap-2 !border-0 !bg-background !text-background-foreground hover:!bg-background/80 !shrink-0 !rounded-full !text-xs sm:!text-sm !shadow-sm [&>span]:line-clamp-1 !px-3 !py-2">
                <Map className="text-accent-foreground h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                <SelectValue>{(context as WebMapContext).tileLayerOptions[(context as WebMapContext).selectedTileLayer]?.name}</SelectValue>
              </SelectTrigger>
              <SelectContent className="min-w-[240px]">
                {Object.entries((context as WebMapContext).tileLayerOptions).map(([key, option]) => (
                  <SelectItem key={key} value={key} className="py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={MAP_STYLE_PREVIEWS[key]}
                        alt={`${option.name} preview`}
                        className="h-16 w-16 rounded-md border border-border object-cover shadow-sm"
                        loading="lazy"
                      />
                      <span className="text-sm font-medium">{option.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}
      {onLegendClick && (
        <>
          {isNativePlatform() ? (
            <button onClick={onLegendClick} className="no-long-press shrink-0 touch-manipulation lg:hidden">
              <Fab
                className="k-color-brand-green h-10"
                icon={<Info className="h-6 w-6" />}
                style={{ transform: 'none !important', transition: 'none !important' }}
              />
            </button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              className="bg-background no-long-press text-background-foreground hover:bg-background/80 shrink-0 touch-manipulation rounded-full text-xs sm:text-sm lg:hidden"
              onClick={onLegendClick}
              aria-label="Show legend"
            >
              <Info className="text-accent-foreground h-3 w-3 sm:h-4 sm:w-4" />
              <span>Legend</span>
            </Button>
          )}
        </>
      )}
      <LoginRequiredModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} feature="My Plots" />
    </div>
  )
}
