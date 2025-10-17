import { cn } from '@/lib/utils'
import { type DesktopProductListProps } from './types'

export function DesktopProductList({ products, hoveredId, setHoveredId }: DesktopProductListProps) {
  return (
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
                isHovered ? 'from-black/80 via-black/40 to-transparent opacity-100' : 'from-black/90 to-transparent opacity-100',
              )}
            />

            {/* Content */}
            <div className="relative flex h-full flex-col justify-end p-6">
              {/* Title - always visible */}
              <h2
                className={cn(
                  'absolute text-xl font-bold text-balance text-white transition-all duration-500 ease-out',
                  isHovered
                    ? 'bottom-20 left-6 w-[280px] text-left text-4xl text-[var(--brand-secondary)]'
                    : 'top-1/2 left-1/2 w-[280px] -translate-x-1/2 -translate-y-1/2 text-center',
                )}
              >
                {product.title}
              </h2>

              {/* Description - shows on hover */}
              <div
                className={cn(
                  'overflow-hidden transition-all duration-300 ease-in-out',
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
  )
}
