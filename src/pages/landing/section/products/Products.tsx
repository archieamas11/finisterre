import { useState } from 'react'
import { products } from './constants'
import { AdditionalServices } from './AdditionalServices'
import { MobileList } from './MobileList'
import { DesktopProductList } from './DesktopProductList'

export function Products() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section id="products" aria-labelledby="products-heading" className="landing-page-wrapper">
      <div className="mx-auto max-w-lg text-center">
        <h2 id="products-heading" className="landing-title">
          Our Products
        </h2>
        <p className="landing-subtitle">Discover the range of products we offer to honor your loved ones with dignity and peace.</p>
      </div>
      <MobileList products={products} />
      <DesktopProductList products={products} hoveredId={hoveredId} setHoveredId={setHoveredId} />
      <AdditionalServices />
    </section>
  )
}
