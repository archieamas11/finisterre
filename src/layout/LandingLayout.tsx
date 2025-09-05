import { Suspense, lazy } from 'react'

import Spinner from '@/components/ui/spinner'
import { HeaderSection } from '@/pages/landing/section/HeaderSection'

const HeroSection = lazy(() => import('@/pages/landing/section/HeroSection'))
const FAQs = lazy(() => import('@/pages/landing/section/FAQs'))
const Showcase = lazy(() => import('@/pages/landing/section/Showcase'))
const Footer = lazy(() => import('@/pages/landing/section/Footer'))
const FeatureSection = lazy(() => import('@/components/mvpblocks/FeatureSection'))
const Testimonials = lazy(() => import('@/components/mvpblocks/Testimonials'))

export default function LandingLayout() {
  return (
    <div className="landing-page-root relative min-h-screen w-full bg-transparent">
      {/* Aurora Dream Corner Whispers - decorative background (non-interactive, behind content) */}
      <div className="aurora-background pointer-events-none fixed inset-0 -z-10" aria-hidden="true" />
      {/* Stack content above decorative layer */}
      <div className="relative z-10">
        <HeaderSection />
        <main className="flex-1">
          <Suspense
            fallback={
              <div className="flex h-screen w-full items-center justify-center">
                <Spinner className="text-black" />
              </div>
            }
          >
            <HeroSection />
            <FeatureSection />
            <Showcase />
            <Testimonials />
            <FAQs />
            <Footer />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
