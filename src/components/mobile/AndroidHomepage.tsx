import type { Coordinates } from '@/pages/user/components/types'
import { useCallback, useEffect, useState } from 'react'
import { Fab, Link, Navbar, Page, Tabbar, TabbarLink, ToolbarPane } from 'konsta/react'
import { BotIcon, HomeIcon, LogIn, MapPin, UserIcon } from 'lucide-react'
import { HiNewspaper } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'

import { Sheet, SheetContent } from '@/components/ui/sheet'
import AndroidProfilePage from '@/pages/android/AndroidProfilePage'
import Chatbot from '@/pages/public/chatbot/Chatbot'
import AnnouncementsPage from '@/pages/user/AnnouncementsPage'
import UserDashboard from '@/pages/user/UserDashboard'
import { isAuthenticated } from '@/utils/auth.utils'
import AndroidMapPage from './AndroidMapPage'

export default function AndroidHomepage() {
  const [activeTab, setActiveTab] = useState('home')
  const [showMapPage, setShowMapPage] = useState(false)
  const [showProfilePage, setShowProfilePage] = useState(false)
  const [mapCoordinates, setMapCoordinates] = useState<Coordinates | null>(null)
  const [botSheetOpen, setBotSheetOpen] = useState(false)
  const navigate = useNavigate()

  const getNavbarContent = () => {
    switch (activeTab) {
      case 'home':
        return { title: 'Home', subtitle: 'Finisterre Gardenz' }
      case 'news':
        return { title: 'News & Updates', subtitle: 'Latest Announcements' }
      default:
        return { title: 'Home', subtitle: 'Finisterre Gardenz' }
    }
  }

  const { title, subtitle } = getNavbarContent()

  const handlePlotNavigate = useCallback((coords?: Coordinates | null) => {
    if (!coords) return
    setMapCoordinates(coords)
    setShowMapPage(true)
  }, [])

  const handleBackFromMap = useCallback(() => {
    setShowMapPage(false)
    setMapCoordinates(null)
  }, [])

  const handleOpenMap = useCallback(() => {
    setMapCoordinates(null)
    setShowMapPage(true)
  }, [])

  useEffect(() => {
    if (activeTab === 'bot') {
      setBotSheetOpen(true)
    } else {
      setBotSheetOpen(false)
    }
  }, [activeTab])

  if (showProfilePage) {
    return <AndroidProfilePage onBack={() => setShowProfilePage(false)} />
  }

  if (showMapPage) {
    return <AndroidMapPage onBack={handleBackFromMap} coordinates={mapCoordinates ?? undefined} />
  }

  return (
    <Page>
      <Navbar
        title={title}
        subtitle={subtitle}
        className="sticky top-0"
        transparent={false}
        left={
          <Link>
            <img src="/favicon.svg" className="h-5 w-5" alt="Logo" />
          </Link>
        }
        right={
          <Link
            onClick={() => {
              if (isAuthenticated()) {
                setShowProfilePage(true)
              } else {
                navigate('/login')
              }
            }}
          >
            {isAuthenticated() ? <UserIcon /> : <LogIn />}
          </Link>
        }
      />
      <Tabbar className="fixed bottom-0 left-0">
        <ToolbarPane>
          <TabbarLink active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<HomeIcon className="h-6 w-6" />} label={'Home'} />
          <TabbarLink active={activeTab === 'news'} onClick={() => setActiveTab('news')} icon={<HiNewspaper className="h-6 w-6" />} label={'News'} />
          <TabbarLink active={activeTab === 'bot'} onClick={() => setActiveTab('bot')} icon={<BotIcon className="h-6 w-6" />} label={'Bot'} />
        </ToolbarPane>
      </Tabbar>
      {activeTab === 'home' && (
        <div className="mb-15 space-y-4">
          <UserDashboard onPlotNavigate={handlePlotNavigate} />
        </div>
      )}
      {activeTab === 'news' && (
        <div className="mb-20">
          <AnnouncementsPage />
        </div>
      )}
      {activeTab === 'bot' && (
        <div className="mb-20">
          <Sheet
            open={botSheetOpen}
            onOpenChange={(open) => {
              setBotSheetOpen(open)
              if (!open) setActiveTab('home')
            }}
          >
            <SheetContent className="h-full w-full p-0" showClose={false}>
              <Chatbot />
            </SheetContent>
          </Sheet>
        </div>
      )}
      <div className="flex gap-2">
        <Fab
          className="right-safe-4 ios:bottom-safe-19 material:bottom-safe-18 k-color-brand-red fixed z-20"
          icon={<MapPin className="h-6 w-6" />}
          onClick={handleOpenMap}
        />
      </div>
    </Page>
  )
}
