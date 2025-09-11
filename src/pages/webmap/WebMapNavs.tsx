import { useState } from 'react'

import LegendDialog from '@/components/webmap/LegendDialog'
import WebMapControlsRow from '@/components/webmap/WebMapControlsRow'
import WebMapSearchRow from '@/components/webmap/WebMapSearchRow'
import { useWebMapContext } from '@/hooks/useNavigationContext'
import { cn } from '@/lib/utils'

export default function WebMapNavs({ onBack }: { onBack?: () => void }) {
  const { context } = useWebMapContext()
  const [isLegendOpen, setIsLegendOpen] = useState(false)

  return (
    <>
      <nav
        className={cn(
          'absolute top-2 right-0 left-0 z-[990] mx-auto flex w-full max-w-full flex-col gap-2 pl-3 sm:top-3 sm:px-4 md:top-4 md:px-2 lg:max-w-2xl',
        )}
        aria-label="Map navigation"
      >
        {/* Search Row */}
        {context && <WebMapSearchRow context={context} />}
        {/* Controls Row */}
        <WebMapControlsRow context={context} onBack={onBack} onLegendClick={() => setIsLegendOpen(true)} />
      </nav>
      {/* Legend Dialog */}
      <LegendDialog isOpen={isLegendOpen} onClose={() => setIsLegendOpen(false)} />
    </>
  )
}
