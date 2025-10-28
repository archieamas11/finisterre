import { MapPin } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function OurCompanySection() {
  return (
    <section className="py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          <div className="lg:pr-8">
            <Badge className="mb-6 bg-[var(--brand-secondary)]/10 text-[var(--brand-secondary)]">Our Company</Badge>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-[var(--brand-primary)] sm:text-4xl">Exquisitely Designed Memorial Estates</h2>
            <div className="space-y-6 text-gray-800">
              <p className="leading-7">
                The Finisterre brand stands for the most exquisitely designed memorial estates in Cebu. It is master-planned by the world-renowned{' '}
                <strong className="text-[var(--brand-primary)]">PALAFOX ASSOCIATES</strong> and developed by one of the country's top mining and
                development company, the <strong className="text-[var(--brand-primary)]">ANSECA Development Corporation</strong>.
              </p>
              <p className="leading-7">
                The group has extensive experience in earthmoving and engineering, counting some of the country's top mining firms as clients for over
                30 years and thriving.
              </p>
            </div>
          </div>

          <Card className="group border-white/50 bg-white/50 transition-all duration-300 hover:shadow-xl lg:mt-8">
            <CardHeader>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
                <MapPin className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-bold text-[var(--brand-primary)]">Brand Inspiration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-7 text-gray-800">
                Inspired by the <strong className="text-[var(--brand-primary)]">Camino del Santiago de Compostela</strong>, one of the most
                significant pilgrimage routes in the Christian world in medieval times, Finisterre invites one to embark on a journey to a spiritual
                encounter with the divine, as in the Christian pilgrimages of old.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
