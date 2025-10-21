import type { Coordinates } from '@/pages/user/components/types'
import { Page } from 'konsta/react'

import WebMapLayout from '@/layout/WebMapLayout'

interface AndroidMapPageProps {
  onBack?: () => void
  coordinates?: Coordinates
}

export default function AndroidMapPage({ onBack, coordinates }: AndroidMapPageProps) {
  return (
    <Page>
      <div className="h-screen w-full">
        <WebMapLayout onBack={onBack} initialDirection={coordinates ? { lat: coordinates[0], lng: coordinates[1] } : undefined} />
      </div>
    </Page>
  )
}
