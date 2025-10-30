import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { BiShareAlt } from 'react-icons/bi'
import QRCode from 'react-qr-code'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

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
  const shareLink = useMemo(() => {
    // const base = `${window.location.origin}${window.location.pathname}`
    const base = `${window.location.origin}/map/`
    const toParam = `to=${coords[0].toFixed(6)},${coords[1].toFixed(6)}`
    if (currentLocation) {
      const fromParam = `from=${currentLocation[0].toFixed(6)},${currentLocation[1].toFixed(6)}`
      return `${base}?${fromParam}&${toParam}`
    }
    return `${base}?${toParam}`
  }, [coords, currentLocation])

  const shortenUrl = useCallback(async (url: string) => {
    const apiKey = import.meta.env.VITE_TINYURL_API_URL as string | undefined
    if (!apiKey) return url // Fallback: just return original link if no key configured

    try {
      const response = await axios.post(
        'https://api.tinyurl.com/create',
        { url, domain: 'tinyurl.com' },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      )
      const tiny = response.data?.data?.tiny_url
      return typeof tiny === 'string' ? tiny : url
    } catch (err) {
      console.warn('TinyURL shorten failed, using original URL', err)
      return url
    }
  }, [])

  const { data: shortenedLink, isFetching: isShortening } = useQuery({
    queryKey: ['shorten-share', shareLink],
    queryFn: () => shortenUrl(shareLink),
    enabled: !!shareLink,
    staleTime: 1000 * 60 * 10,
  })

  const copyToClipboard = useCallback(async () => {
    const link = shortenedLink || shareLink
    try {
      await navigator.clipboard.writeText(link)
      toast.success('Link copied')
    } catch {
      toast.error('Copy failed')
    }
  }, [shortenedLink, shareLink])

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
              <Button type="button" onClick={copyToClipboard} disabled={isShortening}>
                Copy
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
