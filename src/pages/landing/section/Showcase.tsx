import type { Map as LeafletMap } from 'leaflet'

import { motion } from 'framer-motion'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { ChevronLeft, ChevronRight, Maximize2, Car, Plug, CloudRain, ShieldCheck, Wrench } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { FaDirections } from 'react-icons/fa'
import { MdTravelExplore } from 'react-icons/md'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
const galleryImages = [
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
]

const locationFeatures = [
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

export default function CemeteryShowcase() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [isExpanded, setIsExpanded] = useState(false)
  const [leafletMap, setLeafletMap] = useState<LeafletMap | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)

  // Create custom cemetery marker icon
  const cemeteryIcon = useMemo(() => {
    return L.divIcon({
      html: `
        <div class="cemetery-marker">
          <div class="marker-pin">
            <div class="marker-shadow"></div>
            <div class="marker-body">
              <div class="marker-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="white"/>
                  <rect x="8" y="18" width="8" height="4" fill="white"/>
                  <rect x="10" y="16" width="4" height="2" fill="white"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      `,
      className: 'custom-cemetery-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    })
  }, [])

  // Add custom marker styles
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .custom-cemetery-marker {
        background: none !important;
        border: none !important;
      }
      
      .cemetery-marker {
        position: relative;
        width: 40px;
        height: 40px;
      }
      
      .marker-pin {
        position: relative;
        width: 100%;
        height: 100%;
      }
      
      .marker-shadow {
        position: absolute;
        bottom: -2px;
        left: 50%;
        transform: translateX(-50%);
        width: 20px;
        height: 8px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        filter: blur(1px);
      }
      
      .marker-body {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #059669 0%, #0d9488 100%);
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: translateX(-50%) rotate(-45deg);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
      }
      
      .marker-body:hover {
        transform: translateX(-50%) rotate(-45deg) scale(1.1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
      }
      
      .marker-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .marker-icon svg {
        width: 16px;
        height: 16px;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const categories = [
    { id: 'all', label: 'All Views' },
    { id: 'chapel', label: 'Chapel' },
    { id: 'serenity', label: 'Serenity' },
    { id: 'chambers', label: 'Chambers' },
    { id: 'columbarium', label: 'Columbarium' },
    { id: 'playground', label: 'Playground' },
    { id: 'parking', label: 'Parking' },
  ]

  const filteredImages = useMemo(() => {
    return activeFilter === 'all' ? galleryImages : galleryImages.filter((img) => img.category === activeFilter)
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
    setSelectedImage((prev) => (prev - 1 + visibleImages.length) % visibleImages.length)
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
    if (!mapContainerRef.current || !leafletMap || typeof ResizeObserver === 'undefined') return
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

  return (
    <section id="showcase-section" aria-labelledby="showcase-heading">
      <div className="landing-page-wrapper">
        <div className="mx-auto max-w-4xl text-center">
          <h2 id="showcase-heading" className="landing-title">
            A Sacred Place of Natural Beauty
          </h2>
          <p className="landing-subtitle">
            Discover the serene landscape and thoughtful design that makes our cemetery a peaceful sanctuary for remembrance and reflection.
          </p>
        </div>

        <div className="mt-16">
          <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <h3 className="text-2xl font-semibold text-[var(--brand-primary)]">Gallery</h3>
            <div className="no-scrollbar w-full overflow-x-auto sm:w-auto">
              <Tabs
                defaultValue={activeFilter}
                onValueChange={(val) => {
                  if (val) setActiveFilter(val)
                }}
                className="w-full"
                aria-label="Gallery category filter"
              >
                <TabsList className="flex flex-nowrap justify-center rounded-md bg-gray-100 text-gray-50 sm:justify-end">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className={
                        'rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap ' +
                        'text-gray-500' +
                        'data-[state=active]:dark:text-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-700/80 data-[state=active]:to-gray-800/60 data-[state=active]:text-white data-[state=active]:shadow'
                      }
                    >
                      {category.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleImages.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative"
              >
                <button
                  type="button"
                  onClick={() => openLightbox(index)}
                  className="focus-visible:ring-primary focus-visible:ring-offset-background block w-full overflow-hidden rounded-xl shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <div className="relative aspect-[4/3]">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <Maximize2 className="h-8 w-8 text-white" />
                      <span className="sr-only">View image</span>
                    </div>
                    <div className="absolute bottom-0 left-0 p-4">
                      <p className="text-sm font-semibold text-white drop-shadow-md">{image.caption}</p>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>

          {filteredImages.length > 6 && (
            <div className="mt-8 text-center">
              <Button variant="neon" onClick={() => setIsExpanded(!isExpanded)} className="w-full">
                {isExpanded ? 'Show Less' : 'Show More'}
              </Button>
            </div>
          )}
        </div>

        <div className="mt-24 grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-x-8">
          <div className="lg:max-w-lg">
            <h3 className="text-3xl font-bold tracking-tight text-[var(--brand-primary)] sm:text-4xl">Location Highlights</h3>
            <dl className="mt-10 space-y-8">
              {locationFeatures.map((feature) => (
                <div key={feature.title} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="text-primary flex h-12 w-12 items-center justify-center rounded-lg bg-black/10">
                      <feature.icon className="h-6 w-6 text-amber-500" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <dt className="text-md font-medium text-[var(--brand-primary)]">{feature.title}</dt>
                    <dd className="mt-1 text-sm text-gray-600">{feature.description}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {/* Display cemetery map */}
          <div className="w-full rounded-lg border border-gray-600 p-1">
            <div ref={mapContainerRef} className="relative z-10 h-[320px] w-full sm:h-[420px] md:h-[480px] lg:h-[480px]">
              <MapContainer
                center={[10.249306880563585, 123.797848311330114]}
                zoom={16}
                maxZoom={20}
                minZoom={10}
                scrollWheelZoom={true}
                zoomControl={false}
                maxBounds={[
                  [10.247, 123.795],
                  [10.252, 123.8],
                ]}
                maxBoundsViscosity={1.0}
                className="h-full w-full rounded-lg"
                style={{ height: '100%', width: '100%' }}
              >
                <MapInitializer onMap={(m) => setLeafletMap(m)} />
                <TileLayer
                  url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  maxNativeZoom={19}
                  maxZoom={20}
                />
                <Marker position={[10.249306880563585, 123.797848311330114]} icon={cemeteryIcon}>
                  <Popup minWidth={100} maxWidth={200}>
                    <div className="w-full max-w-[250px]">
                      <div className="flex gap-3">
                        {/* Main content */}
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900">Finisterre Gardenz</h3>
                          <p className="mt-1 text-xs text-emerald-600">Memorial Park</p>

                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <div className="inline-flex items-center gap-1">
                              <ShieldCheck className="h-3 w-3" />
                              <span>24/7 Security</span>
                            </div>
                            <span className="text-gray-300">•</span>
                            <span>150+ acres</span>
                          </div>

                          <p className="mt-3 text-xs text-gray-600">
                            A peaceful, thoughtfully landscaped memorial park set within rolling grounds and native plantings.
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 border-t pt-2">
                        <p className="text-xs text-gray-500">6QXX+C4 Minglanilla, Cebu</p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
              {/* Floating location card */}
              <div className="pointer-events-none absolute bottom-2 left-1 z-20">
                <div className="pointer-events-auto ml-1 inline-block max-w-xs rounded-lg border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm">
                  <h4 className="text-lg font-semibold text-[var(--brand-primary)]">Finisterre Gardenz</h4>
                  <p className="mt-1 text-sm text-gray-600">6QXX+C4 Minglanilla, Cebu</p>
                  <div className="mt-3 flex items-center gap-2">
                    <Link to="/map">
                      <Button
                        size="sm"
                        onClick={() => {
                          if (leafletMap) {
                            leafletMap.flyTo([10.249306880563585, 123.797848311330114], 18, { duration: 1.5 })
                          }
                        }}
                        className="bg-[var(--brand-primary)] text-xs text-white hover:bg-[var(--brand-primary)]"
                      >
                        <MdTravelExplore />
                        Explore Map
                      </Button>
                    </Link>
                    <Link to={`/map?to=10.248166481872728,123.79754558858059`}>
                      <Button size={'sm'} variant="neon" className="text-xs">
                        <FaDirections />
                        Get Direction
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-7xl border-none bg-transparent p-2 shadow-none" showCloseButton>
          {visibleImages.length > 0 && (
            <div className="relative">
              <motion.img
                key={visibleImages[selectedImage]?.src}
                src={visibleImages[selectedImage]?.src}
                alt={visibleImages[selectedImage]?.alt}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="max-h-[90vh] w-auto rounded-xl border-8 object-contain shadow-2xl"
              />
              <div className="absolute inset-0 flex items-center justify-between p-5">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevImage}
                  aria-label="Previous image"
                  className="bg-primary/50 text-primary-foreground ml-2 h-12 w-12 rounded-full"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextImage}
                  aria-label="Next image"
                  className="bg-primary/50 text-primary-foreground mr-2 h-12 w-12 rounded-full"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
              {/* Caption with gradient backdrop */}
              <div className="absolute bottom-0 w-full">
                <div className="pointer-events-none absolute inset-0 h-full rounded-b-2xl bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                <div className="flex items-center justify-center p-10 text-center">
                  <p className="w-full text-sm font-medium text-white drop-shadow-sm">{visibleImages[selectedImage]?.caption}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
