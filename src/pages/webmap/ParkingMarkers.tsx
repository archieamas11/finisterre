import { MdLocalParking } from 'react-icons/md'

import { FinisterreMarkers, type FinisterreMarkerData } from '@/components/ui/popup-content'

interface Props {
  onDirectionClick?: (dest: [number, number]) => void
  isDirectionLoading?: boolean
}

const parkingMarkersData: FinisterreMarkerData[] = [
  {
    id: 'parking-1',
    lat: 10.248467771138005,
    lng: 123.797668761148387,
    title: 'Main Parking Area',
    description: 'Primary parking zone for Finisterre guests. Closest to the main entrance and reception.',
    marker: {
      type: 'icon',
      source: <MdLocalParking />,
      style: { backgroundColor: '#2563EB' },
    },
    popupType: 'simple',
  },
  {
    id: 'parking-2',
    lat: 10.248150553375426,
    lng: 123.797848903904878,
    title: 'Overflow Parking',
    description: 'Additional parking space for busy days. Located near the secondary entrance.',
    marker: {
      type: 'icon',
      source: <MdLocalParking />,
      style: { backgroundColor: '#2563EB' },
    },
    popupType: 'simple',
  },
]

export default function ParkingMarkers({ onDirectionClick, isDirectionLoading = false }: Props) {
  return <FinisterreMarkers items={parkingMarkersData} onDirectionClick={onDirectionClick} isDirectionLoading={isDirectionLoading} />
}
