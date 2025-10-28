import { Building2, Heart, InfinityIcon, Shield, Users } from 'lucide-react'

import { type AboutValue } from './types'

export const coreValues: AboutValue[] = [
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
