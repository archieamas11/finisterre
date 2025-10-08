import { ShieldCheck, TrendingUp, Medal, Wrench, MapIcon, Leaf } from 'lucide-react'
import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

interface Feature {
  icon: React.ElementType
  title: string
  description: string
  color: string
}

const features: Feature[] = [
  {
    icon: ShieldCheck,
    title: 'Lifetime Memorial Rights',
    description: "Secure your family's legacy for generations with perpetual ownership.",
    color: 'from-blue-500 to-indigo-600',
  },
  {
    icon: TrendingUp,
    title: 'Growing Value',
    description: 'A valuable real estate investment that appreciates over time.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Medal,
    title: 'Premier Grounds',
    description: 'Experience world-class spaces designed for dignity and comfort.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: Wrench,
    title: 'Complete Services',
    description: 'Access to modern equipment and expert care for all memorial needs.',
    color: 'from-rose-500 to-pink-600',
  },
  {
    icon: MapIcon,
    title: 'Digital Mapping',
    description: 'Easily locate memorials and navigate the park with our online system.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: Leaf,
    title: 'Serene Gardens',
    description: 'Find peace in beautifully maintained gardens and tranquil spaces.',
    color: 'from-lime-500 to-green-600',
  },
]

const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
  const Icon = feature.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: { delay: index * 0.05, duration: 0.3, ease: 'easeOut' },
      }}
      viewport={{ once: true, amount: 0.5 }}
      className="group relative flex transform-gpu flex-col overflow-hidden rounded-2xl bg-white/40 p-6 backdrop-blur-md transition-all duration-300"
    >
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/[0.03] to-transparent" />
      <div className="relative z-10">
        <div className={cn('mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-md', feature.color)}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--brand-primary)]">{feature.title}</h3>
        <p className="mt-2 text-sm text-neutral-500">{feature.description}</p>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div
        className={cn(
          'absolute -right-1/4 -bottom-1/4 z-0 h-1/2 w-1/2 rounded-full bg-gradient-to-br opacity-10 transition-all duration-500 group-hover:scale-[2.5]',
          feature.color,
        )}
      />
    </motion.div>
  )
}

const FeatureSection = () => {
  return (
    <section id="features" aria-labelledby="features-heading" className="mt-20">
      <div className="landing-page-wrapper">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="landing-title">Why Choose Finisterre</h2>
          <p className="landing-subtitle">
            A sacred place inspired by El Camino de Santiago, providing peace, dignity, and beauty for generations to come.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-4 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeatureSection
