import { useState } from 'react'
import { BiSolidChurch } from 'react-icons/bi'
import { FaToilet } from 'react-icons/fa'
import { GiOpenGate } from 'react-icons/gi'
import { MdLocalParking } from 'react-icons/md'

import LegendDialog from '@/components/webmap/LegendDialog'
import WebMapControlsRow from '@/components/webmap/WebMapControlsRow'
import WebMapSearchRow from '@/components/webmap/WebMapSearchRow'
import { useMapContext } from '@/hooks/useNavigationContext'
import { cn } from '@/lib/utils'
import { getCategoryBackgroundColor, getStatusColor } from '@/types/map.types'

export default function WebMapNavs({ onBack }: { onBack?: () => void }) {
  const { context, isWebMap } = useMapContext()
  const [isLegendOpen, setIsLegendOpen] = useState(false)

  const categories = [
    { key: 'serenity', label: 'Serenity Lawn', color: getCategoryBackgroundColor('Serenity Lawn') },
    { key: 'columbarium', label: 'Columbarium', color: getCategoryBackgroundColor('Columbarium') },
    { key: 'chambers', label: 'Memorial Chambers', color: getCategoryBackgroundColor('Chambers') },
  ]

  const statuses = [
    { key: 'available', label: 'Available', color: getStatusColor('available') },
    { key: 'occupied', label: 'Occupied', color: getStatusColor('occupied') },
    { key: 'reserved', label: 'Reserved', color: getStatusColor('reserved') },
  ]

  const facilities = [
    { key: 'comfort-room', label: 'Comfort Room', color: '#059669', icon: <FaToilet className="h-4 w-4" /> },
    { key: 'parking', label: 'Parking', color: '#2563EB', icon: <MdLocalParking className="h-4 w-4" /> },
    { key: 'main-entrance', label: 'Main Entrance', color: '#000000', icon: <GiOpenGate className="h-4 w-4" /> },
    { key: 'chapel', label: 'Chapel', color: '#FF9800', icon: <BiSolidChurch className="h-4 w-4" /> },
  ]

  return (
    <>
      <nav
        className={cn('absolute top-2 right-0 left-0 z-[990] mx-auto flex w-full max-w-full flex-col gap-2 pl-3 sm:top-3 sm:px-4 md:top-4 md:px-2 lg:max-w-2xl')}
        aria-label="Map navigation"
      >
        {/* Search Row */}
        {isWebMap && context && <WebMapSearchRow context={context as import('@/hooks/useNavigationContext').WebMapContext} />}

        {/* Controls Row */}
        <WebMapControlsRow context={context} onBack={onBack} onLegendClick={() => setIsLegendOpen(true)} />
      </nav>

      {/* Legend Dialog */}
      <LegendDialog isOpen={isLegendOpen} onClose={() => setIsLegendOpen(false)} categories={categories} statuses={statuses} facilities={facilities} />
    </>
  )
}
