import type { CustomMarkerData } from '@/components/ui/popup-content'

import CustomMarkers from '@/components/ui/popup-content'

interface Props {
  onDirectionClick?: (dest: [number, number]) => void
  isDirectionLoading?: boolean
}

const playgroundMarkersData: CustomMarkerData[] = [
  {
    id: 'playground',
    lat: 10.248972753171127,
    lng: 123.79755735707532,
    title: 'Finisterre Park Playground',
    description: 'A vibrant play area with modern equipment for children of all ages. Shaded seating available for parents.',
    marker: {
      type: 'image',
      source: 'https://res.cloudinary.com/djrkvgfvo/image/upload/v1753206700/playground_mxeqep.jpg',
    },
    popupType: 'image',
  },
]

export default function PlaygroundMarkers({ onDirectionClick, isDirectionLoading }: Props) {
  return <CustomMarkers items={playgroundMarkersData} onDirectionClick={onDirectionClick} isDirectionLoading={isDirectionLoading} />
}
