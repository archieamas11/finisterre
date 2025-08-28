import { App, Block, KonstaProvider, Navbar, Page, Tabbar, TabbarLink, Preloader } from 'konsta/react'
import { Home, Map, ArrowLeft, MapPin, User, Search, Settings, Bell } from 'lucide-react'
import React, { useEffect, useState } from 'react'

// Lazy load components
const UserDashboard = React.lazy(() => import('@/pages/user/UserDashboard'))
const WebMapLayout = React.lazy(() => import('@/layout/WebMapLayout'))

export default function AndroidLandingPage() {
  const [activeTab, setActiveTab] = useState<'home' | 'map'>('home')

  // Navigation action handlers
  const handleSearch = () => {
    console.log('Opening search...')
    // TODO: Implement search functionality
  }

  const handleNotifications = () => {
    console.log('Opening notifications...')
    // TODO: Implement notifications
  }

  const handleProfile = () => {
    console.log('Opening profile...')
    // TODO: Implement profile navigation
  }

  const handleSettings = () => {
    console.log('Opening settings...')
    // TODO: Implement settings
  }

  const handleBack = () => {
    if (activeTab === 'map') {
      setActiveTab('home')
    } else {
      window.history.back()
    }
  }

  // Enhanced navigation handlers for Android back button support
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Prevent default browser back behavior
      event.preventDefault()

      // If we're on map tab, go back to home
      if (activeTab === 'map') {
        setActiveTab('home')
        // Push a new state to maintain history
        window.history.pushState(null, '', window.location.pathname)
      } else {
        // If we're on home tab, allow normal back navigation
        window.history.back()
      }
    }

    // Push initial state
    window.history.pushState(null, '', window.location.pathname)
    window.addEventListener('popstate', handlePopState)

    return () => window.removeEventListener('popstate', handlePopState)
  }, [activeTab])

  const spinner = (
    <div className="flex h-full w-full items-center justify-center p-6" role="status" aria-live="polite">
      <Preloader />
    </div>
  )

  return (
    <KonstaProvider theme="material" dark={false}>
      <App theme="material">
        {/* Home tab */}
        {activeTab === 'home' && (
          <Page className="no-scrollbar pb-16">
            <Navbar
              right={
                <div className="bg-background relative top-0 mx-auto flex h-20 w-120 flex-row gap-1 border-2">
                  <button
                    className="relative inline-flex items-center justify-center rounded-full p-2 transition-colors hover:bg-black/10 focus:bg-black/10 focus:ring-2 focus:ring-blue-500 focus:outline-none active:bg-black/20"
                    aria-label="Search"
                    onClick={handleSearch}
                  >
                    <Search size={20} />
                  </button>
                  <button
                    className="relative inline-flex items-center justify-center rounded-full p-2 transition-colors hover:bg-black/10 focus:bg-black/10 focus:ring-2 focus:ring-blue-500 focus:outline-none active:bg-black/20"
                    aria-label="Notifications"
                    onClick={handleNotifications}
                  >
                    <Bell size={20} />
                  </button>
                  <button
                    className="inline-flex items-center justify-center rounded-full p-2 transition-colors hover:bg-black/10 focus:bg-black/10 focus:ring-2 focus:ring-blue-500 focus:outline-none active:bg-black/20"
                    aria-label="Profile"
                    onClick={handleProfile}
                  >
                    <User size={20} />
                  </button>
                </div>
              }
            />

            <Block strong className="p-4">
              <div className="mb-4">
                <h1 className="text-xl font-semibold">Welcome to Finisterre</h1>
                <p className="text-sm text-gray-600">Your memorial park companion</p>
              </div>

              <React.Suspense fallback={spinner}>
                <UserDashboard />
              </React.Suspense>
            </Block>
          </Page>
        )}

        {/* Map tab */}
        {activeTab === 'map' && (
          <Page className="p-0 pb-16">
            <Navbar
              title="Map"
              left={
                <button
                  className="inline-flex items-center justify-center rounded-full p-2 transition-colors hover:bg-black/10 focus:bg-black/10 focus:ring-2 focus:ring-blue-500 focus:outline-none active:bg-black/20"
                  onClick={handleBack}
                  aria-label="Back to home"
                >
                  <ArrowLeft size={20} />
                </button>
              }
              right={
                <div className="flex items-center gap-1">
                  <button
                    className="inline-flex items-center justify-center rounded-full p-2 transition-colors hover:bg-black/10 focus:bg-black/10 focus:ring-2 focus:ring-blue-500 focus:outline-none active:bg-black/20"
                    aria-label="Settings"
                    onClick={handleSettings}
                  >
                    <Settings size={20} />
                  </button>
                </div>
              }
            />

            <div className="h-[calc(100vh-112px)] min-h-[60vh] flex-1">
              <React.Suspense fallback={spinner}>
                <WebMapLayout />
              </React.Suspense>
            </div>
          </Page>
        )}

        {/* Bottom Navigation */}
        <Tabbar className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 shadow-lg dark:border-gray-700 dark:bg-gray-900/95 [&_.k-toolbar-highlight]:!transition-none">
          <TabbarLink
            active={activeTab === 'home'}
            onClick={() => setActiveTab('home')}
            icon={<Home size={20} />}
            label="Home"
            className="transition-colors duration-200"
            aria-current={activeTab === 'home' ? 'page' : undefined}
          />

          <TabbarLink
            active={activeTab === 'map'}
            onClick={() => setActiveTab('map')}
            icon={<Map size={20} />}
            label="Map"
            className="transition-colors duration-200"
            aria-current={activeTab === 'map' ? 'page' : undefined}
          />
        </Tabbar>

        {/* Floating Action Button - Android style */}
        <button
          aria-label="Open map"
          title="Map"
          onClick={() => setActiveTab('map')}
          className="fixed right-4 bottom-20 z-60 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg transition-all duration-200 hover:shadow-xl focus:ring-4 focus:ring-green-300 focus:outline-none active:scale-95"
        >
          <MapPin size={24} className="text-white" />
        </button>
      </App>
    </KonstaProvider>
  )
}
