import { User, Mail, Phone, Calendar } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useMe } from '@/hooks/useMe'
import { useMyCustomer } from '@/hooks/useMyCustomer'

export default function UserProfile() {
  const { user: meUser } = useMe()
  const { customer, isLoading } = useMyCustomer()

  const fullName = customer ? [customer.first_name, customer.middle_name, customer.last_name].filter(Boolean).join(' ') : meUser?.name || 'User'

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
                <p className="font-medium">{isLoading ? 'Loading...' : fullName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-muted-foreground text-sm">Email</p>
                <p className="font-medium">{customer?.email || meUser?.email || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-muted-foreground text-sm">Phone</p>
                <p className="font-medium">{customer?.contact_number || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-muted-foreground text-sm">Member Since</p>
                <p className="font-medium">{customer?.created_at ? new Date(customer.created_at).toLocaleDateString() : '—'}</p>
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
              <span className="font-medium">{customer?.lot_info?.length ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Last Login</span>
              <span className="font-medium">—</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
