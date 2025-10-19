import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { ErrorMessage } from '@/components/ErrorMessage'
import { ChartAreaInteractive } from '@/components/sidebar/chart-area-interactive'
import { ChartAreaStackedExpand } from '@/components/sidebar/plots-stats'
import { SectionCards } from '@/components/sidebar/section-cards'
import { useGetLogs } from '@/hooks/logs-hooks/useGetLogs'
import { useAuthQuery } from '@/hooks/useAuthQuery'

import LogsTable from './LogsTable'
import { ChartPieInteractive } from './PieChart'

export default function UserDashboard() {
  const { data, isPending, isError } = useGetLogs({ limit: 500 })
  const { data: auth } = useAuthQuery()
  const role = auth?.user?.role ?? (localStorage.getItem('role') as 'admin' | 'staff' | 'user' | null)
  const isAdmin = role === 'admin'
  return (
    <div className="w-full p-4 shadow-sm">
      <div className="@container/main flex flex-1 flex-col justify-between gap-4 py-4 md:gap-6">
        <SectionCards />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ChartAreaInteractive />
        <ChartAreaStackedExpand />
      </div>
      <div className="mt-4">
        <ChartPieInteractive />
      </div>
      {isAdmin && (
        <section aria-labelledby="recent-activity-title" className="bg-background mt-5 rounded-lg border p-4 shadow-sm" role="region">
          <div className="mb-2 flex items-center justify-between">
            <h2 id="recent-activity-title" className="text-xl font-semibold">
              Recent Activity
            </h2>
          </div>
          <div aria-busy={isPending}>
            {isPending && <DataTableSkeleton columnCount={10} filterCount={3} />}
            {isError && <ErrorMessage message="Failed to load activity logs." />}
            {!isPending && !isError && data && <LogsTable data={data.logs ?? []} />}
          </div>
        </section>
      )}
    </div>
  )
}
