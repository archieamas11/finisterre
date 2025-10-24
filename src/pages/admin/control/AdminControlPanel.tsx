import { useQuery } from '@tanstack/react-query'
import { Loader2, Shield } from 'lucide-react'

import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { ErrorMessage } from '@/components/ErrorMessage'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Switch } from '@/components/ui/switch'
import { useUsers } from '@/hooks/user-hooks/useUsers'
import AdminUsersTable from '@/pages/admin/control/AdminUsersTable'

// import UnknownQuestionsViewer from '@/pages/landing/section/chatbot/UnknownQuestionsViewer';

interface UnknownQuestion {
  id: string
  question: string
  count: number
  first_asked: string
  last_asked: string
  confidence: number
  status: string
}

export default function AdminControlPanel() {
  // const [maintenanceMode, setMaintenanceMode] = useState(false)
  // const [sendNotifications, setSendNotifications] = useState(true)
  // const [receiveNotifications, setReceiveNotifications] = useState(true)

  const { isError, isPending, data: users, refetch } = useUsers()
  const isLoading = isPending

  const API = import.meta.env.VITE_CHATBOT_API_URL

  const {
    data: unknownQuestionsData,
    isLoading: isLoadingQuestions,
    error: questionsError,
  } = useQuery({
    queryKey: ['unknown-questions'],
    queryFn: async () => {
      const res = await fetch(`${API}?action=unknown_questions`)
      if (!res.ok) throw new Error('Failed to fetch unknown questions')
      return res.json()
    },
  })

  const questions: UnknownQuestion[] = unknownQuestionsData?.questions || []

  if (isLoading && !users) {
    return (
      <Card className="p-4">
        <DataTableSkeleton columnCount={10} filterCount={1} />
      </Card>
    )
  }
  if (isError) {
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
                <Shield className="h-7 w-7" />
                <h1 className="text-primary text-3xl font-bold">Admin Controls</h1>
              </div>
              <p className="text-muted-foreground text-lg">Manage administrative settings and user accounts.</p>
            </CardTitle>
          </CardHeader>
          {/* <CardContent>
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
          </CardContent> */}
        </Card>
      </header>
      <div className="space-y-4">
        <AdminUsersTable data={users} />
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Unknown Questions ({questions.length})</CardTitle>
            <CardDescription>
              <p className="text-sm text-muted-foreground">Questions asked by users that weren't found in the FAQ database</p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingQuestions ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading unknown questions...</span>
              </div>
            ) : questionsError ? (
              <p className="text-red-500">Error loading unknown questions: {questionsError.message}</p>
            ) : questions.length === 0 ? (
              <p className="text-muted-foreground">No unknown questions yet.</p>
            ) : (
              <div className="space-y-4">
                {questions.map((q) => (
                  <div key={q.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{q.question}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>
                            Asked {q.count} time{q.count !== 1 ? 's' : ''}
                          </span>
                          <span>Last asked: {new Date(q.last_asked).toLocaleDateString()}</span>
                          <span>Confidence: {(q.confidence * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                      <Badge variant={q.status === 'pending' ? 'secondary' : 'default'}>{q.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
