import { BiSolidChurch } from 'react-icons/bi'

import { FinisterreMarkers, type FinisterreMarkerData } from '@/components/ui/popup-content'

interface Props {
  onDirectionClick?: (dest: [number, number]) => void
  isDirectionLoading?: boolean
}

const chapelMarkersData: FinisterreMarkerData[] = [
  {
    id: 'chapel-1',
    lat: 10.248435228156183,
    lng: 123.79787795587316,
    popupImage: 'https://res.cloudinary.com/djrkvgfvo/image/upload/v1757390326/image-205_kcqegm.webp',
    title: 'El Camino Pavillion',
    description: 'Celebrating here, in this special open events place, with the love and light of all we hold dear.',
    marker: {
      type: 'icon',
      source: <BiSolidChurch />,
      style: { backgroundColor: '#FF9800' },
    },
    popupType: 'image',
  },
]

export default function ChapelMarkers({ onDirectionClick, isDirectionLoading = false }: Props) {
  return <FinisterreMarkers items={chapelMarkersData} onDirectionClick={onDirectionClick} isDirectionLoading={isDirectionLoading} />
}
