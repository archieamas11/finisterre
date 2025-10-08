import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Phone } from 'lucide-react'

interface Product {
  name: string
  description: string
  image: string
}

interface ProductData {
  title: string
  description: string
  products: Product[]
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
}

export default function Products() {
  const productData: ProductData = {
    title: 'Our Products',
    description: 'Discover the range of products we offer to honor your loved ones with dignity and peace.',
    products: [
      {
        name: 'Serenity Lawn',
        description: 'A double-depth in-ground burial plot marked with marble stone and covered with well-manicured grass.',
        image: 'https://finisterre.ph/wp-content/uploads/elementor/thumbs/SERENITY-LAWN-1-qydmp3m9677crhews1nge847zm9sap8y0lp6akt40w.png',
      },
      {
        name: 'Columbarium (Niche)',
        description: 'A best-in-class burial unit crafted with premium concrete, with flat markers made of authentic marble stone.',
        image: 'https://finisterre.ph/wp-content/uploads/elementor/thumbs/COLUMBARIUM-SAN-MIGUEL-qydmp4k3d18n33djmk22ypvol055iecocqcnrurpuo.png',
      },
      {
        name: 'Bone Chamber & Ash Vault',
        description: 'A concrete repository for bone and ash remains at the upper park level with a garden and magnificent view.',
        image: 'https://finisterre.ph/wp-content/uploads/elementor/thumbs/ASH-VAULT-BONE-CHAMBER-qydmp1qksj4s49hn30u798lasuj1vb1hcce7c0vwdc.png',
      },
      {
        name: 'Family Estate',
        description: 'This sacred way to honor and memorialize family, there is nothing more special than an estate of your own.',
        image: 'https://finisterre.ph/wp-content/uploads/elementor/thumbs/GARDEN-ESTATE-qydmp2oezd62fvg9xj8ttqcre8ef3057oh1otaui74.png',
      },
    ],
  }

  return (
    <section id="products" aria-labelledby="products-heading">
      <div className="landing-page-wrapper">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-lg text-center"
        >
          <h2 id="products-heading" className="landing-title">
            {productData.title}
          </h2>
          <p className="landing-subtitle">{productData.description}</p>
        </motion.div>

        {/* Product Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4 lg:gap-6"
        >
          {productData.products.map((product, index) => (
            <motion.article
              key={product.name}
              variants={itemVariants}
              className={cn(
                'group relative flex flex-col overflow-hidden rounded-3xl bg-white',
                'shadow-lg ring-1 ring-slate-900/5',
                'transition-all duration-300 ease-in-out',
                'hover:-translate-y-2 hover:shadow-2xl hover:ring-slate-900/10',
              )}
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={product.image}
                  alt={`${product.name} - Memorial park burial option`}
                  className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                  loading="lazy"
                  width={400}
                  height={300}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/0 to-slate-900/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Card Number Badge */}
                <div className="absolute top-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg ring-1 ring-slate-900/10 backdrop-blur-sm">
                  <span className="text-lg font-bold text-[var(--brand-primary)]">{String(index + 1).padStart(2, '0')}</span>
                </div>
              </div>

              {/* Content Container */}
              <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                <div className="flex-1 space-y-3">
                  <h3 className="text-xl font-bold text-[var(--brand-primary)] transition-colors duration-200 sm:text-2xl">{product.name}</h3>
                  <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{product.description}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Additional Services CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative mt-24 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-2xl sm:p-12 lg:p-16"
        >
          <div className="relative mx-auto max-w-4xl text-center">
            <h3 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">Additional Services</h3>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              We also provide respectful services for Interment Transfer, Reburial, and Exhumation for fresh, skeletal, and cinerary remains.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/about">
                <Button
                  variant="secondary"
                  size="lg"
                  className={cn(
                    'bg-[var(--brand-secondary)] font-semibold text-slate-900 dark:bg-[var(--brand-secondary)]',
                    'transition-all duration-200',
                    'px-8 py-6 text-base',
                  )}
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
                    'border-2 border-white/30 bg-white/5 text-white backdrop-blur-sm',
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
        </motion.div>
      </div>
    </section>
  )
}
