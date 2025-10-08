import { Car, CloudRain, Plug, ShieldCheck, Wrench } from 'lucide-react'

import type { Category, GalleryImage, LocationFeature, MapPosition } from './types'

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 1,
    src: 'https://res.cloudinary.com/djrkvgfvo/image/upload/v1757390677/image-8_pzd0f9.jpg',
    alt: 'A vibrant play area with modern equipment for children of all ages. Shaded seating available for parents.',
    caption: 'A vibrant play area with modern equipment for children of all ages. Shaded seating available for parents.',
    category: 'playground',
  },
  {
    id: 2,
    src: 'https://res.cloudinary.com/djrkvgfvo/image/upload/v1757390326/image-205_kcqegm.webp',
    alt: 'Celebrating here, in this special open events place, with the love and light of all we hold dear.',
    caption: 'Celebrating here, in this special open events place, with the love and light of all we hold dear.',
    category: 'chapel',
  },
  {
    id: 3,
    src: 'https://res.cloudinary.com/djrkvgfvo/image/upload/v1755713548/chapel_emzqop.jpg',
    alt: 'Aerial view showing the full expanse of the cemetery property',
    caption: 'Celebrating here, in this special open events place, with the love and light of all we hold dear.',
    category: 'chapel',
  },
  {
    id: 4,
    src: 'https://res.cloudinary.com/djrkvgfvo/image/upload/v1754204943/d7c71ee6-552f-44dc-911b-b713023e4d03_tm2hdo.png',
    alt: 'Historic monument with intricate architectural details',
    caption: 'A concrete repository for bone and ash remains at the upper park level with a garden and magnificent view',
    category: 'chambers',
  },
  {
    id: 5,
    src: 'https://res.cloudinary.com/djrkvgfvo/image/upload/v1755253760/Finisterre-Gardenz-columbarium_ewopci.png',
    alt: 'Golden sunset casting peaceful light across the grounds',
    caption: 'Evening tranquility as golden hour illuminates the sacred grounds',
    category: 'chambers',
  },
  {
    id: 6,
    src: 'https://res.cloudinary.com/djrkvgfvo/image/upload/v1755713547/gate_1_v8nrqp.jpg',
    alt: 'Carefully maintained memorial gardens with seasonal flowers',
    caption: 'Memorial gardens featuring native plants and seasonal displays',
    category: 'parking',
  },
  {
    id: 7,
    src: 'https://res.cloudinary.com/djrkvgfvo/image/upload/v1755852053/END-3-scaled_1_zzrrv1.jpg',
    alt: 'A serene lake reflecting the sky within the memorial park',
    caption: 'A serene lake reflecting the sky, offering a place for quiet contemplation',
    category: 'parking',
  },
  {
    id: 8,
    src: 'https://res.cloudinary.com/djrkvgfvo/image/upload/v1756789574/unnamed_r3svir.png',
    alt: 'Carefully maintained memorial gardens with seasonal flowers',
    caption: 'Memorial gardens featuring native plants and seasonal displays',
    category: 'parking',
  },
  {
    id: 9,
    src: 'https://finisterre.ph/wp-content/uploads/elementor/thumbs/SERENITY-LAWN-1-qydmp3m9677crhews1nge847zm9sap8y0lp6akt40w.png',
    alt: 'A double-depth in-ground burial plot marked with marble stone and covered with well-manicured grass.',
    caption: 'A double-depth in-ground burial plot marked with marble stone and covered with well-manicured grass.',
    category: 'serenity',
  },
]

export const CATEGORIES: Category[] = [
  { id: 'all', label: 'All Views' },
  { id: 'chapel', label: 'Chapel' },
  { id: 'serenity', label: 'Serenity' },
  { id: 'chambers', label: 'Chambers' },
  { id: 'columbarium', label: 'Columbarium' },
  { id: 'playground', label: 'Playground' },
  { id: 'parking', label: 'Parking' },
]

export const LOCATION_FEATURES: LocationFeature[] = [
  {
    icon: Car,
    title: 'Ample Parking Facilities',
    description: 'Generous, well-lit parking areas for visitors and service vehicles',
  },
  {
    icon: Plug,
    title: 'Underground Utilities',
    description: 'Concealed utility lines for reliable service and unobstructed landscaping',
  },
  {
    icon: CloudRain,
    title: 'Drainage System & Network',
    description: 'Engineered drainage to protect grounds and manage stormwater effectively',
  },
  {
    icon: ShieldCheck,
    title: '24-hour Security',
    description: 'Continuous monitoring and patrols to ensure visitor safety and asset protection',
  },
  {
    icon: Wrench,
    title: 'Perpetual Maintenance',
    description: 'Ongoing groundskeeping and infrastructure upkeep for lasting beauty',
  },
]

export const CEMETERY_LOCATION: MapPosition = {
  lat: 10.249306880563585,
  lng: 123.797848311330114,
}

export const MAP_BOUNDS: [[number, number], [number, number]] = [
  [10.247, 123.795],
  [10.252, 123.8],
]
