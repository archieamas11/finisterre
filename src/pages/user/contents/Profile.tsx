import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useMe } from '@/hooks/useMe'

export default function UserProfile() {
  const { user: meUser } = useMe()

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-foreground text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </div>
        <Button>Edit Profile</Button>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your basic account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-muted-foreground text-sm">Name</p>
                <p className="font-medium">{meUser?.name || 'John Doe'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-muted-foreground text-sm">Email</p>
                <p className="font-medium">{meUser?.email || 'john.doe@example.com'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-muted-foreground text-sm">Phone</p>
                <p className="font-medium">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-muted-foreground text-sm">Member Since</p>
                <p className="font-medium">January 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
            <CardDescription>Your current account status and permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Account Type</span>
              <Badge variant={meUser?.isAdmin ? 'default' : 'secondary'}>{meUser?.isAdmin ? 'Administrator' : 'User'}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Status</span>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Connected Memorials</span>
              <span className="font-medium">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Last Login</span>
              <span className="font-medium">Today</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connected Memorials */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Memorials</CardTitle>
          <CardDescription>Memorials you have access to manage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <MapPin className="text-muted-foreground h-5 w-5" />
                <div>
                  <h3 className="font-semibold">Mary Johnson</h3>
                  <p className="text-muted-foreground text-sm">Plot 456, Section B</p>
                </div>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <MapPin className="text-muted-foreground h-5 w-5" />
                <div>
                  <h3 className="font-semibold">Robert Smith</h3>
                  <p className="text-muted-foreground text-sm">Plot 789, Section C</p>
                </div>
              </div>
              <Badge variant="secondary">Pending</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <MapPin className="text-muted-foreground h-5 w-5" />
                <div>
                  <h3 className="font-semibold">Elizabeth Davis</h3>
                  <p className="text-muted-foreground text-sm">Plot 321, Section A</p>
                </div>
              </div>
              <Badge variant="destructive">Attention Needed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
