'use client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Marquee } from '@/components/ui/marquee';

export function Highlight({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'bg-accent-background p-1 py-0.5 font-bold text-accent-foreground',
        className,
      )}
    >
      {children}
    </span>
  );
}

export interface TestimonialCardProps {
  name: string;
  role: string;
  img?: string;
  description: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export function TestimonialCard({
  description,
  name,
  img,
  role,
  className,
  ...props
}: TestimonialCardProps) {
  return (
    <div
      className={cn(
        'mb-4 flex w-full cursor-pointer break-inside-avoid flex-col items-center justify-between gap-6 rounded-xl p-4',
        // theme styles
        'border-border bg-card/50 border shadow-sm',
        // hover effect
        'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md',
        className,
      )}
      {...props}
    >
      <div className="text-muted-foreground text-sm font-normal select-none">
        {description}
        <div className="flex flex-row py-1">
          <Star className="size-4 fill-accent-foreground text-accent-background" />
          <Star className="size-4 fill-accent-foreground text-accent-background" />
          <Star className="size-4 fill-accent-foreground text-accent-background" />
          <Star className="size-4 fill-accent-foreground text-accent-background" />
          <Star className="size-4 fill-accent-foreground text-accent-background" />
        </div>
      </div>
      <div className="flex w-full items-center justify-start gap-5 select-none">
        <img
          width={40}
          height={40}
          src={img || ''}
          alt={name}
          className="size-10 rounded-full ring-1 ring-green-600/20 ring-offset-2"
        />
        <div>
          <p className="text-foreground font-medium">{name}</p>
          <p className="text-muted-foreground text-xs font-normal">{role}</p>
        </div>
      </div>
    </div>
  );
}

const testimonials = [
  {
    name: 'Margaret Wilson',
    role: 'Family Member for 3 Generations',
    img: 'https://randomuser.me/api/portraits/women/65.jpg',
    description: (
      <p>
        Our family has trusted this memorial park for over fifty years.
        <Highlight>
          The lifetime memorial rights gave us peace of mind that our legacy would be preserved.
        </Highlight>{' '}
        The grounds are always immaculate and filled with serene beauty.
      </p>
    ),
  },
  {
    name: 'Robert Chen',
    role: 'Funeral Director',
    img: 'https://randomuser.me/api/portraits/men/41.jpg',
    description: (
      <p>
        I've worked with many cemeteries in my career, but this one stands apart.
        <Highlight>
          Their complete burial services and modern facilities make every arrangement dignified and seamless.
        </Highlight>{' '}
        Families always express gratitude for recommending them.
      </p>
    ),
  },
  {
    name: 'Elizabeth Thompson',
    role: 'Community Historian',
    img: 'https://randomuser.me/api/portraits/women/72.jpg',
    description: (
      <p>
        The digital map feature has transformed how our community connects with its history.
        <Highlight>
          Finding relatives and learning about local heritage has never been easier.
        </Highlight>{' '}
        It's wonderful to see technology used in such a meaningful way.
      </p>
    ),
  },
  {
    name: 'James Mitchell',
    role: 'Veterans Association President',
    img: 'https://randomuser.me/api/portraits/men/58.jpg',
    description: (
      <p>
        The memorial sections for veterans are truly exceptional.
        <Highlight>
          The respect and honor shown to those who served is evident in every detail.
        </Highlight>{' '}
        Our members feel proud knowing this is their final resting place.
      </p>
    ),
  },
  {
    name: 'Susan Garcia',
    role: 'Garden Club Member',
    img: 'https://randomuser.me/api/portraits/women/36.jpg',
    description: (
      <p>
        As someone who appreciates horticulture, I'm continually impressed by the grounds.
        <Highlight>
          The serene gardens are thoughtfully designed and maintained with exceptional care.
        </Highlight>{' '}
        It's a place of both remembrance and natural beauty.
      </p>
    ),
  },
  {
    name: 'David Peterson',
    role: 'Estate Planning Attorney',
    img: 'https://randomuser.me/api/portraits/men/63.jpg',
    description: (
      <p>
        I often recommend this memorial park to clients planning their estates.
        <Highlight>
          The growing value of the property makes it a sound investment for future generations.
        </Highlight>{' '}
        It's rare to find such a combination of financial and emotional value.
      </p>
    ),
  },
  {
    name: 'Helen Wright',
    role: 'Widow of 5 Years',
    img: 'https://randomuser.me/api/portraits/women/81.jpg',
    description: (
      <p>
        Losing my husband was difficult, but the staff here provided incredible support.
        <Highlight>
          Their compassion and professionalism helped our family through our darkest time.
        </Highlight>{' '}
        I find comfort visiting such a peaceful and well-maintained place.
      </p>
    ),
  },
  {
    name: 'Michael O\'Connor',
    role: 'Local Business Owner',
    img: 'https://randomuser.me/api/portraits/men/47.jpg',
    description: (
      <p>
        Our family business has been in the community for four generations.
        <Highlight>
          Having a premier burial ground of this caliber adds tremendous value to our town.
        </Highlight>{' '}
        It's a source of pride for everyone who lives here.
      </p>
    ),
  },
  {
    name: 'Rebecca Johnson',
    role: 'Grief Counselor',
    img: 'https://randomuser.me/api/portraits/women/54.jpg',
    description: (
      <p>
        I often suggest clients visit the memorial gardens as part of their healing journey.
        <Highlight>
          The tranquil environment provides a sacred space for reflection and remembrance.
        </Highlight>{' '}
        It's truly designed with the needs of grieving families in mind.
      </p>
    ),
  },
  {
    name: 'Thomas Anderson',
    role: 'Retired Teacher',
    img: 'https://randomuser.me/api/portraits/men/69.jpg',
    description: (
      <p>
        After teaching in this community for 35 years, I wanted a place where former students could visit.
        <Highlight>
          The memorial park's sense of permanence and dignity was exactly what I hoped for.
        </Highlight>{' '}
        It's comforting to know I'll be part of this beautiful landscape.
      </p>
    ),
  },
];

export default function Testimonials() {
  return (
    <section className="relative container py-10">
      {/* Decorative elements */}
      <div className="absolute top-20 -left-20 z-10 h-64 w-64 rounded-full bg-green-600/5 blur-3xl" />
      <div className="absolute -right-20 bottom-20 z-10 h-64 w-64 rounded-full bg-green-600/5 blur-3xl" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-foreground mb-4 text-center text-4xl leading-[1.2] font-bold tracking-tighter md:text-5xl">
          What Families Are Saying
        </h2>
        <h3 className="text-muted-foreground mx-auto mb-8 max-w-lg text-center text-lg font-medium tracking-tight text-balance">
          Don&apos;t just take our word for it. Here&apos;s what{' '}
          <span className="bg-gradient-to-r from-accent-foreground to-accent bg-clip-text text-transparent">
            families in our community
          </span>{' '}
          are saying about{' '}
          <span className="font-semibold text-accent-foreground">our memorial park</span>
        </h3>
      </motion.div>
      <div className="relative mt-6 max-h-screen overflow-hidden">
        <div className="gap-4 md:columns-2 xl:columns-3 2xl:columns-4">
          {Array(Math.ceil(testimonials.length / 3))
            .fill(0)
            .map((_, i) => (
              <Marquee
                vertical
                key={i}
                className={cn({
                  '[--duration:60s]': i === 1,
                  '[--duration:30s]': i === 2,
                  '[--duration:70s]': i === 3,
                })}
              >
                {testimonials.slice(i * 3, (i + 1) * 3).map((card, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: Math.random() * 0.8,
                      duration: 1.2,
                    }}
                  >
                    <TestimonialCard {...card} />
                  </motion.div>
                ))}
              </Marquee>
            ))}
        </div>
        <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 w-full bg-gradient-to-t from-20%"></div>
        <div className="from-background pointer-events-none absolute inset-x-0 top-0 h-1/4 w-full bg-gradient-to-b from-20%"></div>
      </div>
    </section>
  );
}