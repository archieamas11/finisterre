import { useEffect } from 'react'

import MapPage from '@/layout/WebMapLayout'

export default function UserMap() {
  useEffect(() => {
    // Prevent page-level scrolling but allow map interactions
    const handleWheel = (e: WheelEvent) => {
      if (!(e.target as Element)?.closest('.leaflet-container')) {
        e.preventDefault()
      }
    }

    // Prevent touch scroll on document that aren't from map
    const handleTouchMove = (e: TouchEvent) => {
      if (!(e.target as Element)?.closest('.leaflet-container')) {
        e.preventDefault()
      }
    }

    document.body.style.overflow = 'hidden'
    document.body.style.height = '100vh'

    document.addEventListener('wheel', handleWheel, { passive: false })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })

    // Scroll to top immediately when component mounts
    window.scrollTo(0, 0)

    return () => {
      // Restore normal scrolling when component unmounts
      document.body.style.overflow = ''
      document.body.style.height = ''
      document.removeEventListener('wheel', handleWheel)
      document.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  return (
    <div className="map-page-container mx-auto h-screen w-full py-3">
      <MapPage />
    </div>
  )
}
