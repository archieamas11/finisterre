import { useCallback, useState } from 'react'

import type { GalleryImage } from './types'
import { GALLERY_IMAGES } from './constants'
import { GallerySection } from './GallerySection'
import { ImageLightbox } from './ImageLightbox'
import { LocationFeatures } from './LocationFeatures'
import { LocationMap } from './LocationMap'

export function Showcase() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const openLightbox = useCallback((image: GalleryImage) => {
    const index = GALLERY_IMAGES.findIndex((img) => img.id === image.id)
    setSelectedImageIndex(index)
    setIsLightboxOpen(true)
  }, [])

  const nextImage = useCallback(() => {
    setSelectedImageIndex((prev) => (prev + 1) % GALLERY_IMAGES.length)
  }, [])

  const prevImage = useCallback(() => {
    setSelectedImageIndex((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length)
  }, [])

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

        <GallerySection onImageClick={openLightbox} />

        <div className="mt-24 grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-x-8">
          <LocationFeatures />
          <LocationMap className="w-full rounded-lg border border-gray-600 p-1" />
        </div>
      </div>

      <ImageLightbox
        isOpen={isLightboxOpen}
        onOpenChange={setIsLightboxOpen}
        images={GALLERY_IMAGES}
        selectedIndex={selectedImageIndex}
        onPrevious={prevImage}
        onNext={nextImage}
      />
    </section>
  )
}
