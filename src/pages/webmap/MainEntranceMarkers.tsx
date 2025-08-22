import { GiOpenGate } from 'react-icons/gi'

import {
  FinisterreMarkers,
  type FinisterreMarkerData
} from '@/components/ui/popup-content'

interface Props {
  onDirectionClick?: (dest: [number, number]) => void
  isDirectionLoading?: boolean
}

const mainEntranceMarkersData: FinisterreMarkerData[] = [
  {
    id: 'main-entrance-1',
    lat: 10.248107820799307,
    lng: 123.797607547609545,
    popupImage:
      'https://res.cloudinary.com/djrkvgfvo/image/upload/v1755713549/gate_2_dhuk2s.png',
    title: '🚪 Main Entrance – North Gate',
    description:
      'Welcome to Finisterre! This is the primary north gate for all visitors. Security and information desk available.',
    marker: {
      type: 'icon',
      source: <GiOpenGate />,
      style: { backgroundColor: '#000000' }
    },
    popupType: 'image'
  },
  {
    id: 'main-entrance-2',
    lat: 10.248166481872728,
    lng: 123.79754558858059,
    popupImage:
      'https://res.cloudinary.com/djrkvgfvo/image/upload/v1755713547/gate_1_v8nrqp.jpg',
    title: '🚪 Main Entrance – East Gate',
    description:
      "Finisterre's east entrance for guests and deliveries. Please check in with the attendant upon arrival.",
    marker: {
      type: 'icon',
      source: <GiOpenGate />,
      style: { backgroundColor: '#000000' }
    },
    popupType: 'image'
  }
]

export default function MainEntranceMarkers({
  onDirectionClick,
  isDirectionLoading = false
}: Props) {
  return (
    <FinisterreMarkers
      items={mainEntranceMarkersData}
      onDirectionClick={onDirectionClick}
      isDirectionLoading={isDirectionLoading}
    />
  )
}
