import WebMapLayout from '@/layout/WebMapLayout'
import { Page, Navbar, Block, Link } from 'konsta/react'
import { ArrowLeft, Search } from 'lucide-react'
import { Suspense } from 'react'

interface AndroidMapPageProps {
  onBack?: () => void
}

export default function AndroidMapPage({ onBack }: AndroidMapPageProps) {
  return (
    <Page>
      <Navbar
        title="Map"
        subtitle="Finisterre Layout"
        transparent={false}
        left={
          <Link onClick={onBack}>
            <ArrowLeft className="h-6 w-6" />
          </Link>
        }
        right={
          <Link>
            <Search className="h-6 w-6" />
          </Link>
        }
      />

      <Block className="h-screen w-full">
        {/* Mobile Map Container */}
        <div className="h-full w-full">
          <Suspense fallback={<div>Loading map...</div>}>
            <WebMapLayout />
          </Suspense>
        </div>
      </Block>
    </Page>
  )
}
