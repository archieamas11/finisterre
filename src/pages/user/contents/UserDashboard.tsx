import { CalendarDays, Bell, Heart, MapPin } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function UserDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-foreground text-3xl font-bold">Welcome to Finisterre Memorial Park</h1>
        <p className="text-muted-foreground mt-2">Your dashboard for managing memorial services and staying connected</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Deceased</CardTitle>
            <Heart className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-muted-foreground text-xs">Family members memorialized</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <CalendarDays className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-muted-foreground text-xs">Scheduled memorial services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <MapPin className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-muted-foreground text-xs">Ongoing memorial services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-muted-foreground text-xs">Unread announcements</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Memorial Events</CardTitle>
          <CardDescription>Scheduled services and commemorations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <h3 className="font-semibold">Memorial Service - John Doe</h3>
              <p className="text-muted-foreground text-sm">Plot 123, Section A • October 15, 2025</p>
            </div>
            <Badge variant="secondary">In 3 days</Badge>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <h3 className="font-semibold">Annual Commemoration</h3>
              <p className="text-muted-foreground text-sm">All Saints Chapel • November 1, 2025</p>
            </div>
            <Badge variant="outline">In 1 month</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Recent Announcements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Announcements</CardTitle>
          <CardDescription>Latest news and updates from the memorial park</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4">
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
          <div className="rounded-lg border p-4">
            <div>
              <h3 className="font-semibold">Holiday Memorial Services Schedule</h3>
              <p className="text-muted-foreground mt-1 text-sm">View the complete schedule for our holiday memorial services and special commemorations.</p>
            </div>
            <p className="text-muted-foreground mt-2 text-xs">Posted 1 week ago</p>
          </div>
        </CardContent>
      </Card>

      {/* Connected Deceased Status */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Memorials</CardTitle>
          <CardDescription>Status of memorials for your connected loved ones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <h3 className="font-semibold">Mary Johnson</h3>
              <p className="text-muted-foreground text-sm">Plot 456, Section B • Memorial maintained</p>
            </div>
            <Badge variant="default">Active</Badge>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <h3 className="font-semibold">Robert Smith</h3>
              <p className="text-muted-foreground text-sm">Plot 789, Section C • Service scheduled</p>
            </div>
            <Badge variant="secondary">Pending</Badge>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <h3 className="font-semibold">Elizabeth Davis</h3>
              <p className="text-muted-foreground text-sm">Plot 321, Section A • Maintenance due</p>
            </div>
            <Badge variant="destructive">Attention Needed</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
