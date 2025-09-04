import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { ErrorMessage } from '@/components/ErrorMessage'
import { Card } from '@/components/ui/card'
import { useGetDeceasedRecord } from '@/hooks/deceased-hooks/useGetDeceasedRecord'

import DeceasedRecordsTable from './DeceasedTable'

export default function DeceasedTablePage() {
  const { isError, isPending, data: deceasedRecords, refetch } = useGetDeceasedRecord()
  const isLoading = isPending

  if (isLoading && !deceasedRecords) {
    return (
      <Card className="p-4">
        <DataTableSkeleton columnCount={9} filterCount={0} />
      </Card>
    )
  }

  if (isError || !deceasedRecords) {
    return (
      <ErrorMessage
        message="Failed to load deceased data. Please check your connection and try again."
        onRetry={() => refetch()}
        showRetryButton={true}
      />
    )
  }
  return <DeceasedRecordsTable data={deceasedRecords} />
}
