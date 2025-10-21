import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Maximize2 } from 'lucide-react'

import type { GalleryImage } from './types'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { CATEGORIES, GALLERY_IMAGES } from './constants'

interface GallerySectionProps {
  onImageClick: (image: GalleryImage) => void
}

export function GallerySection({ onImageClick }: GallerySectionProps) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [isExpanded, setIsExpanded] = useState(false)

  const filteredImages = useMemo(() => {
    return activeFilter === 'all' ? GALLERY_IMAGES : GALLERY_IMAGES.filter((img) => img.category === activeFilter)
  }, [activeFilter])

  const visibleImages = useMemo(() => {
    return isExpanded ? filteredImages : filteredImages.slice(0, 6)
  }, [filteredImages, isExpanded])

  useEffect(() => {
    if (filteredImages.length === 0) {
      setIsExpanded(false)
    }
  }, [filteredImages])

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev)
  }, [])

  const activeCategoryLabel = CATEGORIES.find((c) => c.id === activeFilter)?.label

  return (
    <div className="mt-16">
      <div className="mb-2 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div>
          <p className="text-2xl font-semibold text-[var(--brand-primary)]">Gallery</p>
          <p className="text-sm text-gray-400">Explore our beautiful memorial spaces</p>
        </div>
        <div className="no-scrollbar flex w-full items-center overflow-x-auto sm:w-auto">
          <Tabs
            defaultValue={activeFilter}
            onValueChange={(val) => {
              if (val) setActiveFilter(val)
            }}
            className="w-full"
            aria-label="Gallery category filter"
          >
            <TabsList className="flex flex-nowrap justify-center gap-3 rounded-full bg-[var(--brand-primary)]/10 py-0.5 backdrop-blur sm:justify-end">
              {CATEGORIES.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className={cn(
                    'rounded-full text-sm font-medium whitespace-nowrap',
                    'px-5 text-gray-500 dark:text-gray-500',
                    'rounded-full data-[state=active]:bg-[var(--brand-secondary)] data-[state=active]:text-[var(--brand-primary)] data-[state=active]:dark:bg-[var(--brand-secondary)] data-[state=active]:dark:text-[var(--brand-primary)]',
                  )}
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {filteredImages.length === 0 ? (
        <EmptyGalleryState categoryLabel={activeCategoryLabel} onViewAll={() => setActiveFilter('all')} />
      ) : (
        <>
          <GalleryGrid images={visibleImages} onImageClick={onImageClick} />
          {filteredImages.length > 6 && (
            <div className="mt-8 text-center">
              <Button variant="neon" onClick={toggleExpanded} className="w-full" aria-expanded={isExpanded}>
                {isExpanded ? 'Show Less' : 'Show More'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

interface EmptyGalleryStateProps {
  categoryLabel?: string
  onViewAll: () => void
}

const EmptyGalleryState = memo(function EmptyGalleryState({ categoryLabel, onViewAll }: EmptyGalleryStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-12 text-center"
    >
      <div className="mb-4 rounded-full bg-gray-200 p-6">
        <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">No Images Found</h3>
      <p className="text-sm text-gray-500">
        There are no images in the <span className="font-medium text-[var(--brand-primary)]">{categoryLabel}</span> category.
      </p>
      <Button variant="neon" onClick={onViewAll} className="mt-6">
        View All Images
      </Button>
    </motion.div>
  )
})

interface GalleryGridProps {
  images: GalleryImage[]
  onImageClick: (image: GalleryImage) => void
}

const GalleryGrid = memo(function GalleryGrid({ images, onImageClick }: GalleryGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image, index) => (
        <GalleryItem key={image.id} image={image} index={index} onClick={() => onImageClick(image)} />
      ))}
    </div>
  )
})

interface GalleryItemProps {
  image: GalleryImage
  index: number
  onClick: () => void
}

const GalleryItem = memo(function GalleryItem({ image, index, onClick }: GalleryItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative"
    >
      <button
        type="button"
        onClick={onClick}
        className="focus-visible:ring-primary focus-visible:ring-offset-background block w-full overflow-hidden rounded-xl shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        aria-label={`View ${image.alt}`}
      >
        <div className="relative aspect-[4/3]">
          <img
            src={image.src}
            alt={image.alt}
            className="h-full w-full rounded-md object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Maximize2 className="h-20 w-20 rounded-full bg-white/25 p-5 text-[var(--brand-secondary)]/80" aria-hidden="true" />
          </div>
          <div className="absolute bottom-0 left-0 p-4">
            <p className="text-sm font-semibold text-white drop-shadow-md">{image.caption}</p>
          </div>
        </div>
      </button>
    </motion.div>
  )
})
