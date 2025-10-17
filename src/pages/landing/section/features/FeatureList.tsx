import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Feature } from './types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function FeatureList({ feature, index }: { feature: Feature; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: { delay: index * 0.05, duration: 0.3, ease: 'easeOut' },
      }}
      viewport={{ once: true, amount: 0.5 }}
      className={cn(
        'group relative flex transform-gpu flex-col overflow-hidden p-2',
        feature.image
          ? 'rounded-3xl border border-[var(--brand-primary)]/20 bg-white/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-[var(--brand-primary)]/20'
          : '',
      )}
    >
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/[0.03] to-transparent" />
      <div className="z-10">
        {feature.image && (
          <img
            src={feature.image}
            alt={feature.title}
            className="h-[180px] w-full rounded-[18px] object-cover shadow-lg sm:h-[200px] lg:h-[240px]"
            loading="lazy"
          />
        )}
        <div className={cn('group', feature.image ? 'p-4' : '')}>
          <h3
            className={cn(
              'text-lg font-semibold sm:text-xl',
              feature.image ? 'mt-5 text-xl text-[var(--brand-primary)] sm:text-2xl' : 'text-[var(--brand-primary)]',
            )}
          >
            {feature.title}
          </h3>
          <p className={cn('mt-2 text-sm sm:text-base', feature.image ? 'text-base text-neutral-600 sm:text-lg' : 'text-neutral-500')}>
            {feature.description}
          </p>
          {feature.image && feature.href && (
            <div className="mt-3 sm:mt-4">
              <Link to={feature.href}>
                <Button className="bg-[var(--brand-primary)] text-sm sm:text-base">
                  <span className="text-white">Learn more</span>
                  <ArrowRight className="h-4 w-4 text-white" aria-hidden />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </motion.div>
  )
}
