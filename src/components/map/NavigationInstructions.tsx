import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, ChevronDown, ChevronUp, Clock, MapPin, Navigation, Route, Volume2, VolumeOff, X } from 'lucide-react'

import { type ValhallaManeuver } from '@/api/valhalla.api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

// Get icon for maneuver type
function getManeuverIcon(type: number): React.ReactNode {
  switch (type) {
    case 1: // Start
      return <MapPin className="h-4 w-4" />
    case 4: // Destination
    case 5: // Destination right
    case 6: // Destination left
      return <Navigation className="h-4 w-4" />
    case 10: // Right
    case 11: // Sharp right
      return <span className="flex h-4 w-4 items-center justify-center text-xs">↗</span>
    case 15: // Left
    case 14: // Sharp left
      return <span className="flex h-4 w-4 items-center justify-center text-xs">↖</span>
    case 8: // Continue/Straight
    case 17: // Ramp straight
      return <span className="flex h-4 w-4 items-center justify-center text-xs">↑</span>
    case 12: // U-turn right
    case 13: // U-turn left
      return <span className="flex h-4 w-4 items-center justify-center text-xs">↺</span>
    case 26: // Roundabout enter
    case 27: // Roundabout exit
      return <span className="flex h-4 w-4 items-center justify-center text-xs">🔄</span>
    default:
      return <Route className="h-4 w-4" />
  }
}

// Get color for maneuver type
function getManeuverColor(type: number, isCurrent: boolean = false): string {
  if (isCurrent) return 'bg-blue-600 text-white'

  switch (type) {
    case 1:
      return 'bg-green-100 text-green-800'
    case 4:
    case 5:
    case 6:
      return 'bg-red-100 text-red-800'
    case 12:
    case 13:
      return 'bg-orange-100 text-orange-800'
    case 26:
    case 27:
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-muted text-foreground/70'
  }
}

