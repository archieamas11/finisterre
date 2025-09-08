import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, MapPin, Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

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
  },
}

const buttonVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
  },
}

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 [mask-image:linear-gradient(to_bottom,transparent,black_0%,black_40%,transparent)]">
        {/* Background video: muted autoplay loop with a local poster and source element for better browser handling */}
        <video
          src="https://finisterre.ph/wp-content/uploads/2023/09/Finisterre-Masterplan-Actual-Development.mp4"
          poster="/hero-bg.webp"
          className="pointer-events-none h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          role="presentation"
        />

        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent" />
      </div>

      {/* Main Content Container */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-5xl px-6 py-20 text-center sm:px-8 lg:py-24"
        variants={containerVariants}
        initial={shouldReduceMotion ? 'visible' : 'hidden'}
        animate="visible"
      >
        {/* Badge */}
        <motion.div className="mb-8 flex justify-center" variants={itemVariants}>
          {/* Contact Information */}
          <motion.div className="flex flex-col items-center justify-center gap-4 text-gray-200 sm:flex-row" variants={itemVariants}>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Contact Us:</span>
              <a href="tel:09988411173" className="hover:text-[var(--brand-secondary)] hover:underline">
                0998 841 1173
              </a>
              <span className="text-stone-400">|</span>
              <a href="tel:09176216823" className="hover:text-[var(--brand-secondary)] hover:underline">
                0917 621 6823
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Main heading */}
        <motion.div className="mb-10 space-y-6" variants={itemVariants}>
          <h1 className="font-serif text-4xl leading-tight tracking-tight text-[var(--brand-secondary)] sm:text-5xl md:text-6xl lg:text-7xl">
            <span>Not Your Usual</span>
            <span className="mt-2 block bg-clip-text font-serif font-semibold text-[var(--brand-secondary)]">Memorial Park</span>
          </h1>

          <motion.p className="mx-auto max-w-2xl font-sans text-lg leading-relaxed text-gray-100 sm:text-xl md:text-xl" variants={itemVariants}>
            Inspired by <span className="font-medium text-[var(--brand-secondary)]">Spain's El Camino de Santiago</span>, Finisterre Gardenz
            celebrates life, and honors the pilgrimage we all make as we live life to the fullest.
          </motion.p>
        </motion.div>

        {/* CTA Section */}
        <motion.div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4" variants={buttonVariants}>
          <Button
            size="lg"
            variant="default"
            className="flex items-center gap-3 rounded-lg bg-[var(--brand-primary)] px-5 py-3 font-semibold text-white shadow-md transition-transform duration-200 hover:scale-[1.02] hover:bg-[var(--brand-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-secondary)]"
          >
            <Link to="/map" aria-label="Explore plots map" className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-white" aria-hidden />
              <span className="text-white">Explore Plots</span>
              <ArrowRight className="h-4 w-4 text-white" aria-hidden />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="secondary"
            className="rounded-lg bg-gray-100 px-5 py-3 font-medium text-[var(--brand-primary)] shadow-sm transition-transform duration-200 hover:scale-[1.02] hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
          >
            <Link to="/about" aria-label="Read our story" className="flex items-center gap-2">
              <Leaf className="h-4 w-4" aria-hidden />
              <span>Our Story</span>
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
