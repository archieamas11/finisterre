import { BellOff, Shield, Bell } from 'lucide-react'
import { useState } from 'react'

import { CardContent, CardHeader, CardTitle, Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import AdminUsersTable from '@/pages/admin/control/AdminUsersTable'
import { useUsers } from '@/hooks/user-hooks/useUsers'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { ErrorMessage } from '@/components/ErrorMessage'

export default function AdminControlPanel() {
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [sendNotifications, setSendNotifications] = useState(true)
  const [receiveNotifications, setReceiveNotifications] = useState(true)

  const { isError, isPending, data: users, refetch } = useUsers()
  const isLoading = isPending

  if (isLoading && !users) {
    return (
      <Card className="p-4">
        <DataTableSkeleton columnCount={9} filterCount={1} />
      </Card>
    )
  }
  if (isError || !users) {
    return (
      <ErrorMessage
        message="Failed to load customer data. Please check your connection and try again."
        onRetry={() => refetch()}
        showRetryButton={true}
      />
    )
  }

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
      <AdminUsersTable data={users} />
    </div>
  )
}
