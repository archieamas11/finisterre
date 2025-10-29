import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import FloatingChatWidget from '@/components/FloatingChatWidget'
import ContactUs from '@/pages/public/ContactUs'
import FAQs from '@/pages/public/FAQs'
import FeatureSection from '@/pages/public/features'
import Footer from '@/pages/public/Footer'
import { HeaderSection } from '@/pages/public/HeaderSection'
// import PublicNewsAnnouncement from '@/pages/landing/section/News&Announcement'
import HeroSection from '@/pages/public/HeroSection'
import Products from '@/pages/public/products'
import Showcase from '@/pages/public/showcase'
import Testimonials from '@/pages/public/Testimonials'

function LandingHome() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <Products />
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
        <FloatingChatWidget />
        <main className="flex-1">
          {isNestedRoute ? <Outlet /> : <LandingHome />}
          <Footer />
        </main>
      </div>
    </div>
  )
}

export { LandingHome }
