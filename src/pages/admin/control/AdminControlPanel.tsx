import { BellOff, Shield, Bell } from 'lucide-react'
import { useState } from 'react'

import { CardContent, CardHeader, CardTitle, Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import AdminUsersTable from '@/pages/admin/home/AdminUsersTable'

export default function AdminControlPanel() {
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [sendNotifications, setSendNotifications] = useState(true)
  const [receiveNotifications, setReceiveNotifications] = useState(true)

  return (
    <div className="min-h-screen md:p-6">
      {/* Header */}
      <header className="mb-4">
        {/* Admin Controls */}
        <Card className="bg-card text-card-foreground border-border mb-4 shadow-sm transition-shadow duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Shield className="h-7 w-7 text-emerald-500" />
                <h1 className="text-primary text-3xl font-bold">Admin Controls</h1>
              </div>
              <p className="text-muted-foreground text-lg">View, search, and manage your customer records.</p>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex items-center justify-between rounded-lg border border-emerald-100 bg-gradient-to-r from-emerald-50 to-cyan-50 p-4 dark:border-emerald-800/30 dark:from-emerald-900/20 dark:to-cyan-900/20">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-500 p-2">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Maintenance Mode</p>
                    <p className="text-muted-foreground text-xs">{maintenanceMode ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
                <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-cyan-100 bg-gradient-to-r from-cyan-50 to-blue-50 p-4 dark:border-cyan-800/30 dark:from-cyan-900/20 dark:to-blue-900/20">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 p-2">
                    <Bell className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Send Notifications</p>
                    <p className="text-muted-foreground text-xs">{sendNotifications ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </div>
                <Switch checked={sendNotifications} onCheckedChange={setSendNotifications} />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 p-4 dark:border-amber-800/30 dark:from-amber-900/20 dark:to-orange-900/20">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 p-2">
                    <BellOff className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Receive Notifications</p>
                    <p className="text-muted-foreground text-xs">{receiveNotifications ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </div>
                <Switch checked={receiveNotifications} onCheckedChange={setReceiveNotifications} />
              </div>
            </div>
          </CardContent>
        </Card>
      </header>

      {/* Stats Cards */}
      {/* <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card text-card-foreground border-border shadow-sm transition-shadow duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Users</p>
                <p className="mt-1 text-2xl font-bold">1,254</p>
                <p className="mt-1 text-xs text-green-500">+12% from last week</p>
              </div>
              <div className="bg-muted/10 rounded-lg p-3">
                <User className="text-primary h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-border shadow-sm transition-shadow duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Active Sessions</p>
                <p className="mt-1 text-2xl font-bold">321</p>
                <p className="mt-1 text-xs text-green-500">+5% from last week</p>
              </div>
              <div className="bg-muted/10 rounded-lg p-3">
                <Shield className="text-primary h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-border shadow-sm transition-shadow duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">System Alerts</p>
                <p className="mt-1 text-2xl font-bold">8</p>
                <p className="mt-1 text-xs text-red-500">-3% from last week</p>
              </div>
              <div className="bg-muted/10 rounded-lg p-3">
                <Bell className="text-primary h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-border shadow-sm transition-shadow duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Storage Used</p>
                <p className="mt-1 text-2xl font-bold">78%</p>
                <p className="mt-1 text-xs text-green-500">+2% from last week</p>
              </div>
              <div className="bg-muted/10 rounded-lg p-3">
                <ArchiveIcon className="text-primary h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}
      {/* Control Cards */}
      {/* <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card text-card-foreground border-border shadow-sm transition-shadow duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Management</CardTitle>
            <User className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">Manage users, roles, and permissions.</p>
          </CardContent>
          <CardFooter>
            <Button size="sm" className="w-full" variant="outline">
              Go to Users
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-card text-card-foreground border-border shadow-sm transition-shadow duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Site Settings</CardTitle>
            <Settings className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">Configure site preferences and options.</p>
          </CardContent>
          <CardFooter>
            <Button size="sm" className="w-full" variant={'outline'}>
              Edit Settings
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-card text-card-foreground border-border shadow-sm transition-shadow duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Logs</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">View system logs and activity reports.</p>
          </CardContent>
          <CardFooter>
            <Button size="sm" className="w-full" variant={'outline'}>
              View Logs
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-card text-card-foreground border-border shadow-sm transition-shadow duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Archived</CardTitle>
            <ArchiveIcon className="text-primary h-4 w-4" />
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">Manage and view archived data in all tables.</p>
          </CardContent>
          <CardFooter>
            <Button size="sm" className="w-full" variant={'outline'}>
              View archived data
            </Button>
          </CardFooter>
        </Card>
      </div> */}
      {/* Admin Users Table */}
      <AdminUsersTable />
    </div>
  )
}
