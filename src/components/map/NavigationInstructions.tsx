import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  Volume2,
  VolumeOff,
  X,
  ArrowUp,
  ArrowUpRight,
  ArrowRight,
  ArrowDownRight,
  ArrowUpLeft,
  ArrowLeft,
  ArrowDownLeft,
  RotateCcw,
  Circle,
  Target,
} from 'lucide-react'

import { FaWalking } from "react-icons/fa";


import { type ValhallaManeuver, TURN_TYPES, isDestinationManeuver, isTurnManeuver } from '@/api/valhalla.api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { type NavigationState } from '@/hooks/useValhalla'
import useVoiceGuidance from '@/hooks/useVoiceGuidance'
import { formatDistance, formatTime } from '@/lib/format'
import { cn } from '@/lib/utils'

interface NavigationInstructionsProps {
  isOpen: boolean
  onClose: () => void
  navigationState: NavigationState
  allManeuvers: ValhallaManeuver[]
  isNavigating: boolean
  isRerouting?: boolean
  totalDistance?: number
  totalTime?: number
  rerouteCount?: number
}

/**
 * Get icon component for maneuver type
 */
function getManeuverIcon(type: number, size: 'sm' | 'lg' = 'sm'): React.ReactNode {
  const sizeClass = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4'

  // Start maneuvers
  if (TURN_TYPES.START.includes(type)) {
    return <FaWalking className={sizeClass} />
  }

  // Destination maneuvers
  if (TURN_TYPES.DESTINATION.includes(type)) {
    return <Target className={sizeClass} />
  }

  // Straight/Continue
  if (TURN_TYPES.STRAIGHT.includes(type)) {
    return <ArrowUp className={sizeClass} />
  }

  // Slight right
  if (TURN_TYPES.SLIGHT_RIGHT.includes(type)) {
    return <ArrowUpRight className={sizeClass} />
  }

  // Right
  if (TURN_TYPES.RIGHT.includes(type)) {
    return <ArrowRight className={sizeClass} />
  }

  // Sharp right
  if (TURN_TYPES.SHARP_RIGHT.includes(type)) {
    return <ArrowDownRight className={sizeClass} />
  }

  // Slight left
  if (TURN_TYPES.SLIGHT_LEFT.includes(type)) {
    return <ArrowUpLeft className={sizeClass} />
  }

  // Left
  if (TURN_TYPES.LEFT.includes(type)) {
    return <ArrowLeft className={sizeClass} />
  }

  // Sharp left
  if (TURN_TYPES.SHARP_LEFT.includes(type)) {
    return <ArrowDownLeft className={sizeClass} />
  }

  // U-turn
  if (TURN_TYPES.U_TURN.includes(type)) {
    return <RotateCcw className={sizeClass} />
  }

  // Roundabout
  if (TURN_TYPES.ROUNDABOUT.includes(type)) {
    return <Circle className={sizeClass} />
  }

  return <Circle className={sizeClass} />
}

/**
 * Format distance with appropriate unit
 */
function formatDistanceCompact(meters: number): string {
  if (meters < 100) {
    return `${Math.round(meters)} m`
  } else if (meters < 1000) {
    return `${Math.round(meters / 10) * 10} m`
  } else {
    return `${(meters / 1000).toFixed(1)} km`
  }
}

function getManeuverSurface(type: number): { iconWrapClass: string; iconClass: string } {
  // Icons in white circles with colored icons (matching screenshot style)
  if (TURN_TYPES.START.includes(type)) {
    return { iconWrapClass: 'bg-white', iconClass: 'text-blue-600' }
  }
  if (TURN_TYPES.DESTINATION.includes(type)) {
    return { iconWrapClass: 'bg-white', iconClass: 'text-red-600' }
  }
  if (TURN_TYPES.U_TURN.includes(type)) {
    return { iconWrapClass: 'bg-white', iconClass: 'text-orange-600' }
  }
  if (TURN_TYPES.ROUNDABOUT.includes(type)) {
    return { iconWrapClass: 'bg-white', iconClass: 'text-purple-600' }
  }
  if (isTurnManeuver(type)) {
    return { iconWrapClass: 'bg-white', iconClass: 'text-orange-600' }
  }
  return { iconWrapClass: 'bg-white', iconClass: 'text-slate-600' }
}

/**
 * Get announcement text based on distance
 */
function getAnnouncementPrefix(distance: 'far' | 'approaching' | 'now' | null): string {
  switch (distance) {
    case 'far':
      return 'In about 200 meters, '
    case 'approaching':
      return 'In 50 meters, '
    case 'now':
      return 'Now, '
    default:
      return ''
  }
}

