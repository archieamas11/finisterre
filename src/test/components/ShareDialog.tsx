import { FaShareSquare } from 'react-icons/fa'
import { useEffect } from 'react'
import QRCode from 'react-qr-code'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useShareDialogStore } from '../stores/share-dialog.store'
import { Input } from '@/components/ui/input'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type ShareDialogProps = {
  coords: [number, number]
  location: string
}

export default function ShareDialog({ coords, location }: ShareDialogProps) {
  const { isOpen, currentLocation, isGettingLocation, setIsOpen, setCurrentLocation, setIsGettingLocation, reset } = useShareDialogStore()

  // Get current location when dialog opens
  useEffect(() => {
    if (isOpen && !currentLocation) {
      setIsGettingLocation(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          // Store as [lat, lng] for consistency with URL format
          setCurrentLocation([latitude, longitude])
          setIsGettingLocation(false)
        },
        (error) => {
          console.warn('Failed to get current location:', error)
          // Fallback: convert coords from [lng, lat] to [lat, lng] for URL
          setCurrentLocation([coords[1], coords[0]])
          setIsGettingLocation(false)
        },
        { enableHighAccuracy: true, timeout: 10000 },
      )
    }
  }, [isOpen, currentLocation, coords, setCurrentLocation, setIsGettingLocation])

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      reset()
    }
  }, [isOpen, reset])

  // Generate shareable link using the test navigation system's expected parameters
  // URL format: from=lat,lng&to=lat,lng
  const shareLink = currentLocation
    ? `${window.location.origin}${window.location.pathname}?from=${currentLocation[0]},${currentLocation[1]}&to=${coords[1]},${coords[0]}`
    : `${window.location.origin}${window.location.pathname}?to=${coords[1]},${coords[0]}`

  // Function to shorten the URL using TinyURL API
  const shortenUrl = async (url: string): Promise<string> => {
    const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`)
    return response.data as string
  }

  // Fetch shortened link
  const { data: shortenedLink } = useQuery({
    queryKey: ['shorten', shareLink],
    queryFn: () => shortenUrl(shareLink),
    enabled: !!shareLink,
  })

  console.log('ShareDialog coordinates:', {
    coords,
    currentLocation,
    shareLink,
  })

  const copyToClipboard = async () => {
    if (!shortenedLink) {
      toast.error('Link not available')
      return
    }
    try {
      await navigator.clipboard.writeText(shortenedLink)
      toast.success('Link copied to clipboard!')
    } catch {
      toast.error('Failed to copy link')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="hover:bg-accent rounded-full bg-[var(--brand-primary)]" size="icon">
          <FaShareSquare className="text-primary size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Plot</DialogTitle>
          <DialogDescription>Share this plot location: {location}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          {isGettingLocation ? (
            <div className="flex items-center gap-2">
              <div className="border-primary h-4 w-4 animate-spin rounded-full border-b-2"></div>
              <span className="text-muted-foreground text-sm">Getting your location...</span>
            </div>
          ) : (
            <div className="rounded-lg bg-white p-4">
              <QRCode value={shareLink} size={200} />
            </div>
          )}
          <div className="w-full">
            <p className="text-muted-foreground mb-2 text-sm">Or copy the link:</p>
            <div className="flex gap-2">
              <Input type="text" value={shortenedLink || ''} readOnly className="bg-muted flex-1 rounded-md border px-3 py-2 text-sm" />
              <Button onClick={copyToClipboard}>Copy</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
