import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, MapPin, Heart } from 'lucide-react'
import { FaPhoneAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text'
import { Button } from '@/components/ui/button'

// Smooth, understated animation variants with reduced-motion support
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const subtleItem = {
  hidden: { opacity: 0, y: 12, scale: 0.997 },
  visible: { opacity: 1, y: 0, scale: 1 },
}

const subtleBadge = {
  hidden: { opacity: 0, y: -6, scale: 0.99 },
  visible: { opacity: 1, y: 0, scale: 1 },
}

const subtleHeading = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

const subtleButton = {
  hidden: { opacity: 0, y: 8, scale: 0.998 },
  visible: { opacity: 1, y: 0, scale: 1 },
}

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 [mask-image:linear-gradient(to_bottom,transparent,black_0%,black_30%,transparent)]">
        <img
          className="h-full w-full object-cover"
          src="/hero-bg.webp"
          alt="Scenic landscape of Finisterre Gardenz memorial park, evoking peace and remembrance"
          width={1920}
          height={1280}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent" />
      </div>
      {/* Main Content Container */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-7xl px-6 text-center sm:px-8 lg:mb-10"
        variants={containerVariants}
        initial={shouldReduceMotion ? 'visible' : 'hidden'}
        animate="visible"
        transition={{
          duration: 0.72,
          ease: [0.22, 0.8, 0.3, 1],
          staggerChildren: shouldReduceMotion ? 0 : 0.08,
          delayChildren: shouldReduceMotion ? 0 : 0.14,
        }}
      >
        {/* Premium badge */}
        <motion.div className="mb-6 flex justify-center" variants={shouldReduceMotion ? undefined : subtleBadge}>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md">
            <FaPhoneAlt />
            <a href="tel:09988411173" className="tracking-wider hover:underline">
              09988411173
            </a>
            <hr className="h-4 w-px shrink-0 bg-neutral-400" />
            <a href="tel:09176216823" className="tracking-wider hover:underline">
              09176216823
            </a>
          </div>
        </motion.div>
        {/* Main heading with modern typography */}
        <motion.div className="mb-10 space-y-4" variants={shouldReduceMotion ? undefined : subtleItem}>
          <h1 className="text-4xl leading-tight font-bold text-white sm:text-6xl lg:text-7xl">
            <motion.span
              className="block bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent drop-shadow-lg"
              variants={shouldReduceMotion ? undefined : subtleHeading}
            >
              Not Your Usual
            </motion.span>
            <motion.span
              className="mt-2 block bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text font-extrabold text-transparent"
              variants={shouldReduceMotion ? undefined : subtleHeading}
              transition={{ delay: shouldReduceMotion ? 0 : 0.06 }}
            >
              Memorial Park
            </motion.span>
          </h1>
          <motion.p
            className="mx-auto max-w-3xl text-lg leading-relaxed font-light text-white/80 sm:text-xl"
            variants={shouldReduceMotion ? undefined : subtleItem}
            transition={{ delay: shouldReduceMotion ? 0 : 0.12 }}
          >
            Inspired by Spain's <span className="font-semibold text-blue-200">El Camino de Santiago</span>, Finisterre Gardenz honors the journey of
            life, celebrating every step with dignity and peace.
          </motion.p>
        </motion.div>
        {/* CTA Section */}
        <motion.div className="flex flex-col items-center justify-center gap-4 sm:flex-row" variants={shouldReduceMotion ? undefined : subtleItem}>
          {/* Primary CTA */}
          <motion.div variants={shouldReduceMotion ? undefined : subtleButton} transition={{ delay: shouldReduceMotion ? 0 : 0.16 }}>
            <Button
              size={'lg'}
              variant={'secondary'}
              className="group rounded-full bg-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white/75"
            >
              <Link className="flex items-center gap-3" aria-label="Explore Map" to="/map">
                <MapPin className="text-gray-800" />
                <hr className="h-4 w-px shrink-0 bg-neutral-400" />
                <AnimatedGradientText>Explore Plots</AnimatedGradientText>
                <ArrowRight className="h-4 w-4 text-gray-800 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
          {/* Secondary CTA */}
          <motion.div variants={shouldReduceMotion ? undefined : subtleButton} transition={{ delay: shouldReduceMotion ? 0 : 0.22 }}>
            <Button
              className="group rounded-full border-white/30 bg-white/10 px-6 py-3 font-medium text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/50 hover:bg-white/20"
              variant="outline"
              size="lg"
              asChild
            >
              <Link className="flex items-center gap-2" to="/about">
                <Heart className="h-4 w-4" />
                Our Story
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
