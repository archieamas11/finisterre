import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { coreValues } from './constants'

export default function CoreValuesSection() {
  return (
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
  )
}
