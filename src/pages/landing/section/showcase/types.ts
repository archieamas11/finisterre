export interface GalleryImage {
  id: number
  src: string
  alt: string
  caption: string
  category: string
}

export interface Category {
  id: string
  label: string
}

export interface LocationFeature {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

export interface MapPosition {
  lat: number
  lng: number
}
