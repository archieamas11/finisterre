import { BiRefresh } from 'react-icons/bi'
import { Button } from '@/components/ui/button'
import { ZoomIn, ZoomOut, Compass, Maximize, Minimize, Locate, Lock, Unlock } from 'lucide-react'

interface NavigationControlsProps {
  onResetView: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onResetBearing: () => void
  onToggleFullscreen: () => void
  onGeolocate: () => void
  onToggleCameraLock: () => void
  isFullscreen: boolean
  isCameraLocked: boolean
}

export function NavigationControls({
  onResetView,
  onZoomIn,
  onZoomOut,
  onResetBearing,
  onToggleFullscreen,
  onGeolocate,
  onToggleCameraLock,
  isFullscreen,
  isCameraLocked,
}: NavigationControlsProps) {
  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      <Button variant="default" size="sm" onClick={onZoomIn} className="border bg-white/90 shadow-md hover:bg-white">
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button variant="default" size="sm" onClick={onZoomOut} className="border bg-white/90 shadow-md hover:bg-white">
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button variant="default" size="sm" onClick={onResetBearing} className="border bg-white/90 shadow-md hover:bg-white">
        <Compass className="h-4 w-4" />
      </Button>
      <Button variant="default" size="sm" onClick={onToggleFullscreen} className="border bg-white/90 shadow-md hover:bg-white">
        {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
      </Button>
      <Button variant="default" size="sm" onClick={onGeolocate} className="border bg-white/90 shadow-md hover:bg-white">
        <Locate className="h-4 w-4" />
      </Button>
      <Button
        variant="default"
        size="sm"
        onClick={onToggleCameraLock}
        className={`border shadow-md hover:bg-white ${isCameraLocked ? 'border-blue-300 bg-blue-100 text-blue-700' : 'bg-white/90'}`}
        title={isCameraLocked ? 'Unlock camera (camera follows user)' : 'Lock camera (free view)'}
      >
        {isCameraLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
      </Button>
      <Button onClick={onResetView} variant="default" size="sm" className="border bg-white/90 shadow-md hover:bg-white">
        <BiRefresh className="h-4 w-4" />
      </Button>
    </div>
  )
}
