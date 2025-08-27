import { CalendarDays, Bell, Heart, MapPin, Eye } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function UserDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-foreground text-2xl font-bold sm:text-3xl">Welcome to Finisterre Memorial Park</h1>
        <p className="text-muted-foreground mt-2">A modern dashboard to manage memorial services and stay connected</p>
      </div>

      {/* Quick Stats - mobile-first responsive grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Connected Memorials</CardTitle>
            <Heart className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-muted-foreground text-xs">Family members memorialized</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <CalendarDays className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-muted-foreground text-xs">Scheduled memorial services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <MapPin className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-muted-foreground text-xs">Ongoing memorial services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-muted-foreground text-xs">Unread announcements</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events (with sample images) */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Memorial Events</CardTitle>
          <CardDescription>Scheduled services and commemorations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-start gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
            <img src="https://picsum.photos/seed/event1/400/250" alt="Memorial service" className="h-24 w-full rounded-md object-cover sm:h-24 sm:w-40" loading="lazy" />
            <div className="flex-1">
              <h3 className="font-semibold">Memorial Service - John Doe</h3>
              <p className="text-muted-foreground text-sm">Plot 123, Section A • October 15, 2025</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">In 3 days</Badge>
              <Button variant="ghost" size="sm">
                Details
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
            <img src="https://picsum.photos/seed/event2/400/250" alt="Annual commemoration" className="h-24 w-full rounded-md object-cover sm:h-24 sm:w-40" loading="lazy" />
            <div className="flex-1">
              <h3 className="font-semibold">Annual Commemoration</h3>
              <p className="text-muted-foreground text-sm">All Saints Chapel • November 1, 2025</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">In 1 month</Badge>
              <Button variant="ghost" size="sm">
                Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Announcements (with sample images) */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Announcements</CardTitle>
          <CardDescription>Latest news and updates from the memorial park</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row">
            <img src="https://picsum.photos/seed/announce1/400/250" alt="Garden opening" className="h-24 w-full rounded-md object-cover sm:h-24 sm:w-40" loading="lazy" />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">New Memorial Garden Opening</h3>
                  <p className="text-muted-foreground mt-1 text-sm">
                    We're excited to announce the opening of our new Memorial Garden. This serene space provides a beautiful setting for reflection and remembrance.
                  </p>
                </div>
                <Badge variant="default">New</Badge>
              </div>
              <p className="text-muted-foreground mt-2 text-xs">Posted 2 days ago</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row">
            <img src="https://picsum.photos/seed/announce2/400/250" alt="Holiday schedule" className="h-24 w-full rounded-md object-cover sm:h-24 sm:w-40" loading="lazy" />
            <div className="flex-1">
              <h3 className="font-semibold">Holiday Memorial Services Schedule</h3>
              <p className="text-muted-foreground mt-1 text-sm">View the complete schedule for our holiday memorial services and special commemorations.</p>
              <p className="text-muted-foreground mt-2 text-xs">Posted 1 week ago</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connected Memorials with actions */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Memorials</CardTitle>
          <CardDescription>Status of memorials for your connected loved ones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-start gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <h3 className="font-semibold">Mary Johnson</h3>
              <p className="text-muted-foreground text-sm">Plot 456, Section B • Memorial maintained</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <MapPin className="h-4 w-4" />
                <span>Navigate</span>
              </Button>
              <Button size="sm">
                <Eye className="h-4 w-4" />
                <span>View</span>
              </Button>
              <Badge variant="default">Active</Badge>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <h3 className="font-semibold">Robert Smith</h3>
              <p className="text-muted-foreground text-sm">Plot 789, Section C • Service scheduled</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <MapPin className="h-4 w-4" />
                <span>Navigate</span>
              </Button>
              <Button size="sm">
                <Eye className="h-4 w-4" />
                <span>View</span>
              </Button>
              <Badge variant="secondary">Pending</Badge>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <h3 className="font-semibold">Elizabeth Davis</h3>
              <p className="text-muted-foreground text-sm">Plot 321, Section A • Maintenance due</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <MapPin className="h-4 w-4" />
                <span>Navigate</span>
              </Button>
              <Button variant="destructive" size="sm">
                <Eye className="h-4 w-4" />
                <span>View</span>
              </Button>
              <Badge variant="destructive">Attention Needed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
