import { FaFacebookMessenger } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import { PulsatingButton } from '@/components/pulsating-button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { HeaderSection } from '@/pages/landing/section/HeaderSection'
import PublicNewsAnnouncement from '@/pages/landing/section/News&Announcement'
import HeroSection from '@/pages/landing/section/HeroSection'
import FAQs from '@/pages/landing/section/FAQs'
import Showcase from '@/pages/landing/section/Showcase'
import Footer from '@/pages/landing/section/Footer'
import FeatureSection from '@/pages/landing/section/FeatureSection'
import Testimonials from '@/components/mvpblocks/Testimonials'

export default function LandingLayout() {
  return (
    <div className="landing-page-root relative min-h-screen w-full bg-transparent">
      <div className="aurora-background pointer-events-none fixed inset-0 -z-10" aria-hidden="true" />
      <div className="relative z-10">
        <HeaderSection />
        {/* Floating message us button */}
        <div className="group">
          <div className="fixed right-22 bottom-9 z-999">
            <span className="rounded-full bg-white px-4 py-2 text-[var(--brand-primary)] shadow-lg transition-opacity duration-300 group-hover:opacity-0">
              Message Us!
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
                  <PulsatingButton className="h-15 w-15 rounded-full bg-[var(--brand-primary)] shadow-lg">
                    <FaFacebookMessenger className="text-white" />
                  </PulsatingButton>
                </TooltipTrigger>
                <TooltipContent>Facebook Messenger</TooltipContent>
              </Tooltip>
            </Link>
          </div>
        </div>
        <main className="flex-1">
          <HeroSection />
          <FeatureSection />
          <Showcase />
          <Testimonials />
          <PublicNewsAnnouncement />
          <FAQs />
          <Footer />
        </main>
      </div>
    </div>
  )
}
