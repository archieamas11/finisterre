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
  ChevronUp,
  ChevronDown,
} from 'lucide-react'

import { FaWalking } from "react-icons/fa";


import { type ValhallaManeuver, TURN_TYPES, isDestinationManeuver, isTurnManeuver } from '@/api/valhalla.api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { type NavigationState } from '@/hooks/useValhalla'
import useVoiceGuidance from '@/hooks/useVoiceGuidance'
import { formatDistance, formatTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Separator } from '../ui/separator';

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
function getManeuverIcon(
  type: number,
  size: 'sm' | 'lg' | 'xl' | '2xl' | '3xl' = 'sm'
): React.ReactNode {
  let sizeClass: string
  switch (size) {
    case 'lg':
      sizeClass = 'h-6 w-6'
      break
    case 'xl':
      sizeClass = 'h-8 w-8'
      break
    case '2xl':
      sizeClass = 'h-10 w-10'
      break
    case '3xl':
      sizeClass = 'h-12 w-12'
      break
    case 'sm':
    default:
      sizeClass = 'h-4 w-4'
      break
  }

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
            'fixed bottom-4 z-[1000] mx-auto w-full max-w-3xl',
            'sm:left-1/2 sm:-translate-x-1/2 sm:bottom-0',
          )}
          role="region"
          aria-label="Turn-by-turn navigation"
        >
          <div className='rounded-t-3xl shadow-lg bg-background/95 supports-[backdrop-filter]:bg-background/80 backdrop-blur-lg p-4'          >
            {/* Header - spans full width */}
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex items-center gap-2">
                <span className="text-base font-semibold tracking-tight sm:text-lg">Navigation</span>
                {/* Summary stats */}
                {hasSummary && !isRerouting && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {typeof distanceToDestination === 'number' && <span>{formatDistanceCompact(distanceToDestination)}</span>}
                    {typeof distanceToDestination === 'number' && typeof estimatedTimeRemaining === 'number' && <span>•</span>}
                    {typeof estimatedTimeRemaining === 'number' && <span>{formatTime(estimatedTimeRemaining)}</span>}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1">
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
                    'rounded-full h-7 w-7',
                    'bg-foreground/10 text-foreground/70 hover:bg-foreground/15',
                    isEnabled ? 'bg-green-100 text-green-800' : '',
                  )}
                >
                  {isEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeOff className="h-3 w-3" />}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  aria-label="Close"
                  className="rounded-full h-7 w-7 bg-foreground/10 text-foreground/70 hover:bg-foreground/15"
                >
                  <X className="h-3 w-3" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDetails((v) => !v)}
                  aria-expanded={showDetails}
                  aria-label={showDetails ? 'Collapse directions' : 'Expand directions'}
                  className="rounded-full h-7 w-7 bg-foreground/10 text-foreground/70 hover:bg-foreground/15"
                >
                  {showDetails ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronUp className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>

            <Separator className='bg-secondary/50 my-2' />

            {/* Two-column layout */}
            <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Left Column: Current maneuver, rerouting, next maneuver */}
              <div className="flex flex-col gap-2">
                {/* Rerouting indicator */}
                {isRerouting && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center gap-1.5 rounded-xl bg-orange-100 px-2 py-1 text-xs text-orange-800 dark:bg-orange-900/40 dark:text-orange-300"
                  >
                    <AlertTriangle className="h-3.5 w-3.5 animate-pulse" />
                    Recalculating route...
                  </motion.div>
                )}

                {/* Current maneuver card */}
                {currentManeuver && (
                  <>
                    <div
                      className={cn(
                        'rounded-lg p-2.5 sm:p-3',
                        'bg-gradient-to-b from-accent to-accent/20 text-white',
                      )}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full shadow-lg bg-blue-700 self-center my-auto">
                          <span className="text-white flex items-center justify-center h-full w-full">
                            {getManeuverIcon(currentManeuver.type, 'xl')}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-lg font-semibold leading-tight sm:text-xl">
                            {currentManeuver.instruction}
                          </p>

                          <div className="mt-1.5 flex items-center gap-1.5 text-white/80">
                            {typeof distanceToManeuver === 'number' && !isDestinationManeuver(currentManeuver.type) && (
                              <span className="text-sm font-medium">{formatDistanceCompact(distanceToManeuver)}</span>
                            )}
                            {typeof distanceToManeuver === 'number' && !isDestinationManeuver(currentManeuver.type) && (
                              <span aria-hidden="true">•</span>
                            )}
                            <span className="text-sm">{formatTime(currentManeuver.time)}</span>
                          </div>

                          {currentManeuver.street_names && currentManeuver.street_names.length > 0 && (
                            <p className="mt-1 line-clamp-1 text-xs text-white/75">
                              {currentManeuver.street_names.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Next maneuver */}
                    {nextManeuver && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='bg-gray-700 flex items-center justify-between gap-2 rounded-lg p-2'
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground/20">
                            <span className="text-foreground">{getManeuverIcon(nextManeuver.type)}</span>
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs uppercase tracking-wide font-medium text-muted-foreground">Then</span>
                            <span className="block truncate text-sm font-semibold text-foreground">{nextManeuver.instruction}</span>
                          </div>
                        </div>
                        <span className="shrink-0 self-end text-xs text-muted-foreground">{formatDistance(nextManeuver.length)}</span>
                      </motion.div>
                    )}
                  </>
                )}

                {/* Empty state for left column */}
                {!currentManeuver && (
                  <div className="text-muted-foreground py-6 text-center">
                    <p className="text-xs">No route instructions available</p>
                  </div>
                )}
              </div>

              {/* Right Column: All directions list */}
              {allManeuvers.length > 0 && (
                <div id="nav-details">
                  <div className="mb-1.5 flex items-center justify-between">
                    <h4 className="text-base font-semibold tracking-tight">All Directions</h4>
                  </div>

                  <ScrollArea className={cn(showDetails ? 'h-40 sm:h-48 lg:h-[calc(100vh-350px)]' : 'max-h-fit')}>
                    <div className="space-y-0 pr-2 pb-2">
                      {(showDetails ? allManeuvers : allManeuvers.slice(0, 2)).map((maneuver, index) => {
                        const actualIndex = showDetails ? index : index
                        const isCurrent = actualIndex === maneuverIndex
                        const isPast = actualIndex < maneuverIndex

                        return (
                          <div
                            key={actualIndex}
                            className={cn(
                              'flex w-full items-start gap-2 rounded-lg p-2 transition-colors',
                              isCurrent && 'bg-accent/60 text-white',
                              !isCurrent && isPast && 'opacity-60',
                              !isCurrent && !isPast && 'hover:bg-foreground/5',
                            )}
                          >
                            <div
                              className={cn(
                                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                                isCurrent ? 'bg-accent' : getManeuverSurface(maneuver.type).iconWrapClass,
                              )}
                            >
                              <span className={cn(isCurrent ? 'text-blue-600' : 'text-orange-400')}>{getManeuverIcon(maneuver.type)}</span>
                            </div>

                            <div className="min-w-0 flex-1">
                              <p
                                className={cn(
                                  'text-sm',
                                  isCurrent ? 'font-base text-white' : isPast ? 'line-through' : '',
                                )}
                              >
                                {maneuver.instruction}
                              </p>
                              <div className={cn('flex items-center gap-1.5 text-xs', isCurrent ? 'text-white/80' : 'text-muted-foreground')}>
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
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