export default function NavigationInstructions({
  isOpen,
  onClose,
  navigationState,
  allManeuvers,
  isNavigating,
  isRerouting = false,
  totalDistance,
  totalTime,
  rerouteCount = 0,
}: NavigationInstructionsProps) {
  const { currentManeuver, nextManeuver, maneuverIndex } = navigationState
  const [showDetails, setShowDetails] = React.useState(false)
  const hasSummary = typeof totalDistance === 'number' || typeof totalTime === 'number'

  const { isEnabled, toggle, speak, canUseTts, stop } = useVoiceGuidance()

  React.useEffect(() => {
    if (!isNavigating || !currentManeuver) return
    const text = currentManeuver.instruction || ''
    speak(text).catch(() => {})
    return () => {
      stop()
    }
  }, [currentManeuver, isNavigating, speak, stop])

  React.useEffect(() => {
    if (!isNavigating) stop()
    return () => stop()
  }, [isNavigating, stop])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className={cn('fixed bottom-0 z-[1000] mx-auto w-full', 'sm:inset-x-auto sm:top-8 sm:bottom-auto sm:left-8 sm:w-96')}
          role="region"
          aria-label="Turn-by-turn navigation"
        >
          <Card
            className={cn(
              'rounded-t-3xl rounded-bl-none shadow-lg sm:rounded-lg',
              'bg-background/90 supports-[backdrop-filter]:bg-background/60 backdrop-blur',
            )}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <span className="bg-primary/10 text-primary inline-flex h-7 w-7 items-center justify-center rounded-md">
                    <Navigation className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">Navigation</span>
                  </span>
                  <span className="font-semibold">Navigation</span>
                  {isNavigating && (
                    <Badge variant="secondary" className="ml-2">
                      Active
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex items-center gap-1">
                  {/* Mobile details toggle */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="sm:hidden"
                    onClick={() => setShowDetails((v) => !v)}
                    aria-expanded={showDetails}
                    aria-controls="nav-details"
                  >
                    {showDetails ? <ChevronDown className="h-4 w-4" aria-hidden="true" /> : <ChevronUp className="h-4 w-4" aria-hidden="true" />}
                    <span className="sr-only">Toggle details</span>
                  </Button>
                  {/* Voice guidance toggle */}
                  <Button
                    type="button"
                    variant={isEnabled ? 'default' : 'ghost'}
                    size="icon"
                    onClick={toggle}
                    title={canUseTts ? (isEnabled ? 'Disable voice guidance' : 'Enable voice guidance') : 'TTS not available'}
                    aria-pressed={isEnabled}
                    disabled={!canUseTts}
                  >
                    {isEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeOff className="h-4 w-4" />}
                  </Button>
                  <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close navigation">
                    <X className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>

              {isRerouting && (
                <div className="mt-2 flex items-center gap-2 text-sm text-orange-600">
                  <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                  Recalculating route...
                </div>
              )}

              {hasSummary && (
                <div className="text-muted-foreground mt-2 flex items-center gap-4 text-xs sm:text-sm">
                  {typeof totalDistance === 'number' && (
                    <div className="flex items-center gap-1">
                      <Route className="h-4 w-4" aria-hidden="true" />
                      {formatDistance(totalDistance)}
                    </div>
                  )}
                  {typeof totalTime === 'number' && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" aria-hidden="true" />
                      {formatTime(totalTime)}
                    </div>
                  )}
                  {rerouteCount > 0 && (
                    <Badge variant="outline" className="text-[10px] sm:text-xs">
                      Rerouted {rerouteCount}x
                    </Badge>
                  )}
                </div>
              )}
            </CardHeader>

            <CardContent className="px-4 pt-0 sm:p-4">
              {/* Current maneuver */}
              {currentManeuver && (
                <div className="mb-3 sm:mb-4" aria-live="polite">
                  <div
                    className={cn(
                      'flex items-start gap-3 rounded-lg p-3',
                      'border border-blue-200 bg-blue-50 dark:border-blue-900/40 dark:bg-blue-950/40',
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-full sm:h-8 sm:w-8',
                        getManeuverColor(currentManeuver.type, true),
                      )}
                    >
                      {getManeuverIcon(currentManeuver.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-snug font-medium sm:leading-normal">{currentManeuver.instruction}</p>
                      {currentManeuver.street_names && currentManeuver.street_names.length > 0 && (
                        <p className="text-muted-foreground mt-1 line-clamp-1 text-[11px] sm:text-xs">{currentManeuver.street_names.join(', ')}</p>
                      )}
                      <div className="text-muted-foreground mt-2 flex items-center gap-3 text-[11px] sm:text-xs">
                        <span>{formatDistance(currentManeuver.length)}</span>
                        <span>•</span>
                        <span>{formatTime(currentManeuver.time)}</span>
                      </div>
                    </div>
                  </div>

                  {nextManeuver && (
                    <div className="text-muted-foreground mt-4 flex items-center gap-2 text-xs sm:text-sm">
                      <span className="text-[10px] sm:text-xs">Then</span>
                      <div className={cn('flex h-6 w-6 items-center justify-center rounded', getManeuverColor(nextManeuver.type))}>
                        {getManeuverIcon(nextManeuver.type)}
                      </div>
                      <span className="truncate">{nextManeuver.instruction}</span>
                    </div>
                  )}
                </div>
              )}
              {allManeuvers.length > 0 && (
                <>
                  <div id="nav-details" className={cn('mt-3', 'hidden sm:block', showDetails && 'block')}>
                    <Separator className="mt-2 mb-2" />
                    <h4 className="mb-3 text-sm font-medium">All Directions</h4>
                    <ScrollArea className="h-40 sm:h-70">
                      <div className="space-y-2">
                        {allManeuvers.map((maneuver, index) => (
                          <div
                            key={index}
                            className={cn(
                              'flex w-full items-start gap-3 rounded-md p-2 transition-colors',
                              index === maneuverIndex ? 'bg-muted/60 border' : 'hover:bg-muted/50',
                            )}
                          >
                            <div
                              className={cn(
                                'flex h-6 w-6 items-center justify-center rounded',
                                getManeuverColor(maneuver.type, index === maneuverIndex),
                              )}
                            >
                              {getManeuverIcon(maneuver.type)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={cn('truncate text-sm', index === maneuverIndex ? 'font-medium' : '')}>{maneuver.instruction}</p>
                              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                <span>{formatDistance(maneuver.length)}</span>
                                <span>•</span>
                                <span>{formatTime(maneuver.time)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </>
              )}

              {allManeuvers.length === 0 && !currentManeuver && (
                <div className="text-muted-foreground py-8 text-center">
                  <Navigation className="mx-auto h-12 w-12 opacity-50" aria-hidden="true" />
                  <p className="mt-2">No route instructions available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
