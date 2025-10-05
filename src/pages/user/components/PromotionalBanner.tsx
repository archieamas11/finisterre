import { ArrowRight } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type PromotionalBannerProps = {
  title: string
  description: string
  imageSrc?: string
  imageAlt?: string
  buttonText?: string
  onButtonClick?: () => void
  className?: string
  variant?: 'default' | 'gradient' | 'minimal' | 'sunset' | 'ocean' | 'forest' | 'royal' | 'warm'
  size?: 'sm' | 'md' | 'lg'
}

const variantStyles = {
  default: 'from-blue-600 via-purple-600 to-pink-600',
  gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
  minimal: 'from-slate-700 via-slate-800 to-slate-900',
  sunset: 'from-orange-500 via-red-500 to-pink-500',
  ocean: 'from-blue-500 via-cyan-500 to-teal-500',
  forest: 'from-green-500 via-emerald-500 to-teal-500',
  royal: 'from-purple-600 via-violet-600 to-indigo-600',
  warm: 'from-amber-500 via-orange-500 to-red-500',
}

const sizeStyles = {
  sm: 'py-6',
  md: 'py-10',
  lg: 'py-12',
}

export const PromotionalBanner: React.FC<PromotionalBannerProps> = ({
  title,
  description,
  imageSrc,
  imageAlt = 'Promotional banner image',
  buttonText = 'Learn More',
  onButtonClick,
  className,
  variant = 'default',
  size = 'md',
}) => {
  const handleScrollToAnnouncements = () => {
    const el = document.getElementById('announcements-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    onButtonClick?.()
  }

  return (
    <section
      aria-label="Latest announcement"
      className={cn(
        'relative mb-10 overflow-hidden rounded-3xl bg-[var(--brand-primary)] p-0 text-white shadow-lg',
        variantStyles[variant],
        className,
      )}
    >
      <div className={cn('relative z-10 flex flex-col items-start gap-6 px-8', sizeStyles[size], 'md:flex-row md:items-center md:justify-between')}>
        <div className="max-w-2xl space-y-4">
          <h1 className="animate-fade-in text-2xl leading-tight font-bold tracking-tight text-white drop-shadow-2xl sm:text-3xl lg:text-4xl">
            {title}
          </h1>

          <p className="animate-fade-in text-sm leading-relaxed text-white/95 drop-shadow-lg md:text-base" style={{ animationDelay: '0.2s' }}>
            {description}
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant={'secondary'}
              onClick={handleScrollToAnnouncements}
              className="group bg-[var(--brand-secondary)] text-black hover:bg-[var(--brand-secondary)]"
            >
              <span className="relative z-10">{buttonText}</span>
              <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        </div>

        {/* Enhanced Image Section */}
        {imageSrc && (
          <div className="relative flex-shrink-0 overflow-hidden rounded-2xl shadow-2xl shadow-black/30 md:max-w-sm lg:max-w-md">
            <div className="aspect-[3/2] overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-transparent">
              <img
                src={imageSrc}
                alt={imageAlt}
                loading="lazy"
                className="h-full w-full object-cover transition-all duration-700 ease-out hover:scale-105 hover:brightness-110"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
