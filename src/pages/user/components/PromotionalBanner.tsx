import { Megaphone, ArrowRight, Sparkles } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type PromotionalBannerProps = {
  title: string
  description: string
  imageSrc?: string
  imageAlt?: string
  badgeText?: string
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
  badgeText = 'Announcement',
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
        'relative mb-10 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br p-0 text-white shadow-2xl shadow-black/50 dark:border-white/20',
        variantStyles[variant],
        className,
      )}
    >
      {/* Enhanced animated background pattern */}
      <div className="absolute inset-0 opacity-40 mix-blend-overlay">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.6), transparent 70%)',
          }}
        />
        {/* Additional gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20" />
      </div>

      {/* Enhanced floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-3 w-3 animate-bounce rounded-full bg-white/30 shadow-lg" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-1/3 right-1/3 h-2 w-2 animate-bounce rounded-full bg-white/40 shadow-md" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 left-1/2 h-2.5 w-2.5 animate-bounce rounded-full bg-white/35 shadow-lg" style={{ animationDelay: '2s', animationDuration: '3.5s' }} />
        <div className="absolute top-1/2 right-1/4 h-1.5 w-1.5 animate-bounce rounded-full bg-white/50 shadow-sm" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }} />
      </div>

      {/* Subtle mesh pattern overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[length:20px_20px]" />
      </div>

      <div className={cn('relative z-10 flex flex-col items-start gap-6 px-8', sizeStyles[size], 'md:flex-row md:items-center md:justify-between')}>
        <div className="max-w-2xl space-y-4">
          {/* Enhanced Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-medium tracking-wide shadow-lg backdrop-blur-md">
            <Megaphone className="h-4 w-4 text-white" aria-hidden="true" />
            <span className="text-white">{badgeText}</span>
            <Sparkles className="h-3 w-3 animate-pulse text-yellow-300" aria-hidden="true" />
          </div>

          {/* Enhanced Title */}
          <h1 className="animate-fade-in text-2xl leading-tight font-bold tracking-tight text-white drop-shadow-2xl sm:text-3xl lg:text-4xl">{title}</h1>

          {/* Enhanced Description */}
          <p className="animate-fade-in text-sm leading-relaxed text-white/95 drop-shadow-lg md:text-base" style={{ animationDelay: '0.2s' }}>
            {description}
          </p>

          {/* Enhanced CTA Button */}
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={handleScrollToAnnouncements}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-white/95 px-6 py-3 text-sm font-semibold text-slate-800 shadow-xl shadow-black/30 transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <span className="relative z-10">{buttonText}</span>
              <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Button>
          </div>
        </div>

        {/* Enhanced Image Section */}
        {imageSrc && (
          <div className="relative flex-shrink-0 overflow-hidden rounded-2xl shadow-2xl shadow-black/30 md:max-w-sm lg:max-w-md">
            <div className="aspect-[3/2] overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-transparent">
              <img src={imageSrc} alt={imageAlt} loading="lazy" className="h-full w-full object-cover transition-all duration-700 ease-out hover:scale-105 hover:brightness-110" />
              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
