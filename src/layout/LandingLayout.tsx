import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { PulsatingButton } from '@/components/pulsating-button'
import { HeaderSection } from '@/pages/landing/section/HeaderSection'
// import PublicNewsAnnouncement from '@/pages/landing/section/News&Announcement'
import HeroSection from '@/pages/landing/section/HeroSection'
import FAQs from '@/pages/landing/section/FAQs'
import Showcase from '@/pages/landing/section/showcase'
import Footer from '@/pages/landing/section/Footer'
import FeatureSection from '@/pages/landing/section/FeatureSection'
import Testimonials from '@/pages/landing/section/Testimonials'
import ContactUs from '@/pages/landing/section/ContactUs'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Chatbot from '@/pages/landing/section/chatbot/Chatbot'
import { BotIcon } from 'lucide-react'
import OurProducts from '@/pages/landing/section/OurProducts'

function LandingHome() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <OurProducts />
      <Showcase />
      <Testimonials />
      {/* <PublicNewsAnnouncement /> */}
      <ContactUs />
      <FAQs />
    </>
  )
}

export default function LandingLayout() {
  const location = useLocation()
  const isNestedRoute = location.pathname !== '/'

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      const element = document.getElementById(id)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    } else {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
    }
  }, [location])

  return (
    <div className="landing-page-root relative min-h-screen w-full bg-transparent">
      <div className="aurora-background pointer-events-none fixed inset-0 -z-10" aria-hidden="true" />
      <div className="relative z-10">
        <HeaderSection />
        <div className="group z-999">
          <div className="fixed right-22 bottom-8 z-999">
            <span className="rounded-full bg-white px-4 py-2 text-[var(--brand-primary)] shadow-lg transition-opacity duration-300 group-hover:opacity-0">
              Chat with Finisbot!
            </span>
          </div>
          <div className="fixed right-4 bottom-4 z-999">
            <Sheet>
              <SheetTrigger asChild>
                <PulsatingButton className="h-15 w-15 rounded-full bg-[var(--brand-primary)] shadow-lg">
                  <BotIcon className="text-white" />
                </PulsatingButton>
              </SheetTrigger>
              <SheetContent forceMount showClose={false} className="rounded-none border-none">
                <Chatbot />
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <main className="flex-1">
          {isNestedRoute ? <Outlet /> : <LandingHome />}
          <Footer />
        </main>
      </div>
    </div>
  )
}

export { LandingHome }
