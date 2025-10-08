import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { memo, useCallback } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'

import type { GalleryImage } from './types'

interface ImageLightboxProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  images: GalleryImage[]
  selectedIndex: number
  onPrevious: () => void
  onNext: () => void
}

export const ImageLightbox = memo(function ImageLightbox({ isOpen, onOpenChange, images, selectedIndex, onPrevious, onNext }: ImageLightboxProps) {
  const currentImage = images[selectedIndex]

  const onPreviousClick = useCallback(() => {
    onPrevious()
  }, [onPrevious])

  const onNextClick = useCallback(() => {
    onNext()
  }, [onNext])

  if (!currentImage) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl border-none bg-transparent p-2 shadow-none" showCloseButton={false}>
        <div className="relative">
          <motion.img
            key={currentImage.src}
            src={currentImage.src}
            alt={currentImage.alt}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl shadow-2xl"
          />
          <div className="absolute inset-0 flex items-center justify-between p-5">
            <Button
              variant="ghost"
              size="icon"
              onClick={onPreviousClick}
              aria-label="Previous image"
              className="bg-primary/50 text-primary-foreground ml-2 h-12 w-12 rounded-full"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onNextClick}
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
              <p className="w-full text-sm font-medium text-white drop-shadow-sm">{currentImage.caption}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
})
