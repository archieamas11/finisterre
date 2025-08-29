import WebMapLayout from '@/layout/WebMapLayout'
import { Page } from 'konsta/react'
import { Suspense } from 'react'

interface AndroidMapPageProps {
  onBack?: () => void
}

export default function AndroidMapPage({ onBack }: AndroidMapPageProps) {
  return (
    <Page>
      {/* Mobile Map Container: fill remaining viewport below navbar */}
      <div className="h-full w-full">
        <Suspense fallback={<div>Loading map...</div>}>
          <WebMapLayout onBack={onBack} />
        </Suspense>
      </div>
    </Page>
  )
}
