import { ArrowRight, Sparkles, MapPin, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text'
import { RainbowButton } from '@/components/magicui/rainbow-button'
import { Button } from '@/components/ui/button'

export default function HeroSection() {
  return (
    <section className='relative flex min-h-screen items-center justify-center overflow-hidden'>
      <div className='absolute inset-0 z-0'>
        <img
          className='min-h-full min-w-full object-cover'
          src='/hero-bg.webp'
          alt='Background'
          width={1920}
          height={1280}
          loading='eager'
          fetchPriority='high'
          decoding='async'
        />
        <div className='absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent' />
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20' />
      </div>

      {/* Main Content Container */}
      <div className='relative z-10 mx-auto w-full max-w-7xl px-6 text-center sm:px-8'>
        {/* Premium badge */}
        <div className='animate-fade-in-up mb-6 flex justify-center'>
          <div className='inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md'>
            <Sparkles className='h-4 w-4 text-yellow-300' />A Sacred Journey
            Awaits
          </div>
        </div>

        {/* Main heading with modern typography */}
        <div className='mb-10 space-y-4'>
          <h1 className='text-4xl leading-tight font-bold text-white sm:text-6xl lg:text-7xl'>
            <span className='block bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent drop-shadow-lg'>
              Not Your Usual
            </span>
            <span className='mt-2 block bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text font-extrabold text-transparent'>
              Memorial Park
            </span>
          </h1>

          <p className='mx-auto max-w-3xl text-lg leading-relaxed font-light text-white/80 sm:text-xl'>
            Inspired by Spain's{' '}
            <span className='font-semibold text-blue-200'>
              El Camino de Santiago
            </span>
            , Finisterre Gardenz celebrates the pilgrimage of a life lived to
            the fullest.
          </p>
        </div>

        {/* CTA Section */}
        <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
          {/* Primary CTA */}
          <RainbowButton size={'lg'} className='rounded-full font-semibold'>
            <Link
              className='flex items-center gap-3'
              aria-label='Explore Map'
              to='/map'
            >
              <MapPin />
              <hr className='h-4 w-px shrink-0 bg-neutral-400' />
              <AnimatedGradientText>Explore Plots</AnimatedGradientText>
              <ArrowRight className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
            </Link>
          </RainbowButton>

          {/* Secondary CTA */}
          <Button
            className='group rounded-full border-white/30 bg-white/10 px-6 py-3 font-medium text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/50 hover:bg-white/20'
            variant='outline'
            size='lg'
            asChild
          >
            <Link className='flex items-center gap-2' to='/about'>
              <Heart className='h-4 w-4' />
              Our Story
            </Link>
          </Button>
        </div>
      </div>

      {/* Bottom fade to smoothly transition to next section */}
      {/* <div className='from-background absolute right-0 bottom-0 left-0 z-[5] h-32 bg-gradient-to-t to-transparent'></div> */}
      <div className='relative mt-16 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]'></div>
    </section>
  )
}
