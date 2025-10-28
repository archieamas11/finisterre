import { Building2, FileText, Heart, Infinity as InfinityIcon, MapPin, Shield, Users } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const coreValues = [
  {
    icon: Heart,
    title: 'Empathy',
    description: 'We act with empathy. We find joy in being there for you. We will do whatever we can to comfort you.',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    icon: Shield,
    title: 'Authenticity',
    description: 'We value authenticity. We do what we say we will do. We treasure what makes each one special.',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    icon: Users,
    title: 'Peace',
    description: 'We nurture peace. We give you peace of mind and of heart. We make you feel at home with us.',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    icon: InfinityIcon,
    title: 'Eternity',
    description: 'We believe in eternity. We honor how memories become legacies. We are pilgrims in our journey through forever.',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: Building2,
    title: 'Commitment',
    description: 'We offer you a lifetime commitment. We are all pilgrims who need each other. We will be there for you, always.',
    gradient: 'from-amber-500 to-orange-600',
  },
]

export default function About() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute top-0 right-0 left-0 z-10 h-32 bg-gradient-to-b from-black/45 to-transparent"></div>
      {/* Core Values Section */}
      <section id="about" aria-labelledby="about-heading">
        <div className="landing-page-wrapper">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-[var(--brand-primary)] sm:text-5xl">Our Core Values</h2>
            <p className="text-lg leading-8 text-gray-800">The principles that guide us in serving you with dedication and compassion</p>
          </div>

          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {coreValues.map((value) => {
              const Icon = value.icon
              return (
                <Card
                  key={value.title}
                  className="group relative flex transform-gpu flex-col overflow-hidden border-white/50 bg-white/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <CardHeader className="relative z-10 pb-4">
                    <div
                      className={cn(
                        'mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-md',
                        value.gradient,
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-bold text-[var(--brand-primary)]">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 flex flex-grow flex-col">
                    <CardDescription className="flex-grow text-gray-600">{value.description}</CardDescription>
                  </CardContent>
                  <div
                    className={cn(
                      'absolute -right-1/4 -bottom-1/4 z-0 h-1/2 w-1/2 rounded-full bg-gradient-to-br opacity-10 transition-all duration-500 group-hover:scale-[2.5]',
                      value.gradient,
                    )}
                  />
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Our Company Section */}
      <section className="py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
            <div className="lg:pr-8">
              <Badge className="mb-6 bg-[var(--brand-secondary)]/10 text-[var(--brand-secondary)]">Our Company</Badge>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-[var(--brand-primary)] sm:text-4xl">
                Exquisitely Designed Memorial Estates
              </h2>
              <div className="space-y-6 text-gray-800">
                <p className="leading-7">
                  The Finisterre brand stands for the most exquisitely designed memorial estates in Cebu. It is master-planned by the world-renowned{' '}
                  <strong className="text-[var(--brand-primary)]">PALAFOX ASSOCIATES</strong> and developed by one of the country's top mining and
                  development company, the <strong className="text-[var(--brand-primary)]">ANSECA Development Corporation</strong>.
                </p>
                <p className="leading-7">
                  The group has extensive experience in earthmoving and engineering, counting some of the country's top mining firms as clients for
                  over 30 years and thriving.
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

      {/* Developer & Permits Section */}
      <section className="py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-[var(--brand-primary)] sm:text-5xl">Trust & Excellence</h2>
            <p className="text-lg leading-8 text-gray-800">Built on a foundation of expertise, integrity, and proper certification</p>
          </div>

          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {/* About The Developer */}
            <Card className="group border-white/50 bg-white/50 transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
                  <Building2 className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl font-bold text-[var(--brand-primary)]">About The Developer</CardTitle>
                <CardDescription className="text-base">ANSECA Development Corporation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="leading-7 text-gray-800">
                  One of the country's leading mining and development companies with over 30 years of experience in earthmoving and engineering.
                  ANSECA brings unparalleled expertise in creating world-class memorial estates.
                </p>
              </CardContent>
            </Card>

            {/* Permits */}
            <Card className="group border-white/50 bg-white/50 transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md">
                  <FileText className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl font-bold text-[var(--brand-primary)]">Legal Permits & Certifications</CardTitle>
                <CardDescription className="text-base">Fully licensed and certified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 transition-colors duration-200 hover:bg-slate-100/50">
                  <p className="mb-1 text-sm font-medium text-gray-600">DHSUD License</p>
                  <p className="font-semibold text-[var(--brand-primary)]">LTS NO. 034495</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 transition-colors duration-200 hover:bg-slate-100/50">
                  <p className="mb-1 text-sm font-medium text-gray-600">Certificate of Registration</p>
                  <p className="font-semibold text-[var(--brand-primary)]">COR NO. 029922</p>
                  <p className="mt-1 text-sm text-gray-600">Issued: July 3, 2019</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
