import WebMapLayout from '@/layout/WebMapLayout'
import { Page } from 'konsta/react'

interface AndroidMapPageProps {
  onBack?: () => void
  initialDirection?: { lat: number; lng: number } | null
}

export default function AndroidMapPage({ onBack, initialDirection }: AndroidMapPageProps) {
  return (
    <Page>
      <div className="h-screen w-full">
        <WebMapLayout onBack={onBack} initialDirection={initialDirection ?? null} />
      </div>
    </Page>
  )
}
