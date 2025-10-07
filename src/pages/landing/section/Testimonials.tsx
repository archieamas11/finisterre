'use client'
import { Star } from 'lucide-react'
import { memo } from 'react'

import { Marquee } from '@/components/ui/marquee'
import { cn } from '@/lib/utils'

export function Highlight({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn('rounded-md bg-[var(--brand-primary)] px-1.5 py-0.5 font-semibold text-gray-100', className)}>{children}</span>
}

const stars = [...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)

export interface TestimonialCardProps {
  name: string
  role: string
  img?: string
  description: React.ReactNode
  className?: string
  [key: string]: unknown
}

export function TestimonialCard({ description, name, img, role, className, ...props }: TestimonialCardProps) {
  return (
    <figure
      className={cn(
        'relative h-full w-full transform-gpu cursor-pointer break-inside-avoid-page overflow-hidden rounded-xl border bg-white p-6 text-black shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
        className,
      )}
      {...props}
    >
      <div className="flex flex-row items-center gap-x-4">
        <img width={48} height={48} src={img || ''} alt={name} className="size-12 rounded-full object-cover ring-1 ring-black" />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-black">{name}</figcaption>
          <p className="text-xs text-gray-600">{role}</p>
        </div>
      </div>
      <blockquote className="mt-4 text-base text-gray-700">{description}</blockquote>
      <div className="mt-4 flex items-center gap-1">{stars}</div>
    </figure>
  )
}

const MemoizedTestimonialCard = memo(TestimonialCard)

const testimonials = [
  {
    name: 'Maria Santos',
    role: 'Family Member for 3 Generations',
    img: 'https://randomuser.me/api/portraits/women/65.jpg',
    description: (
      <p>
        Our family has trusted this memorial park for over fifty years. <Highlight>The lifetime memorial rights</Highlight> gave us peace of mind that
        our legacy would be preserved. The grounds are always immaculate and filled with serene beauty.
      </p>
    ),
  },
  {
    name: 'Juan Dela Cruz',
    role: 'Funeral Director',
    img: 'https://randomuser.me/api/portraits/men/41.jpg',
    description: (
      <p>
        I've worked with many cemeteries, but this one stands apart. <Highlight>Their complete burial services</Highlight> and modern facilities make
        every arrangement dignified and seamless. Families always express gratitude.
      </p>
    ),
  },
  {
    name: 'Luz Navarro',
    role: 'Community Historian',
    img: 'https://randomuser.me/api/portraits/women/72.jpg',
    description: (
      <p>
        The <Highlight>digital map feature</Highlight> has transformed how our community connects with its history. Finding relatives and learning
        about local heritage has never been easier. It's wonderful to see technology used so meaningfully.
      </p>
    ),
  },
  {
    name: 'Jose Rizal',
    role: 'Veterans Association President',
    img: 'https://randomuser.me/api/portraits/men/58.jpg',
    description: (
      <p>
        The memorial sections for veterans are truly exceptional. <Highlight>The respect and honor shown</Highlight> to those who served is evident in
        every detail. Our members feel proud knowing this is their final resting place.
      </p>
    ),
  },
  {
    name: 'Carmen Reyes',
    role: 'Garden Club Member',
    img: 'https://randomuser.me/api/portraits/women/36.jpg',
    description: (
      <p>
        As someone who appreciates horticulture, I'm continually impressed by the grounds. <Highlight>The serene gardens</Highlight> are thoughtfully
        designed and maintained with exceptional care. It's a place of remembrance and beauty.
      </p>
    ),
  },
  {
    name: 'Antonio Luna',
    role: 'Estate Planning Attorney',
    img: 'https://randomuser.me/api/portraits/men/63.jpg',
    description: (
      <p>
        I often recommend this memorial park to clients. <Highlight>The growing value of the property</Highlight> makes it a sound investment for
        future generations. It's rare to find such a combination of financial and emotional value.
      </p>
    ),
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" aria-labelledby="testimonials-heading">
      <div className="mx-auto w-full sm:w-[85%] md:w-[80%] lg:w-[75%] xl:w-full">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-[var(--brand-primary)] sm:text-5xl">What Families Are Saying</h2>
          <p className="mt-6 text-lg leading-8 text-gray-800">
            Don't just take our word for it. Here's what families in our community are saying about our memorial park.
          </p>
        </div>
        <div className="relative mt-16">
          <div className="[mask-image:linear-gradient(to_right,transparent,black_0%,black_80%,transparent)]">
            <div className="[mask-image:linear-gradient(to_left,transparent,black_0%,black_80%,transparent)]">
              <Marquee pauseOnHover className="[--duration:60s]">
                {testimonials.map((testimonial) => (
                  <MemoizedTestimonialCard key={testimonial.name} {...testimonial} className="w-80 bg-white/50" />
                ))}
              </Marquee>
              <Marquee reverse pauseOnHover className="[--duration:60s]">
                {testimonials.map((testimonial) => (
                  <MemoizedTestimonialCard key={testimonial.name} {...testimonial} className="w-80 bg-white/50" />
                ))}
              </Marquee>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
