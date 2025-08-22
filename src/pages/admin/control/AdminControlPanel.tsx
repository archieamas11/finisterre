import {
  ArchiveIcon,
  Settings,
  FileText,
  BellOff,
  Shield,
  User,
  Bell
} from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
  Card
} from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import AdminUsersTable from '@/pages/admin/home/AdminUsersTable'

export default function AdminControlPanel() {
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [sendNotifications, setSendNotifications] = useState(true)
  const [receiveNotifications, setReceiveNotifications] = useState(true)

  return (
    <div className='min-h-screen p-6 md:p-8'>
      {/* Header */}
      <header className='mb-4'>
        {/* Admin Controls */}
        <Card className='bg-card text-card-foreground border-border shadow-sm hover:shadow-lg transition-shadow duration-300 mb-4'>
          <CardHeader>
            <CardTitle className='flex flex-col gap-2'>
              <div className='flex items-center gap-3'>
                <Shield className='text-emerald-500 h-7 w-7' />
                <h1 className='text-primary text-3xl font-bold'>
                  Admin Controls
                </h1>
              </div>
              <p className='text-muted-foreground text-lg'>
                View, search, and manage your customer records.
              </p>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 border border-emerald-100 dark:border-emerald-800/30'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-500'>
                    <Shield className='h-4 w-4 text-white' />
                  </div>
                  <div>
                    <p className='font-medium'>Maintenance Mode</p>
                    <p className='text-xs text-muted-foreground'>
                      {maintenanceMode ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                />
              </div>

              <div className='flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-100 dark:border-cyan-800/30'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500'>
                    <Bell className='h-4 w-4 text-white' />
                  </div>
                  <div>
                    <p className='font-medium'>Send Notifications</p>
                    <p className='text-xs text-muted-foreground'>
                      {sendNotifications ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={sendNotifications}
                  onCheckedChange={setSendNotifications}
                />
              </div>

              <div className='flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-100 dark:border-amber-800/30'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500'>
                    <BellOff className='h-4 w-4 text-white' />
                  </div>
                  <div>
                    <p className='font-medium'>Receive Notifications</p>
                    <p className='text-xs text-muted-foreground'>
                      {receiveNotifications ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={receiveNotifications}
                  onCheckedChange={setReceiveNotifications}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </header>

      <div className='max-w-7xl mx-auto'>
        {/* Stats Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
          <Card className='bg-card text-card-foreground border-border shadow-sm hover:shadow-lg transition-shadow duration-300'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Total Users
                  </p>
                  <p className='text-2xl font-bold mt-1'>1,254</p>
                  <p className='text-xs mt-1 text-green-500'>
                    +12% from last week
                  </p>
                </div>
                <div className='p-3 rounded-lg bg-muted/10'>
                  <User className='h-6 w-6 text-primary' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-card text-card-foreground border-border shadow-sm hover:shadow-lg transition-shadow duration-300'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Active Sessions
                  </p>
                  <p className='text-2xl font-bold mt-1'>321</p>
                  <p className='text-xs mt-1 text-green-500'>
                    +5% from last week
                  </p>
                </div>
                <div className='p-3 rounded-lg bg-muted/10'>
                  <Shield className='h-6 w-6 text-primary' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-card text-card-foreground border-border shadow-sm hover:shadow-lg transition-shadow duration-300'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    System Alerts
                  </p>
                  <p className='text-2xl font-bold mt-1'>8</p>
                  <p className='text-xs mt-1 text-red-500'>
                    -3% from last week
                  </p>
                </div>
                <div className='p-3 rounded-lg bg-muted/10'>
                  <Bell className='h-6 w-6 text-primary' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-card text-card-foreground border-border shadow-sm hover:shadow-lg transition-shadow duration-300'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Storage Used
                  </p>
                  <p className='text-2xl font-bold mt-1'>78%</p>
                  <p className='text-xs mt-1 text-green-500'>
                    +2% from last week
                  </p>
                </div>
                <div className='p-3 rounded-lg bg-muted/10'>
                  <ArchiveIcon className='h-6 w-6 text-primary' />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Control Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
          <Card className='bg-card text-card-foreground border-border shadow-sm hover:shadow-lg transition-shadow duration-300'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                User Management
              </CardTitle>
              <User className='h-4 w-4 text-emerald-500' />
            </CardHeader>
            <CardContent>
              <p className='text-xs text-muted-foreground'>
                Manage users, roles, and permissions.
              </p>
            </CardContent>
            <CardFooter>
              <Button size='sm' className='w-full' variant='outline'>
                Go to Users
              </Button>
            </CardFooter>
          </Card>

          <Card className='bg-card text-card-foreground border-border shadow-sm hover:shadow-lg transition-shadow duration-300'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Site Settings
              </CardTitle>
              <Settings className='h-4 w-4 text-cyan-500' />
            </CardHeader>
            <CardContent>
              <p className='text-xs text-muted-foreground'>
                Configure site preferences and options.
              </p>
            </CardContent>
            <CardFooter>
              <Button size='sm' className='w-full' variant={'outline'}>
                Edit Settings
              </Button>
            </CardFooter>
          </Card>

          <Card className='bg-card text-card-foreground border-border shadow-sm hover:shadow-lg transition-shadow duration-300'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Logs</CardTitle>
              <FileText className='h-4 w-4 text-blue-500' />
            </CardHeader>
            <CardContent>
              <p className='text-xs text-muted-foreground'>
                View system logs and activity reports.
              </p>
            </CardContent>
            <CardFooter>
              <Button size='sm' className='w-full' variant={'outline'}>
                View Logs
              </Button>
            </CardFooter>
          </Card>

          <Card className='bg-card text-card-foreground border-border shadow-sm hover:shadow-lg transition-shadow duration-300'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Archived</CardTitle>
              <ArchiveIcon className='h-4 w-4 text-primary' />
            </CardHeader>
            <CardContent>
              <p className='text-xs text-muted-foreground'>
                Manage and view archived data in all tables.
              </p>
            </CardContent>
            <CardFooter>
              <Button size='sm' className='w-full' variant={'outline'}>
                View archived data
              </Button>
            </CardFooter>
          </Card>
        </div>
        {/* Admin Users Table */}
        <AdminUsersTable />
      </div>
    </div>
  )
}
