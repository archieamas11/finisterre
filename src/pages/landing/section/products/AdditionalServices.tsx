import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Phone } from 'lucide-react'
export function AdditionalServices() {
  return (
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
      </div>
    </div>
  )
}
