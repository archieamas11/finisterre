import {
  ShieldCheck,
  TrendingUp,
  Medal,
  Wrench,
  MapIcon,
  Leaf,
  ArrowRight
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
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
    description:
      "Secure your family's legacy for generations with perpetual ownership.",
    color: 'from-blue-500 to-indigo-600'
  },
  {
    icon: TrendingUp,
    title: 'Growing Value',
    description:
      'A valuable real estate investment that appreciates over time.',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    icon: Medal,
    title: 'Premier Grounds',
    description:
      'Experience world-class spaces designed for dignity and comfort.',
    color: 'from-amber-500 to-orange-600'
  },
  {
    icon: Wrench,
    title: 'Complete Services',
    description:
      'Access to modern equipment and expert care for all memorial needs.',
    color: 'from-rose-500 to-pink-600'
  },
  {
    icon: MapIcon,
    title: 'Digital Mapping',
    description:
      'Easily locate memorials and navigate the park with our online system.',
    color: 'from-violet-500 to-purple-600'
  },
  {
    icon: Leaf,
    title: 'Serene Gardens',
    description:
      'Find peace in beautifully maintained gardens and tranquil spaces.',
    color: 'from-lime-500 to-green-600'
  }
]

const FeatureCard = ({ feature }: { feature: Feature }) => {
  const Icon = feature.icon

  return (
    <Card className='group border-white/50 bg-white/50 relative flex transform-gpu flex-col overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl'>
      <CardHeader className='relative z-10 pb-4'>
        <div
          className={cn(
            'mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-md',
            feature.color
          )}
        >
          <Icon className='h-6 w-6' />
        </div>
        <CardTitle className='text-black text-xl font-bold'>
          {feature.title}
        </CardTitle>
      </CardHeader>

      <CardContent className='relative z-10 flex flex-grow flex-col'>
        <CardDescription className='text-gray-600 mb-6 flex-grow'>
          {feature.description}
        </CardDescription>

        <a
          href='#'
          className='text-gray-500 inline-flex items-center font-medium transition-all duration-300'
        >
          Learn more{' '}
          <ArrowRight className='text-gray-500 ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
        </a>
      </CardContent>
      <div
        className={cn(
          'absolute -right-1/4 -bottom-1/4 z-0 h-1/2 w-1/2 rounded-full opacity-10 transition-all duration-500 group-hover:scale-[2.5]',
          feature.color
        )}
      />
    </Card>
  )
}

const FeatureSection = () => {
  return (
    <section className='py-24 sm:py-32'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-3xl text-center'>
          <Badge
            variant='outline'
            className='border-black text-black mb-4 rounded-full px-4 py-1.5 text-sm font-medium'
          >
            Our Promise
          </Badge>
          <h2 className='text-black text-4xl font-bold tracking-tight sm:text-5xl'>
            Why Choose Finisterre
          </h2>
          <p className='text-black mx-auto mt-6 max-w-2xl text-lg leading-8'>
            A sacred place inspired by El Camino de Santiago, providing peace,
            dignity, and beauty for generations to come.
          </p>
        </div>

        <div className='mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3'>
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeatureSection
