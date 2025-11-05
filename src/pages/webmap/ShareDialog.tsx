import { useCallback, useEffect, useMemo, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { BiShareAlt } from 'react-icons/bi'
import QRCode from 'react-qr-code'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { APP_CONFIG } from '@/config/app-config'
import { useShortenUrl } from '@/hooks/shorten-url/useShortenUrl'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'

const PRODUCTION_DOMAIN = APP_CONFIG.URL

interface ShareDialogProps {
  coords: [number, number]
  location: string
  triggerClassName?: string
  triggerVariant?: React.ComponentProps<typeof Button>['variant']
  triggerSize?: React.ComponentProps<typeof Button>['size']
  iconClassName?: string
  children?: React.ReactNode
}

// Small internal hook to manage dialog state & geolocation
function useShareState(defaultOpen = false) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const reset = useCallback(() => {
    setCurrentLocation(null)
    setIsGettingLocation(false)
  }, [])

  return { isOpen, setIsOpen, currentLocation, setCurrentLocation, isGettingLocation, setIsGettingLocation, reset }
}

export function ShareDialog({
  coords,
  location,
  triggerClassName,
  triggerVariant = 'secondary',
  triggerSize = 'icon',
  iconClassName,
  children,
}: ShareDialogProps) {
  const { isOpen, setIsOpen, currentLocation, setCurrentLocation, isGettingLocation, setIsGettingLocation, reset } = useShareState(false)
  const { copy } = useCopyToClipboard()

  // Acquire user location lazily when dialog first opens
  useEffect(() => {
    if (!isOpen || currentLocation) return
    let cancelled = false
    setIsGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (cancelled) return
        setCurrentLocation([pos.coords.latitude, pos.coords.longitude])
        setIsGettingLocation(false)
      },
      (err) => {
        console.warn('ShareDialog geolocation error:', err)
        if (cancelled) return
        // We still allow sharing without from param
        setIsGettingLocation(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
    return () => {
      cancelled = true
    }
  }, [isOpen, currentLocation, setCurrentLocation, setIsGettingLocation])

  // Reset internal state when closing
  useEffect(() => {
    if (!isOpen) reset()
  }, [isOpen, reset])

  // Build share link aligning with navigation parser (?from=lat,lng&to=lat,lng)
  // Always use production domain for shareable links (especially in Capacitor/mobile app)
  const shareLink = useMemo(() => {
    const origin = Capacitor.isNativePlatform() ? PRODUCTION_DOMAIN : window.location.origin
    const base = `${origin}/map/`
    const toParam = `to=${coords[0].toFixed(6)},${coords[1].toFixed(6)}`
    if (currentLocation) {
      const fromParam = `from=${currentLocation[0].toFixed(6)},${currentLocation[1].toFixed(6)}`
      return `${base}?${fromParam}&${toParam}`
    }
    return `${base}?${toParam}`
  }, [coords, currentLocation])

  const { data: shortenedLink, isFetching: isShortening } = useShortenUrl(shareLink)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant={triggerVariant} size={triggerSize} className={triggerClassName} aria-label="Share plot">
          {children || <BiShareAlt className={iconClassName || 'size-4'} />}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Marker Location</DialogTitle>
          <DialogDescription>{location}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            {isGettingLocation && <span className="text-muted-foreground text-xs">Getting your location…</span>}
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <QRCode value={shareLink} size={180} />
            </div>
          </div>
          <div className="w-full">
            <p className="text-muted-foreground mb-2 text-xs">Shareable link</p>
            <div className="flex gap-2">
              <Input
                type="text"
                readOnly
                value={shortenedLink || (isShortening ? 'Shortening…' : shareLink)}
                className="bg-muted flex-1 text-xs"
                aria-label="Share URL"
              />
              <Button type="button" onClick={() => copy(shortenedLink || shareLink)} disabled={isShortening}>
                Copy
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
