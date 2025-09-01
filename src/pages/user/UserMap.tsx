import { useEffect } from 'react'

import MapPage from '@/layout/WebMapLayout'

export default function UserMap() {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div className="mx-auto h-screen w-full overflow-hidden py-3">
      <MapPage />
    </div>
  )
}
