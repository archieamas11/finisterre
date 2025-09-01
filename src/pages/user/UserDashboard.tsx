import { CalendarDays, Heart, MapPin, Megaphone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { ErrorMessage } from '@/components/ErrorMessage'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Spinner from '@/components/ui/spinner'
import { useUserDashboard } from '@/hooks/useUserDashboard'

import type { Lot, Deceased, Coordinates } from './components/types'

import { AnnouncementCard } from './components/AnnouncementCard'
import { LotMemorialPanel } from './components/LotMemorialPanel'
import { StatCard } from './components/StatCard'

export default function UserDashboard() {
  const { data: dashboardData, isLoading, error } = useUserDashboard()
  const navigate = useNavigate()

  const handleNavigateToPlot = (coordinates?: Coordinates | null) => {
    if (!coordinates) return
    // Reset scroll position before navigation
    window.scrollTo(0, 0)
    const [lat, lng] = coordinates
    navigate(`/user/map?direction=true&lat=${lat}&lng=${lng}`)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return <ErrorMessage message={error.message} showRetryButton />
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
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Promotional / News Banner */}
      <section
        aria-label="Latest announcement"
        className="relative mb-10 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-0 text-white shadow-2xl dark:border-slate-700"
      >
        <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.4), transparent 60%)' }} />
        <div className="relative z-10 flex flex-col items-start gap-6 px-8 py-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide backdrop-blur-sm">
              <Megaphone className="h-4 w-4" aria-hidden="true" />
              <span>Announcement</span>
            </div>
            <h1 className="text-2xl leading-tight font-bold tracking-tight sm:text-3xl lg:text-4xl">Grand Opening: New Memorial Garden & Reflection Pathway</h1>
            <p className="mt-4 text-sm leading-relaxed text-indigo-50/90 md:text-base">
              Experience a renewed space for remembrance. Explore landscaped pathways, quiet seating alcoves, and enhanced wayfinding now available to all families.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={() => {
                  const el = document.getElementById('announcements-section')
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className="inline-flex items-center rounded-md bg-white/90 px-5 py-2.5 text-sm font-semibold text-indigo-700 shadow-lg shadow-indigo-900/20 transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative w-full max-w-sm self-stretch md:w-auto md:self-center">
            <div className="pointer-events-none absolute -top-12 -right-12 hidden h-56 w-56 rounded-full bg-white/10 blur-2xl md:block" />
            <div className="relative mx-auto flex h-48 w-full max-w-xs items-center justify-center overflow-hidden rounded-xl bg-white/10 backdrop-blur-md md:h-52">
              <img
                src="https://picsum.photos/seed/memorial-garden/600/400"
                alt="New memorial garden pathway with landscaped greenery"
                width={600}
                height={400}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Your Memorial Overview</h2>
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
                    <LotMemorialPanel key={String(lot.lot_id)} lot={lot} records={records} onNavigate={handleNavigateToPlot} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Announcements (1/3 width) */}
        <div className="lg:col-span-1">
          <Card className="border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-xl dark:from-slate-900 dark:to-slate-800/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Recent Announcements</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">Latest news and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AnnouncementCard
                title="New Memorial Garden Opening"
                description="We're excited to announce the opening of our new Memorial Garden. This serene space provides a beautiful setting for reflection and remembrance."
                date="Posted 2 days ago"
                isNew={true}
              />
              <AnnouncementCard
                title="Holiday Memorial Services Schedule"
                description="View the complete schedule for our holiday memorial services and special commemorations."
                date="Posted 1 week ago"
                isNew={false}
              />
              <AnnouncementCard
                title="Extended Visiting Hours"
                description="We've extended our visiting hours for the summer season. The memorial park is now open until 8 PM on weekdays."
                date="Posted 2 weeks ago"
                isNew={false}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
