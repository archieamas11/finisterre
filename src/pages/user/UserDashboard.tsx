import { CalendarDays, Bell, Heart, MapPin, Eye } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function UserDashboard() {
  return (
    <div className="mt-6 space-y-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-center text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Welcome to Finisterre Memorial Park</h1>
          <p className="mt-4 text-lg text-slate-300 sm:text-xl">A modern dashboard to manage memorial services and stay connected with your loved ones</p>
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
            <div className="text-3xl font-bold text-slate-900 dark:text-white">3</div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Family members memorialized</p>
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
            <div className="text-3xl font-bold text-slate-900 dark:text-white">2</div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Scheduled memorial services</p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:from-amber-950/50 dark:to-orange-950/50">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
          <CardHeader className="flex items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-300">Active Services</CardTitle>
            <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900/30">
              <MapPin className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-slate-900 dark:text-white">1</div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Ongoing memorial services</p>
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
            <div className="text-3xl font-bold text-slate-900 dark:text-white">5</div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Unread announcements</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events (with sample images) */}
      <Card className="border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-xl dark:from-slate-900 dark:to-slate-800/50">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Upcoming Memorial Events</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">Scheduled services and commemorations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="group flex flex-col items-start gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg sm:flex-row sm:items-center dark:border-slate-700 dark:bg-slate-800/50">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src="https://picsum.photos/seed/event1/400/250"
                alt="Memorial service"
                className="h-32 w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105 sm:h-32 sm:w-48"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Death Anniversary - John Doe</h3>
              <p className="text-slate-600 dark:text-slate-400">October 15, 2025</p>
              <p className="text-sm text-slate-500 dark:text-slate-500">A special commemoration service honoring John's life and legacy</p>
            </div>
            <div className="flex flex-col items-end gap-3 sm:items-center">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                In 3 days
              </Badge>
              <Button variant="ghost" size="sm" className="transition-colors hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20">
                View Details
              </Button>
            </div>
          </div>

          <div className="group flex flex-col items-start gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg sm:flex-row sm:items-center dark:border-slate-700 dark:bg-slate-800/50">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src="https://picsum.photos/seed/event2/400/250"
                alt="Annual commemoration"
                className="h-32 w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105 sm:h-32 sm:w-48"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Annual Commemoration</h3>
              <p className="text-slate-600 dark:text-slate-400">All Saints Chapel • November 1, 2025</p>
              <p className="text-sm text-slate-500 dark:text-slate-500">Join us for our annual commemoration of all loved ones</p>
            </div>
            <div className="flex flex-col items-end gap-3 sm:items-center">
              <Badge variant="outline" className="border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-400">
                In 1 month
              </Badge>
              <Button variant="ghost" size="sm" className="transition-colors hover:bg-slate-50 hover:text-slate-700 dark:hover:bg-slate-900/20">
                View Details
              </Button>
            </div>
          </div>
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

      {/* Connected Memorials with actions */}
      <Card className="border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-xl dark:from-slate-900 dark:to-slate-800/50">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Connected Memorials</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">Status of memorials for your connected loved ones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="group flex flex-col items-start gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg sm:flex-row sm:items-center dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Mary Johnson</h3>
              <p className="text-slate-600 dark:text-slate-400">Plot 456, Section B • Memorial maintained</p>
              <div className="flex items-center gap-2 pt-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-green-600 dark:text-green-400">Active</span>
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

          <div className="group flex flex-col items-start gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg sm:flex-row sm:items-center dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Robert Smith</h3>
              <p className="text-slate-600 dark:text-slate-400">Plot 789, Section C • Service scheduled</p>
              <div className="flex items-center gap-2 pt-2">
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-yellow-600 dark:text-yellow-400">Pending</span>
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
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                Pending
              </Badge>
            </div>
          </div>

          <div className="group flex flex-col items-start gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg sm:flex-row sm:items-center dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Elizabeth Davis</h3>
              <p className="text-slate-600 dark:text-slate-400">Plot 321, Section A • Maintenance due</p>
              <div className="flex items-center gap-2 pt-2">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <span className="text-sm text-red-600 dark:text-red-400">Attention Needed</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 sm:flex-nowrap">
              <Button variant="ghost" size="sm" className="transition-colors hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20">
                <MapPin className="mr-2 h-4 w-4" />
                Navigate
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg transition-all hover:from-red-600 hover:to-pink-600 hover:shadow-xl"
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </Button>
              <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                Attention Needed
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
