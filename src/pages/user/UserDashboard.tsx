import { Capacitor } from '@capacitor/core'
import { CalendarDays, Heart, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { ErrorMessage } from '@/components/ErrorMessage'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Spinner from '@/components/ui/spinner'
import { useUserDashboardOffline } from '@/hooks/user-hooks/useUserDashboardOffline'
import { cn } from '@/lib/utils'
import { isNativePlatform } from '@/utils/platform.utils'

import type { Lot, Deceased, Coordinates } from './components/types'

import { AnnouncementCard } from './components/AnnouncementCard'
import { MemorialProperties } from './components/MemorialProperties'
import { PromotionalBanner } from './components/PromotionalBanner'
import { StatCard } from './components/StatCard'

interface UserDashboardProps {
  onPlotNavigate?: (coordinates?: Coordinates | null) => void
}

export default function UserDashboard({ onPlotNavigate }: UserDashboardProps) {
  const { data: dashboardData, isLoading, error, isOffline, source } = useUserDashboardOffline()
  const navigate = useNavigate()

  const handleNavigateToPlot = (coordinates?: Coordinates | null) => {
    if (!coordinates) return
    window.scrollTo(0, 0)

    // If parent wants to handle navigation, let it
    if (onPlotNavigate) {
      onPlotNavigate(coordinates)
      return
    }

    if (Capacitor.isNativePlatform()) return

    // Normalize coordinates to [lat, lng] for URL param `to=lat,lng`.
    // Known shapes: [lng, lat] (existing code), [lat, lng], or null.
    let lat: number | null = null
    let lng: number | null = null

    try {
      const [a, b] = coordinates
      if (typeof a === 'number' && typeof b === 'number') {
        // Heuristic: lat is usually between -90 and 90, lng between -180 and 180.
        if (Math.abs(a) <= 90 && Math.abs(b) <= 180 && Math.abs(b) > 90) {
          // a looks like lat, b looks like lng
          lat = a
          lng = b
        } else {
          // fallback: treat as [lng, lat]
          lng = a
          lat = b
        }
      }
    } catch {
      // ignore and bail below
    }

    if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) return

    navigate(`/user/map?to=${lat},${lng}`)
  }

  // Only show loading spinner if we have no data at all (neither cached nor fresh)
  if (isLoading && !dashboardData) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    )
  }

  // Only show error if we have no data at all (not even cached data)
  if (error && !dashboardData) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred while loading dashboard data'
    return <ErrorMessage message={errorMessage} showRetryButton />
  }

  const stats = {
    connectedMemorials: dashboardData?.connected_memorials ?? 0,
    upcomingEvents: dashboardData?.upcoming_events ?? 0,
    activeLots: dashboardData?.active_lots ?? 0,
  }

  const lots: Lot[] = dashboardData?.lots ?? []
  const deceasedRecords: Deceased[] = dashboardData?.deceased_records ?? []

  // Map each lot to its occupying deceased records (if any)
  const lotsWithRecords: Array<{ lot: Lot; records: Deceased[] }> = lots.map((lot) => ({
    lot,
    records: deceasedRecords.filter((d) => String(d.lot_id) === String(lot.lot_id)),
  }))

  return (
    <div className="px-4 py-8 md:py-8 lg:container lg:mx-auto lg:max-w-7xl lg:px-4 lg:py-8">
      {/* Welcome Banner */}
      <PromotionalBanner
        title="Welcome to Finisterre Memorial Park"
        description="We are honored to provide a peaceful place of remembrance. Explore our map, locate plots, and discover new features designed to guide and support every family."
        imageSrc="https://picsum.photos/seed/welcome-banner/600/400"
        imageAlt="Scenic view of memorial park with trees and pathway"
        buttonText="Get Started"
        variant="royal"
        size="md"
      />

      {/* Quick Stats Section */}
      <section className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Memorial Overview</h2>
          {isOffline && source === 'cache' && (
            <Badge variant="outline" className="text-xs text-amber-600 dark:text-amber-400">
              Offline Mode
            </Badge>
          )}
          {!!error && dashboardData && source === 'cache' && (
            <Badge variant="outline" className="text-xs text-orange-600 dark:text-orange-400">
              Using Cached Data
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Connected Memorials"
            value={stats.connectedMemorials}
            description={stats.connectedMemorials === 1 ? 'Family member memorialized' : 'Family members memorialized'}
            icon={Heart}
            colorClass="from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50"
          />
          <StatCard
            title="Upcoming Events"
            value={stats.upcomingEvents}
            description={stats.upcomingEvents === 1 ? 'Scheduled memorial service' : 'Scheduled memorial services'}
            icon={CalendarDays}
            colorClass="from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50"
          />
          <StatCard
            title="Active Lots"
            value={stats.activeLots}
            description={stats.activeLots === 1 ? 'Owned lot' : 'Owned lots'}
            icon={MapPin}
            colorClass="from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50"
          />
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Combined Lots and Memorials (2/3 width) */}
        <div className="lg:col-span-2">
          <Card className="border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-xl dark:from-slate-900 dark:to-slate-800/50">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Your Memorial Properties</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">Your owned plots and connected memorials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Owned Lots Section */}
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Your Owned Plots</h3>
                <Badge variant="outline" className="text-xs">
                  {lots.length} {lots.length === 1 ? 'plot' : 'plots'}
                </Badge>
              </div>
              {lotsWithRecords.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-800/30">
                  <MapPin className="mx-auto h-10 w-10 text-slate-400" />
                  <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-white">No owned plots</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">You don't own any plots yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {lotsWithRecords.map(({ lot, records }) => (
                    <MemorialProperties key={String(lot.lot_id)} lot={lot} records={records} onNavigate={handleNavigateToPlot} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Announcements (1/3 width) */}
        <div id="announcements-section" className={cn('lg:col-span-1', isNativePlatform() && 'hidden')}>
          <Card className="border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-xl dark:from-slate-900 dark:to-slate-800/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Recent Announcements</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">Latest news and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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

              {/* View All Button */}
              <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  onClick={() => {
                    // TODO: Navigate to full announcements page
                    console.log('Navigate to all announcements')
                  }}
                >
                  View All Announcements
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
