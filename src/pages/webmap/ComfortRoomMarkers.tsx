import { FaToilet } from 'react-icons/fa'

import { FinisterreMarkers, type FinisterreMarkerData } from '@/components/ui/popup-content'

interface Props {
  onDirectionClick?: (dest: [number, number]) => void
  isDirectionLoading?: boolean
}

const comfortRoomMarkersData: FinisterreMarkerData[] = [
  {
    id: 'cr-1',
    lat: 10.24864620598991,
    lng: 123.798102525943648,
    title: 'Public Comfort Room',
    popupImage: 'https://res.cloudinary.com/djrkvgfvo/image/upload/v1756789574/unnamed_r3svir.png',
    description: 'Accessible restroom for all visitors, located near the main entrance. Facilities available for both boys and girls.',
    marker: {
      type: 'icon',
      source: <FaToilet />,
      style: { backgroundColor: '#059669' },
    },
    popupType: 'image',
  },
]

export default function ComfortRoomMarker({ onDirectionClick, isDirectionLoading = false }: Props) {
  return <FinisterreMarkers items={comfortRoomMarkersData} onDirectionClick={onDirectionClick} isDirectionLoading={isDirectionLoading} />
}
