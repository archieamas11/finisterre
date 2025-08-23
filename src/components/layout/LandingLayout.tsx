'use client'
import { Suspense, lazy, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { HeaderSection } from '@/pages/landing/section/HeaderSection'
import Spinner from '@/components/ui/spinner'

const HeroSection = lazy(() => import('@/pages/landing/section/HeroSection'))
const FAQs = lazy(() => import('@/pages/landing/section/FAQs'))
const Showcase = lazy(() => import('@/pages/landing/section/Showcase'))
const Footer = lazy(() => import('@/pages/landing/section/Footer'))
const FeatureSection = lazy(
  () => import('@/components/mvpblocks/FeatureSection')
)
const Testimonials = lazy(() => import('@/components/mvpblocks/Testimonials'))

const sections = [
  HeroSection,
  FeatureSection,
  Showcase,
  Testimonials,
  FAQs,
  Footer
]

export default function LandingLayout() {
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: sections.length,
    // guard access to document for environments where it may be undefined
    getScrollElement: () =>
      typeof document !== 'undefined' ? document.documentElement : null,
    estimateSize: () => 800, // Estimate height for each section
    overscan: 1
  })

  return (
    <div ref={parentRef} className='min-h-screen w-full relative'>
      {/* Aurora Dream Corner Whispers - decorative background (non-interactive, behind content) */}
      <div
        className='fixed inset-0 -z-10 pointer-events-none'
        aria-hidden='true'
        style={{
          background: `
        radial-gradient(ellipse 85% 65% at 8% 8%, rgba(175, 109, 255, 0.42), transparent 60%),
            radial-gradient(ellipse 75% 60% at 75% 35%, rgba(255, 235, 170, 0.55), transparent 62%),
            radial-gradient(ellipse 70% 60% at 15% 80%, rgba(255, 100, 180, 0.40), transparent 62%),
            radial-gradient(ellipse 70% 60% at 92% 92%, rgba(120, 190, 255, 0.45), transparent 62%),
            linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
      `
        }}
      />

      {/* Stack content above decorative layer */}
      <div className='relative z-10'>
        <HeaderSection />
        <main
          className='flex-1'
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative'
          }}
        >
          <Suspense
            fallback={
              <div className='flex h-screen w-full items-center justify-center'>
                <Spinner className='text-black' />
              </div>
            }
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const Section = sections[virtualItem.index]
              return (
                <div
                  key={virtualItem.key}
                  ref={rowVirtualizer.measureElement}
                  data-index={virtualItem.index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualItem.start}px)`
                  }}
                >
                  <Section />
                </div>
              )
            })}
          </Suspense>
        </main>
      </div>
    </div>
  )
}
