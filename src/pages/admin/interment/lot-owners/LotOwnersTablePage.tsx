import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { ErrorMessage } from '@/components/ErrorMessage'
import { Card } from '@/components/ui/card'
import { useGetLotOwner } from '@/hooks/lot-owner-hooks/useGetLotOwner'

import LotOwnersTable from './LotOwnersTable'

export default function LotOwnersTablePage() {
  const { isError, isPending, data: lotOwners, refetch } = useGetLotOwner()
  const isLoading = isPending

  if (isLoading && !lotOwners) {
    return (
      <Card className="p-4">
        <DataTableSkeleton columnCount={10} filterCount={1} />
      </Card>
    )
  }

  if (isError || !lotOwners) {
    return (
      <ErrorMessage
        message="Failed to load user data. Please check your connection and try again."
        onRetry={() => refetch()}
        showRetryButton={true}
      />
    )
  }
  return <LotOwnersTable data={lotOwners} />
}
