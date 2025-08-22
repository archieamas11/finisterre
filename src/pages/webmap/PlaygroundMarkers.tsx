import type { CustomMarkerData } from '@/components/ui/popup-content'

import CustomMarkers from '@/components/ui/popup-content'

interface Props {
  onDirectionClick?: (dest: [number, number]) => void
  isDirectionLoading?: boolean
}

const playgroundMarkersData: CustomMarkerData[] = [
  {
    id: 'playground-1',
    lat: 10.248972753171127,
    lng: 123.79755735707532,
    title: 'Central Park Playground',
    description:
      'A vibrant play area with modern equipment for children of all ages. Shaded seating available for parents.',
    marker: {
      type: 'image',
      source:
        'https://res.cloudinary.com/djrkvgfvo/image/upload/v1753206700/playground_mxeqep.jpg'
    },
    popupType: 'image'
  },
  {
    id: 'playground-2',
    lat: 10.249180343704229,
    lng: 123.798238818160755,
    title: 'Sunrise Community Playground',
    description:
      'Recently opened with safe, eco-friendly structures and a dedicated toddler zone. Perfect for family outings.',
    marker: {
      type: 'image',
      source:
        'https://res.cloudinary.com/djrkvgfvo/image/upload/v1753206700/playground_mxeqep.jpg'
    },
    popupType: 'image'
  }
]

export default function PlaygroundMarkers({
  onDirectionClick,
  isDirectionLoading
}: Props) {
  return (
    <CustomMarkers
      items={playgroundMarkersData}
      onDirectionClick={onDirectionClick}
      isDirectionLoading={isDirectionLoading}
    />
  )
}
