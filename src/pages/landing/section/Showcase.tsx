import type { Map as LeafletMap } from 'leaflet'

import { motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Car,
  Plug,
  CloudRain,
  ShieldCheck,
  Wrench
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
const galleryImages = [
  {
    id: 1,
    src: 'https://picsum.photos/id/1025/2070/1380',
    alt: 'Panoramic view of peaceful cemetery grounds with rolling hills',
    caption:
      'Panoramic view of our 150-acre grounds nestled in the rolling countryside',
    category: 'panoramic'
  },
  {
    id: 2,
    src: 'https://picsum.photos/id/1025/2070/1380',
    alt: 'Spring blossoms throughout the cemetery pathways',
    caption:
      'Spring transformation with cherry blossoms lining memorial pathways',
    category: 'seasonal'
  },
  {
    id: 3,
    src: 'https://picsum.photos/id/1025/2070/1380',
    alt: 'Aerial view showing the full expanse of the cemetery property',
    caption:
      'Aerial perspective showcasing the thoughtful layout and natural integration',
    category: 'aerial'
  },
  {
    id: 4,
    src: 'https://picsum.photos/id/1025/2070/1380',
    alt: 'Historic monument with intricate architectural details',
    caption:
      'Historic memorial featuring 19th-century craftsmanship and artistry',
    category: 'architecture'
  },
  {
    id: 5,
    src: 'https://picsum.photos/id/1025/2070/1380',
    alt: 'Golden sunset casting peaceful light across the grounds',
    caption:
      'Evening tranquility as golden hour illuminates the sacred grounds',
    category: 'sunset'
  },
  {
    id: 6,
    src: 'https://picsum.photos/id/1025/2070/1380',
    alt: 'Carefully maintained memorial gardens with seasonal flowers',
    caption: 'Memorial gardens featuring native plants and seasonal displays',
    category: 'gardens'
  },
  {
    id: 7,
    src: 'https://picsum.photos/id/1025/2070/1380',
    alt: 'A serene lake reflecting the sky within the memorial park',
    caption:
      'A serene lake reflecting the sky, offering a place for quiet contemplation',
    category: 'gardens'
  }
]

const locationFeatures = [
  {
    icon: Car,
    title: 'Ample Parking Facilities',
    description:
      'Generous, well-lit parking areas for visitors and service vehicles'
  },
  {
    icon: Plug,
    title: 'Underground Utilities',
    description:
      'Concealed utility lines for reliable service and unobstructed landscaping'
  },
  {
    icon: CloudRain,
    title: 'Drainage System & Network',
    description:
      'Engineered drainage to protect grounds and manage stormwater effectively'
  },
  {
    icon: ShieldCheck,
    title: '24-hour Security',
    description:
      'Continuous monitoring and patrols to ensure visitor safety and asset protection'
  },
  {
    icon: Wrench,
    title: 'Perpetual Maintenance',
    description:
      'Ongoing groundskeeping and infrastructure upkeep for lasting beauty'
  }
]

export default function CemeteryShowcase() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [isExpanded, setIsExpanded] = useState(false)
  const [leafletMap, setLeafletMap] = useState<LeafletMap | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)

  const categories = [
    { id: 'all', label: 'All Views' },
    { id: 'panoramic', label: 'Panoramic' },
    { id: 'seasonal', label: 'Seasonal' },
    { id: 'aerial', label: 'Aerial' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'sunset', label: 'Golden Hour' },
    { id: 'gardens', label: 'Gardens' }
  ]

  const filteredImages = useMemo(() => {
    return activeFilter === 'all'
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeFilter)
  }, [activeFilter])

  const visibleImages = useMemo(() => {
    return isExpanded ? filteredImages : filteredImages.slice(0, 6)
  }, [filteredImages, isExpanded])

  useEffect(() => {
    if (selectedImage >= visibleImages.length) {
      setSelectedImage(0)
    }
  }, [visibleImages, selectedImage])

  const nextImage = useCallback(() => {
    setSelectedImage((prev) => (prev + 1) % visibleImages.length)
  }, [visibleImages.length])

  const prevImage = useCallback(() => {
    setSelectedImage(
      (prev) => (prev - 1 + visibleImages.length) % visibleImages.length
    )
  }, [visibleImages.length])

  const openLightbox = (index: number) => {
    setSelectedImage(index)
    setIsLightboxOpen(true)
  }

  // Ensure Leaflet redraws when the map instance becomes available or when the gallery expands
  useEffect(() => {
    if (!leafletMap) return
    // give layout a tick then invalidate size
    const t = setTimeout(() => {
      leafletMap.invalidateSize()
    }, 0)
    return () => clearTimeout(t)
  }, [leafletMap, isExpanded])

  // Resize observer to invalidate leaflet size when the container size changes
  useEffect(() => {
    if (
      !mapContainerRef.current ||
      !leafletMap ||
      typeof ResizeObserver === 'undefined'
    )
      return
    const el = mapContainerRef.current
    const ro = new ResizeObserver(() => {
      leafletMap.invalidateSize()
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [mapContainerRef, leafletMap])

  // small internal component to access the map instance from within MapContainer
  function MapInitializer({ onMap }: { onMap: (m: LeafletMap) => void }) {
    const map = useMap()
    useEffect(() => {
      onMap(map)
      const t = setTimeout(() => {
        map.invalidateSize()
      }, 0)
      return () => clearTimeout(t)
    }, [map, onMap])
    return null
  }

  useEffect(() => {
    if (!isLightboxOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'Escape') setIsLightboxOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isLightboxOpen, nextImage, prevImage])

  return (
    <section
      id='showcase-section'
      className='w-full py-24 sm:py-32'
      aria-labelledby='showcase-heading'
    >
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-3xl text-center'>
          <h2
            id='showcase-heading'
            className='text-black text-4xl font-bold tracking-tight sm:text-5xl'
          >
            A Sacred Place of Natural Beauty
          </h2>
          <p className='text-gray-600 mt-6 text-lg leading-8'>
            Discover the serene landscape and thoughtful design that makes our
            cemetery a peaceful sanctuary for remembrance and reflection.
          </p>
        </div>

        <div className='mt-16'>
          <div className='mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row'>
            <h3 className='text-black text-2xl font-semibold'>Gallery</h3>
            <div className='no-scrollbar w-full overflow-x-auto sm:w-auto'>
              <Tabs
                defaultValue={activeFilter}
                onValueChange={(val) => {
                  if (val) setActiveFilter(val)
                }}
                className='w-full'
                aria-label='Gallery category filter'
              >
                <TabsList className='flex flex-nowrap justify-center sm:justify-end bg-gray-100 rounded-md text-gray-50'>
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className={
                        'whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ' +
                        'text-gray-500 ' +
                        'data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-700/80 data-[state=active]:to-gray-800/60 data-[state=active]:text-white data-[state=active]:dark:text-foreground data-[state=active]:shadow '
                      }
                    >
                      {category.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {visibleImages.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className='group relative'
              >
                <button
                  type='button'
                  onClick={() => openLightbox(index)}
                  className='focus-visible:ring-primary focus-visible:ring-offset-background block w-full overflow-hidden rounded-xl shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
                >
                  <div className='relative aspect-[4/3]'>
                    <img
                      src={image.src}
                      alt={image.alt}
                      className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                      loading='lazy'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
                    <div className='absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                      <Maximize2 className='h-8 w-8 text-white' />
                      <span className='sr-only'>View image</span>
                    </div>
                    <div className='absolute bottom-0 left-0 p-4'>
                      <p className='text-sm font-semibold text-white drop-shadow-md'>
                        {image.caption}
                      </p>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>

          {filteredImages.length > 6 && (
            <div className='mt-8 text-center'>
              <Button
                variant='neon'
                onClick={() => setIsExpanded(!isExpanded)}
                className=' w-full'
              >
                {isExpanded ? 'Show Less' : 'Show More'}
              </Button>
            </div>
          )}
        </div>

        <div className='mt-24 grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-x-8'>
          <div className='lg:max-w-lg'>
            <h3 className='text-black text-3xl font-bold tracking-tight sm:text-4xl'>
              Location Highlights
            </h3>
            <dl className='mt-10 space-y-8'>
              {locationFeatures.map((feature) => (
                <div key={feature.title} className='flex items-start'>
                  <div className='flex-shrink-0'>
                    <div className='bg-black/10 text-primary flex h-12 w-12 items-center justify-center rounded-lg'>
                      <feature.icon
                        className='h-6 w-6 text-black'
                        aria-hidden='true'
                      />
                    </div>
                  </div>
                  <div className='ml-4'>
                    <dt className='text-black text-md font-medium'>
                      {feature.title}
                    </dt>
                    <dd className='text-gray-600 mt-1 text-sm'>
                      {feature.description}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {/* Display cemetery map */}
          <div className='w-full rounded-lg border p-2'>
            <div
              ref={mapContainerRef}
              className='relative z-10 h-[320px] w-full sm:h-[420px] md:h-[480px] lg:h-[480px]'
            >
              <MapContainer
                center={[10.249306880563585, 123.797848311330114]}
                maxZoom={25}
                zoom={18}
                scrollWheelZoom={true}
                zoomControl={false}
                className='h-full w-full rounded-lg'
              >
                <MapInitializer onMap={(m) => setLeafletMap(m)} />
                <TileLayer
                  url='https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                  maxNativeZoom={18}
                  maxZoom={25}
                />
                <Marker position={[10.249306880563585, 123.797848311330114]}>
                  <Popup>
                    Cemetery Location
                    <br /> Explore the grounds.
                  </Popup>
                </Marker>
              </MapContainer>
              {/* Floating location card */}
              <div className='pointer-events-none absolute bottom-2 left-1 z-400'>
                <div className='bg-white/80 pointer-events-auto ml-1 inline-block rounded-lg p-4 shadow-lg backdrop-blur-sm max-w-xs'>
                  <h4 className='text-black text-lg font-semibold'>
                    Finisterre Gardenz
                  </h4>
                  <p className='text-gray-700 mt-1 text-sm'>
                    6QXX+C4 Minglanilla, Cebu
                  </p>
                  <div className='mt-3 flex items-center gap-2'>
                    <Button
                      variant='neon'
                      onClick={() => {
                        if (leafletMap) {
                          leafletMap.flyTo(
                            [10.249306880563585, 123.797848311330114],
                            18,
                            { duration: 1.0 }
                          )
                          leafletMap.invalidateSize()
                        }
                      }}
                    >
                      Explore Map
                    </Button>
                    <Button
                      variant='default'
                      onClick={() => setIsExpanded((s) => !s)}
                      className='border border-gray-300 bg-white text-black hover:bg-gray-100'
                    >
                      View Gallery
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent
          className='max-w-7xl border-none bg-transparent p-2 shadow-none'
          showCloseButton
        >
          {visibleImages.length > 0 && (
            <div className='relative'>
              <motion.img
                key={visibleImages[selectedImage]?.src}
                src={visibleImages[selectedImage]?.src}
                alt={visibleImages[selectedImage]?.alt}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className='max-h-[90vh] w-auto rounded-xl object-contain shadow-2xl'
              />
              <div className='absolute inset-0 flex items-center justify-between'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={prevImage}
                  aria-label='Previous image'
                  className='ml-2 h-12 w-12 rounded-full bg-black/30 text-white hover:bg-black/50'
                >
                  <ChevronLeft className='h-6 w-6' />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={nextImage}
                  aria-label='Next image'
                  className='mr-2 h-12 w-12 rounded-full bg-black/30 text-white hover:bg-black/50'
                >
                  <ChevronRight className='h-6 w-6' />
                </Button>
              </div>
              {/* Caption with gradient backdrop */}
              <div className='absolute bottom-0 w-full'>
                <div className='pointer-events-none absolute inset-0 h-full rounded-b-2xl bg-gradient-to-t from-black via-black/70 to-transparent'></div>
                <div className='flex items-center justify-center p-10 text-center'>
                  <p className='w-full text-sm font-medium text-white drop-shadow-sm'>
                    {visibleImages[selectedImage]?.caption}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
