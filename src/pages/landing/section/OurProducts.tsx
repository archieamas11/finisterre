'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Phone } from 'lucide-react'

interface Product {
  id: number
  title: string
  description: string
  image: string
}

const products: Product[] = [
  {
    id: 1,
    title: 'Serenity Lawn',
    description: 'A double-depth in-ground burial plot marked with marble stone and covered with well-manicured grass.',
    image: 'https://finisterre.ph/wp-content/uploads/elementor/thumbs/SERENITY-LAWN-1-qydmp3m9677crhews1nge847zm9sap8y0lp6akt40w.png',
  },
  {
    id: 2,
    title: 'Columbarium',
    description: 'A best-in-class burial unit crafted with premium concrete, with flat markers made of authentic marble stone.',
    image: 'https://finisterre.ph/wp-content/uploads/elementor/thumbs/COLUMBARIUM-SAN-MIGUEL-qydmp4k3d18n33djmk22ypvol055iecocqcnrurpuo.png',
  },
  {
    id: 3,
    title: 'Bone Chamber & Ash Vault',
    description: 'A concrete repository for bone and ash remains at the upper park level with a garden and magnificent view.',
    image: 'https://finisterre.ph/wp-content/uploads/elementor/thumbs/ASH-VAULT-BONE-CHAMBER-qydmp1qksj4s49hn30u798lasuj1vb1hcce7c0vwdc.png',
  },
  {
    id: 4,
    title: 'Family Estate',
    description: 'This sacred way to honor and memorialize family, there is nothing more special than an estate of your own.',
    image: 'https://finisterre.ph/wp-content/uploads/elementor/thumbs/GARDEN-ESTATE-qydmp2oezd62fvg9xj8ttqcre8ef3057oh1otaui74.png',
  },
]

export default function OurProducts() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section id="products" aria-labelledby="products-heading" className="landing-page-wrapper">
      <div className="mx-auto max-w-lg text-center">
        <h2 id="products-heading" className="landing-title">
          Our Products
        </h2>
        <p className="landing-subtitle">Discover the range of products we offer to honor your loved ones with dignity and peace.</p>
      </div>
      {/* Mobile: Simple list view */}
      <div className="mx-auto mt-12 grid gap-6 md:hidden">
        {products.map((product) => (
          <div key={product.id} className="overflow-hidden rounded-lg bg-white shadow-lg dark:bg-slate-800">
            <div className="aspect-video w-full overflow-hidden">
              <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
            </div>
            <div className="p-6">
              <h3 className="text-primary text-2xl font-bold dark:text-white">{product.title}</h3>
              <p className="mt-3 text-slate-600 dark:text-slate-300">{product.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-20 hidden flex-row gap-4 md:flex">
        {products.map((product) => {
          const isHovered = hoveredId === product.id
          const isAnyHovered = hoveredId !== null

          // When not hovered, all items have equal flex: 1
          const flexValue = isAnyHovered ? (isHovered ? 1.8 : 0.75) : 1

          return (
            <div
              key={product.id}
              className="relative h-96 cursor-pointer overflow-hidden rounded-lg transition-all duration-200 ease-in-out"
              style={{
                flex: `${flexValue} 1 0%`,
              }}
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
                style={{
                  backgroundImage: `url(${product.image})`,
                }}
              />

              <div
                className={cn(
                  'absolute inset-0 bg-gradient-to-t transition-opacity duration-700',
                  isHovered ? 'from-black/90 via-black/50 to-transparent opacity-100' : 'from-black/70 to-transparent opacity-100',
                )}
              />

              {/* Content */}
              <div className="relative flex h-full flex-col justify-end p-6">
                {/* Title - always visible */}
                <h2
                  className={cn(
                    'max-w-70 text-lg font-bold text-balance text-white transition-all',
                    isHovered ? 'max-w-70 translate-y-0 text-3xl text-[var(--brand-secondary)]' : 'translate-y-2',
                  )}
                >
                  {product.title}
                </h2>

                {/* Description - shows on hover */}
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-200',
                    isHovered ? 'mt-3 max-h-32 translate-y-0 opacity-100' : 'max-h-0 translate-y-4 opacity-0',
                  )}
                >
                  <p className="max-w-100 text-sm leading-relaxed text-pretty text-white/95">{product.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {/* Additional Services CTA */}
      <div className="relative mt-24 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-2xl sm:p-12 lg:p-16">
        <div className="relative mx-auto max-w-4xl text-center">
          <h3 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">Additional Services</h3>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            We also provide respectful services for Interment Transfer, Reburial, and Exhumation for fresh, skeletal, and cinerary remains.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/services">
              <Button
                variant="secondary"
                size="lg"
                className={cn('bg-primary text-primary-foreground', 'transition-all duration-200', 'px-8 py-6 text-base')}
              >
                View All Services
                <span aria-hidden="true" className="ml-2">
                  →
                </span>
              </Button>
            </Link>

            <Link to={'#contact'}>
              <Button
                variant="outline"
                size="lg"
                className={cn(
                  'border border-white/30 bg-transparent text-white hover:bg-transparent hover:text-white dark:border-white/30 dark:bg-transparent',
                  'transition-all duration-200',
                  'px-8 py-6 text-base',
                )}
              >
                <Phone /> Contact Us
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          {/* <div className="mt-12 flex flex-wrap items-center justify-center gap-8 border-t border-white/10 pt-8 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>Licensed & Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>Trusted by Families</span>
              </div>
            </div> */}
        </div>
      </div>
    </section>
  )
}
