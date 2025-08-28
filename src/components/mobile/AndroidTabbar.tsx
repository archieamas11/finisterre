import { useState } from 'react'
import { Page, Navbar, Tabbar, TabbarLink, Block, ToolbarPane, Fab, Link, Card, BlockTitle } from 'konsta/react'
import { MapPin, UserIcon, HomeIcon, Settings2Icon } from 'lucide-react'
import AndroidMapPage from './AndroidMapPage'
import UserDashboard from '@/pages/user/UserDashboard'

export default function TabbarPage() {
  const [activeTab, setActiveTab] = useState('home')
  const [showMapPage, setShowMapPage] = useState(false)
  return (
    <Page>
      <Navbar
        title="Home"
        subtitle="Finisterre Gardenz"
        className="sticky top-0"
        transparent={true}
        left={
          <Link>
            <MapPin />
          </Link>
        }
        right={
          <Link>
            <UserIcon />
          </Link>
        }
      />
      {!showMapPage && (
        <Tabbar className="fixed bottom-0 left-0">
          <ToolbarPane>
            <TabbarLink active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<HomeIcon className="h-6 w-6" />} label={'Home'} />
            <TabbarLink active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings2Icon className="h-6 w-6" />} label={'Settings'} />
          </ToolbarPane>
        </Tabbar>
      )}
      {activeTab === 'home' && (
        <Block strong inset className="space-y-4">
          <UserDashboard />
          <Fab
            className="right-safe-4 ios:bottom-safe-19 material:bottom-safe-18 k-color-brand-red fixed z-20"
            icon={<MapPin className="h-6 w-6" />}
            onClick={() => setShowMapPage(true)}
          />
        </Block>
      )}
      {activeTab === 'settings' && (
        <Block strong inset className="space-y-4">
          <BlockTitle>Settings</BlockTitle>
          <Card>This is a simple card with plain text, but cards can also contain their own header, footer, list view, image, or any other element.</Card>
        </Block>
      )}
      {showMapPage && <AndroidMapPage onBack={() => setShowMapPage(false)} />}
    </Page>
  )
}
