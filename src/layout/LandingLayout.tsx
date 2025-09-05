import { Suspense, lazy } from 'react'
import { FaFacebookMessenger } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import { PulsatingButton } from '@/components/pulsating-button'
import Spinner from '@/components/ui/spinner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
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

        {/* Floating message us button */}
        <div className="group">
          <div className="fixed right-22 bottom-9 z-999">
            <span className="rounded-full bg-white px-4 py-2 text-black/80 shadow-lg transition-opacity duration-300 group-hover:opacity-0">
              Message us
            </span>
          </div>
          <div className="fixed right-4 bottom-4 z-999">
            <Link
              to="https://www.facebook.com/finisterregardenz/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact us on Facebook Messenger"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <PulsatingButton className="bg-ring h-15 w-15 rounded-full shadow-lg">
                    <FaFacebookMessenger className="text-white" />
                  </PulsatingButton>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Message us in Facebook Messenger</p>
                </TooltipContent>
              </Tooltip>
            </Link>
          </div>
        </div>
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