export default function NavigationInstructions({
  isOpen,
  onClose,
  navigationState,
  allManeuvers,
  isNavigating,
  isRerouting = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  totalDistance: _totalDistance,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  totalTime: _totalTime,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  rerouteCount: _rerouteCount,
}: NavigationInstructionsProps) {
  const {
    currentManeuver,
    nextManeuver,
    maneuverIndex,
    distanceToManeuver,
    distanceToDestination,
    estimatedTimeRemaining,
    shouldAnnounce,
    announcementDistance,
  } = navigationState

  const [showDetails, setShowDetails] = React.useState(false)
  const { isEnabled, toggle, speak, canUseTts, stop } = useVoiceGuidance()

  // Track last spoken instruction to avoid repetition
  const lastSpokenRef = React.useRef<string>('')

  // Voice guidance for current maneuver
  React.useEffect(() => {
    if (!isNavigating || !isEnabled || !shouldAnnounce) return

    // Build announcement text
    let text = ''

    if (nextManeuver && announcementDistance) {
      const prefix = getAnnouncementPrefix(announcementDistance)
      const instruction = nextManeuver.verbal_pre_transition_instruction || nextManeuver.instruction
      text = prefix + instruction
    } else if (currentManeuver && isDestinationManeuver(currentManeuver.type) && announcementDistance === 'now') {
      text = currentManeuver.arrive_instruction || currentManeuver.instruction || 'You have arrived at your destination'
    }

    // Only speak if text changed
    if (text && text !== lastSpokenRef.current) {
      lastSpokenRef.current = text
      speak(text).catch(() => { })
    }

    return () => {
      stop()
    }
  }, [currentManeuver, nextManeuver, isNavigating, isEnabled, shouldAnnounce, announcementDistance, speak, stop])

  // Cleanup on navigation end
  React.useEffect(() => {
    if (!isNavigating) {
      stop()
      lastSpokenRef.current = ''
    }
    return () => stop()
  }, [isNavigating, stop])

  const hasSummary =
    typeof distanceToDestination === 'number' || typeof estimatedTimeRemaining === 'number'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'fixed bottom-0 z-[1000] mx-auto w-full',
            // desktop/tablet: floating panel
            'sm:inset-x-auto sm:top-4 sm:bottom-auto sm:left-4 sm:w-[420px]',
          )}
          role="region"
          aria-label="Turn-by-turn navigation"
        >
          <Card
            className={cn(
              'rounded-t-3xl shadow-lg sm:rounded-2xl',
              'bg-background/95 supports-[backdrop-filter]:bg-background/80 backdrop-blur-lg',
            )}
          >
            <CardContent
              className={cn(
                'px-4 pb-4 pt-3 sm:px-4 sm:pb-4 sm:pt-4',
                // iOS safe-area (home indicator)
                'pb-[calc(env(safe-area-inset-bottom)+1rem)] sm:pb-4',
              )}
            >
              {/* Drag handle / tap-to-expand (mobile) */}
              <button
                type="button"
                onClick={() => setShowDetails((v) => !v)}
                className="sm:hidden w-full"
                aria-expanded={showDetails}
                aria-controls="nav-details"
              >
                <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-foreground/15" />
                <span className="sr-only">{showDetails ? 'Collapse navigation details' : 'Expand navigation details'}</span>
              </button>

              {/* Header (matches screenshot: Navigation + Live + actions) */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-2xl font-semibold tracking-tight sm:text-3xl">Navigation</span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-foreground/10 px-3 py-1 text-sm text-foreground/80">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                      Live
                    </span>
                  </div>

                  {/* Summary stats */}
                  {hasSummary && !isRerouting && (
                    <div className="mt-1 flex items-center gap-2 text-base text-muted-foreground">
                      {typeof distanceToDestination === 'number' && <span>{formatDistanceCompact(distanceToDestination)}</span>}
                      {typeof distanceToDestination === 'number' && typeof estimatedTimeRemaining === 'number' && <span>•</span>}
                      {typeof estimatedTimeRemaining === 'number' && <span>{formatTime(estimatedTimeRemaining)}</span>}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Voice guidance toggle */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={toggle}
                    title={canUseTts ? (isEnabled ? 'Disable voice' : 'Enable voice') : 'TTS unavailable'}
                    aria-pressed={isEnabled}
                    disabled={!canUseTts}
                    className={cn(
                      'rounded-full',
                      // screenshot style: subtle dark pill
                      'bg-foreground/10 text-foreground/70 hover:bg-foreground/15',
                    )}
                  >
                    {isEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeOff className="h-4 w-4" />}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    aria-label="Close"
                    className="rounded-full bg-foreground/10 text-foreground/70 hover:bg-foreground/15"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Rerouting indicator */}
              {isRerouting && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 flex items-center gap-2 rounded-xl bg-orange-100 px-3 py-2 text-sm text-orange-800 dark:bg-orange-900/40 dark:text-orange-300"
                >
                  <AlertTriangle className="h-4 w-4 animate-pulse" />
                  Recalculating route...
                </motion.div>
              )}

              {/* Current maneuver card */}
              {currentManeuver && (
                <>
                  <div
                    className={cn(
                      'mt-4 rounded-2xl p-4 sm:p-5',
                      // Apple Maps-like blue card
                      'bg-gradient-to-b from-sky-500 to-blue-600 text-white',
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white">
                        <span className="text-blue-600">{getManeuverIcon(currentManeuver.type, 'lg')}</span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-2xl font-semibold leading-tight sm:text-[2rem]">
                          {currentManeuver.instruction}
                        </p>

                        <div className="mt-2 flex items-center gap-2 text-white/80">
                          {typeof distanceToManeuver === 'number' && !isDestinationManeuver(currentManeuver.type) && (
                            <span className="text-lg font-medium">{formatDistanceCompact(distanceToManeuver)}</span>
                          )}
                          {typeof distanceToManeuver === 'number' && !isDestinationManeuver(currentManeuver.type) && (
                            <span aria-hidden="true">•</span>
                          )}
                          <span className="text-base">{formatTime(currentManeuver.time)}</span>
                        </div>

                        {currentManeuver.street_names && currentManeuver.street_names.length > 0 && (
                          <p className="mt-1 line-clamp-1 text-sm text-white/75">
                            {currentManeuver.street_names.join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Next maneuver preview */}
                  {nextManeuver && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        'mt-3 flex items-center justify-between gap-3 rounded-2xl px-4 py-3',
                        // dark strip like screenshot (works in both themes via foreground alpha)
                        'bg-foreground/10',
                      )}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                          <span className="text-foreground">{getManeuverIcon(nextManeuver.type)}</span>
                        </div>
                        <div className="min-w-0">
                          <span className="block text-xs uppercase tracking-wide text-muted-foreground">Then</span>
                          <span className="block truncate text-sm font-medium text-foreground">{nextManeuver.instruction}</span>
                        </div>
                      </div>
                      <span className="shrink-0 text-sm text-muted-foreground">{formatDistance(nextManeuver.length)}</span>
                    </motion.div>
                  )}
                </>
              )}

              {/* All directions list */}
              {allManeuvers.length > 0 && (
                <div
                  id="nav-details"
                  className={cn(
                    'mt-4',
                    // desktop: always visible
                    'hidden sm:block',
                    // mobile: controlled by sheet expansion
                    showDetails && 'block',
                  )}
                >
                  <Separator className="my-4" />
                  <h4 className="mb-3 text-sm font-semibold tracking-tight">All Directions</h4>

                  <ScrollArea className={cn('h-52 sm:h-64', showDetails && 'h-[50vh]')}>
                    <div className="space-y-2 pr-2 pb-2">
                      {allManeuvers.map((maneuver, index) => {
                        const isCurrent = index === maneuverIndex
                        const isPast = index < maneuverIndex
                        const surface = getManeuverSurface(maneuver.type)

                        return (
                          <div
                            key={index}
                            className={cn(
                              'flex w-full items-start gap-3 rounded-2xl p-3 transition-colors',
                              isCurrent && 'bg-gradient-to-b from-sky-500 to-blue-600 text-white',
                              !isCurrent && isPast && 'opacity-60',
                              !isCurrent && !isPast && 'hover:bg-foreground/5',
                            )}
                          >
                            <div
                              className={cn(
                                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                                isCurrent ? 'bg-white' : 'bg-white',
                              )}
                            >
                              <span className={cn(isCurrent ? 'text-blue-600' : surface.iconClass)}>{getManeuverIcon(maneuver.type)}</span>
                            </div>

                            <div className="min-w-0 flex-1">
                              <p
                                className={cn(
                                  'text-sm',
                                  isCurrent ? 'font-semibold text-white' : isPast ? 'line-through' : '',
                                )}
                              >
                                {maneuver.instruction}
                              </p>
                              <div className={cn('flex items-center gap-2 text-xs', isCurrent ? 'text-white/80' : 'text-muted-foreground')}>
                                <span>{formatDistance(maneuver.length)}</span>
                                <span>•</span>
                                <span>{formatTime(maneuver.time)}</span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {/* Empty state */}
              {allManeuvers.length === 0 && !currentManeuver && (
                <div className="text-muted-foreground py-10 text-center">
                  <p className="text-sm">No route instructions available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
