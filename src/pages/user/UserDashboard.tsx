import { CalendarDays, Bell, Heart, MapPin, Eye } from 'lucide-react'

import { ErrorMessage } from '@/components/ErrorMessage'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Spinner from '@/components/ui/spinner'
import { useUserDashboard } from '@/hooks/useUserDashboard'

export default function UserDashboard() {
  const { data: dashboardData, isLoading, error } = useUserDashboard()

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return <ErrorMessage message={error instanceof Error ? error.message : 'An unexpected error occurred'} />
  }

  // Use real data or defaults
  const stats = {
    connectedMemorials: dashboardData?.connected_memorials || 0,
    upcomingEvents: dashboardData?.upcoming_events || 0,
    activeLots: dashboardData?.active_lots || 0,
    notifications: dashboardData?.notifications || 0,
  }

  const lots = dashboardData?.lots || []
  const deceasedRecords = dashboardData?.deceased_records || []
  const upcomingAnniversaries = dashboardData?.upcoming_anniversaries || []

  return (
    <div className="mt-6 space-y-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-center text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Welcome to Finisterre Memorial Park</h1>
          <div className="mt-6 flex justify-center">
            <div className="flex items-center space-x-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
              <div className="h-2 w-2 rounded-full bg-green-400"></div>
              <span className="text-sm text-slate-300">All systems operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats - mobile-first responsive grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:from-blue-950/50 dark:to-indigo-950/50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
          <CardHeader className="flex items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-300">Connected Memorials</CardTitle>
            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
              <Heart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.connectedMemorials}</div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{stats.connectedMemorials === 1 ? 'Family member memorialized' : 'Family members memorialized'}</p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-emerald-50 to-green-50 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:from-emerald-950/50 dark:to-green-950/50">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
          <CardHeader className="flex items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-300">Upcoming Events</CardTitle>
            <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/30">
              <CalendarDays className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.upcomingEvents}</div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{stats.upcomingEvents === 1 ? 'Scheduled memorial service' : 'Scheduled memorial services'}</p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:from-amber-950/50 dark:to-orange-950/50">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
          <CardHeader className="flex items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-300">Active Lots</CardTitle>
            <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900/30">
              <MapPin className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.activeLots}</div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{stats.activeLots === 1 ? 'Owned lot' : 'Owned lots'}</p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-rose-50 to-pink-50 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:from-rose-950/50 dark:to-pink-950/50">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-pink-500/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
          <CardHeader className="flex items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-300">Notifications</CardTitle>
            <div className="rounded-full bg-rose-100 p-2 dark:bg-rose-900/30">
              <Bell className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.notifications}</div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{stats.notifications === 1 ? 'Unread announcement' : 'Unread announcements'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Memorial Events (Death Anniversaries) */}
      <Card className="border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-xl dark:from-slate-900 dark:to-slate-800/50">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Upcoming Memorial Events</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            {upcomingAnniversaries.length === 0
              ? 'No upcoming death anniversaries in the next 90 days'
              : `${upcomingAnniversaries.length} ${upcomingAnniversaries.length === 1 ? 'anniversary' : 'anniversaries'} coming up`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {upcomingAnniversaries.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <CalendarDays className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No Upcoming Anniversaries</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">There are no death anniversaries in the next 90 days.</p>
            </div>
          ) : (
            upcomingAnniversaries.map((anniversary) => {
              const anniversaryDate = new Date(anniversary.anniversary_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })

              const plotInfo =
                `${anniversary.block ? `Block ${anniversary.block}` : ''}${anniversary.category ? ` - ${anniversary.category}` : ''}${anniversary.niche_number ? ` - Niche ${anniversary.niche_number}` : ''}`.replace(
                  /^[\s-]+|[\s-]+$/g,
                  '',
                ) || 'Plot information'

              const daysText = anniversary.days_until === 0 ? 'Today' : anniversary.days_until === 1 ? 'Tomorrow' : `In ${anniversary.days_until} days`

              const yearsText =
                anniversary.years_since === 1
                  ? '1st Anniversary'
                  : anniversary.years_since === 2
                    ? '2nd Anniversary'
                    : anniversary.years_since === 3
                      ? '3rd Anniversary'
                      : `${anniversary.years_since}th Anniversary`

              return (
                <div
                  key={anniversary.deceased_id}
                  className="group flex flex-col items-start gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg sm:flex-row sm:items-center dark:border-slate-700 dark:bg-slate-800/50"
                >
                  <div className="relative overflow-hidden rounded-lg">
                    <div className="flex h-32 w-full items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 transition-transform duration-300 group-hover:scale-105 sm:h-32 sm:w-48 dark:from-purple-900/30 dark:to-blue-900/30">
                      <div className="text-center">
                        <CalendarDays className="mx-auto h-8 w-8 text-purple-600 dark:text-purple-400" />
                        <p className="mt-2 text-sm font-medium text-purple-700 dark:text-purple-300">{yearsText}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Death Anniversary - {anniversary.deceased_name}</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {plotInfo} • {anniversaryDate}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">Commemorating {anniversary.years_since} years since their passing</p>
                  </div>
                  <div className="flex flex-col items-end gap-3 sm:items-center">
                    <Badge
                      variant={anniversary.days_until <= 7 ? 'default' : 'secondary'}
                      className={
                        anniversary.days_until <= 7
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      }
                    >
                      {daysText}
                    </Badge>
                    <Button variant="ghost" size="sm" className="transition-colors hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20">
                      View Details
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      {/* Recent Announcements (with sample images) */}
      <Card className="border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-xl dark:from-slate-900 dark:to-slate-800/50">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Recent Announcements</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">Latest news and updates from the memorial park</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="group flex flex-col gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg sm:flex-row dark:border-slate-700 dark:bg-slate-800/50">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src="https://picsum.photos/seed/announce1/400/250"
                alt="Garden opening"
                className="h-32 w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105 sm:h-32 sm:w-48"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">New Memorial Garden Opening</h3>
                  <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                    We're excited to announce the opening of our new Memorial Garden. This serene space provides a beautiful setting for reflection and remembrance.
                  </p>
                </div>
                <Badge variant="default" className="ml-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
                  New
                </Badge>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-500">Posted 2 days ago</p>
            </div>
          </div>

          <div className="group flex flex-col gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg sm:flex-row dark:border-slate-700 dark:bg-slate-800/50">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src="https://picsum.photos/seed/announce2/400/250"
                alt="Holiday schedule"
                className="h-32 w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105 sm:h-32 sm:w-48"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
            </div>
            <div className="flex-1 space-y-3">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Holiday Memorial Services Schedule</h3>
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">View the complete schedule for our holiday memorial services and special commemorations.</p>
              <p className="text-sm text-slate-500 dark:text-slate-500">Posted 1 week ago</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Owned Lots Section - Show lots that don't have deceased records yet */}
      {lots.filter((lot) => !deceasedRecords.some((deceased) => deceased.lot_id === lot.lot_id)).length > 0 && (
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-xl dark:from-slate-900 dark:to-slate-800/50">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Your Lots</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">Memorial plots you own that are ready for use</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {lots
              .filter((lot) => !deceasedRecords.some((deceased) => deceased.lot_id === lot.lot_id))
              .map((lot) => {
                const plotInfo =
                  `${lot.block ? `Block ${lot.block}` : ''}${lot.category ? ` - ${lot.category}` : ''}${lot.niche_number ? ` - Niche ${lot.niche_number}` : ''}`.replace(
                    /^[\s-]+|[\s-]+$/g,
                    '',
                  ) || 'Plot information not available'
                const statusColor = lot.lot_status === 'active' ? 'green' : lot.lot_status === 'reserved' ? 'yellow' : 'gray'
                const statusText = lot.lot_status === 'active' ? 'Active' : lot.lot_status === 'reserved' ? 'Reserved' : 'Inactive'

                return (
                  <div
                    key={lot.lot_id}
                    className="group flex flex-col items-start gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg sm:flex-row sm:items-center dark:border-slate-700 dark:bg-slate-800/50"
                  >
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Lot #{lot.lot_id}</h3>
                      <p className="text-slate-600 dark:text-slate-400">{plotInfo}</p>
                      <div className="flex items-center gap-2 pt-2">
                        <div className={`h-2 w-2 rounded-full bg-${statusColor}-500`}></div>
                        <span className={`text-sm text-${statusColor}-600 dark:text-${statusColor}-400`}>{statusText}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 sm:flex-nowrap">
                      <Button variant="ghost" size="sm" className="transition-colors hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20">
                        <MapPin className="mr-2 h-4 w-4" />
                        Navigate
                      </Button>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transition-all hover:from-blue-600 hover:to-purple-600 hover:shadow-xl"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                      <Badge
                        variant="default"
                        className={`${
                          statusColor === 'green'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : statusColor === 'yellow'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                        }`}
                      >
                        {statusText}
                      </Badge>
                    </div>
                  </div>
                )
              })}
          </CardContent>
        </Card>
      )}

      {/* Connected Memorials with actions */}
      <Card className="border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-xl dark:from-slate-900 dark:to-slate-800/50">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Connected Memorials</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            {deceasedRecords.length === 0
              ? 'No memorials connected to your account yet'
              : `${deceasedRecords.length} ${deceasedRecords.length === 1 ? 'memorial' : 'memorials'} for your loved ones`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {deceasedRecords.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <Heart className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No Memorials Yet</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">When you create memorials for your loved ones, they will appear here.</p>
            </div>
          ) : (
            deceasedRecords.map((deceased) => {
              const dateOfDeath = new Date(deceased.dead_date_death).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
              const plotInfo =
                `${deceased.block ? `Block ${deceased.block}` : ''}${deceased.category ? ` - ${deceased.category}` : ''}${deceased.niche_number ? ` - Niche ${deceased.niche_number}` : ''}`.replace(
                  /^[\s-]+|[\s-]+$/g,
                  '',
                ) || 'Plot information not available'

              return (
                <div
                  key={deceased.deceased_id}
                  className="group flex flex-col items-start gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg sm:flex-row sm:items-center dark:border-slate-700 dark:bg-slate-800/50"
                >
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{deceased.dead_fullname}</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {plotInfo} • {dateOfDeath}
                    </p>
                    <div className="flex items-center gap-2 pt-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-sm text-green-600 dark:text-green-400">Memorial Active</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 sm:flex-nowrap">
                    <Button variant="ghost" size="sm" className="transition-colors hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20">
                      <MapPin className="mr-2 h-4 w-4" />
                      Navigate
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transition-all hover:from-blue-600 hover:to-purple-600 hover:shadow-xl"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      Active
                    </Badge>
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}
