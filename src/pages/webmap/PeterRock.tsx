import type { FinisterreMarkerData } from '@/components/ui/popup-content'
import { GiStoneStack } from 'react-icons/gi'

import { FinisterreMarkers } from '@/components/ui/popup-content'

interface Props {
  onDirectionClick?: (dest: [number, number]) => void
  isDirectionLoading?: boolean
}

const PetersRock: FinisterreMarkerData[] = [
  {
    id: 'main-entrance-1',
    lat: 10.248664642366805,
    lng: 123.79785284552025,
    popupImage: 'https://res.cloudinary.com/djrkvgfvo/image/upload/v1757390333/image-210_uey97p.webp',
    title: "St. Peter's Rock",
    description: 'In honor of St. Peter, the rock upon which the church is built, symbolizing strength and faith.',
    marker: {
      type: 'icon',
      source: <GiStoneStack />,
      style: { backgroundColor: '#808080' },
    },
    popupType: 'image',
  },
]

export default function PeterRockMarkers({ onDirectionClick, isDirectionLoading = false }: Props) {
  return <FinisterreMarkers items={PetersRock} onDirectionClick={onDirectionClick} isDirectionLoading={isDirectionLoading} />
}
