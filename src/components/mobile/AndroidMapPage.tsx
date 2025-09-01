import WebMapLayout from '@/layout/WebMapLayout'
import { Page } from 'konsta/react'

interface AndroidMapPageProps {
  onBack?: () => void
}

export default function AndroidMapPage({ onBack }: AndroidMapPageProps) {
  return (
    <Page>
      <div className="h-screen w-full">
        <WebMapLayout onBack={onBack} />
      </div>
    </Page>
  )
}
