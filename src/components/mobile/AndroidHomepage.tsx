import { HiNewspaper } from 'react-icons/hi'
import { useState } from 'react'
import { Page, Navbar, Tabbar, TabbarLink, ToolbarPane, Fab, Link, Card } from 'konsta/react'
import { MapPin, UserIcon, HomeIcon, LogIn } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AndroidMapPage from './AndroidMapPage'
import AndroidProfilePage from '@/pages/android/AndroidProfilePage'
import UserDashboard from '@/pages/user/UserDashboard'
import { isAuthenticated } from '@/utils/auth.utils'
import { AnnouncementCard } from '@/pages/user/components/AnnouncementCard'

export default function AndroidHomepage() {
  const [activeTab, setActiveTab] = useState('home')
  const [showMapPage, setShowMapPage] = useState(false)
  const [showProfilePage, setShowProfilePage] = useState(false)
  const navigate = useNavigate()

  // Dynamic navbar content based on active tab
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

  // If showing profile page, render it as the main page
  if (showProfilePage) {
    return <AndroidProfilePage onBack={() => setShowProfilePage(false)} />
  }

  // If showing map page, render it as the main page
  if (showMapPage) {
    return <AndroidMapPage onBack={() => setShowMapPage(false)} />
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
        </ToolbarPane>
      </Tabbar>
      {activeTab === 'home' && (
        <div className="mb-15 space-y-4">
          <UserDashboard />
        </div>
      )}
      {activeTab === 'news' && (
        <Card className="mb-20">
          <div className="space-y-8 py-4">
            <AnnouncementCard
              title="New Memorial Garden Opening"
              description="We're excited to announce the opening of our new Memorial Garden. This serene space provides a beautiful setting for reflection and remembrance."
              fullDescription="We're excited to announce the opening of our new Memorial Garden. This serene space provides a beautiful setting for reflection and remembrance. The garden features landscaped pathways, quiet seating alcoves, and enhanced wayfinding to help families find their loved ones more easily. The opening ceremony will be held this Saturday at 2 PM, and light refreshments will be served."
              date="Posted 2 days ago"
              isNew={true}
              type="event"
            />

            <AnnouncementCard
              title="Holiday Memorial Services Schedule"
              description="View the complete schedule for our holiday memorial services and special commemorations."
              fullDescription="View the complete schedule for our holiday memorial services and special commemorations. This year, we have special services planned for Memorial Day, Independence Day, Labor Day, and Veterans Day. Each service includes a brief ceremony, music, and time for personal reflection. The full schedule is available on our website and at the main office."
              date="Posted 1 week ago"
              isNew={false}
              type="event"
            />

            <AnnouncementCard
              title="Extended Visiting Hours"
              description="We've extended our visiting hours for the summer season. The memorial park is now open until 8 PM on weekdays."
              fullDescription="We've extended our visiting hours for the summer season. The memorial park is now open until 8 PM on weekdays and 9 PM on weekends. This change allows families more flexibility to visit during evenings when the lighting creates a beautiful ambiance. Please note that the main office hours remain unchanged."
              date="Posted 2 weeks ago"
              isNew={false}
              type="general"
            />

            <AnnouncementCard
              title="New Online Memorial Tribute System"
              description="We've launched a new online system that allows families to create and manage digital tributes for their loved ones."
              fullDescription="We've launched a new online system that allows families to create and manage digital tributes for their loved ones. The system includes photo galleries, written memories, virtual candles, and the ability to share tributes with family and friends. All existing tribute information has been migrated to the new system, and training sessions are available at the main office."
              date="Posted 3 weeks ago"
              isNew={false}
              type="important"
            />

            <AnnouncementCard
              title="Community Memorial Service"
              description="Join us for our monthly community memorial service this Sunday at 3 PM in the main chapel."
              fullDescription="Join us for our monthly community memorial service this Sunday at 3 PM in the main chapel. This service is open to all visitors and provides a time for collective remembrance and reflection. Our chaplain will lead the service, and we'll have special music performed by our volunteer choir. Light refreshments will be served following the service."
              date="Posted 1 month ago"
              isNew={false}
              type="event"
            />
          </div>
        </Card>
      )}
      <Fab
        className="right-safe-4 ios:bottom-safe-19 material:bottom-safe-18 k-color-brand-red fixed z-20"
        icon={<MapPin className="h-6 w-6" />}
        onClick={() => setShowMapPage(true)}
      />
    </Page>
  )
}
