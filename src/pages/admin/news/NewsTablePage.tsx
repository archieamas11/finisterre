import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { ErrorMessage } from '@/components/ErrorMessage'
import { Card } from '@/components/ui/card'
import { useGetNews } from '@/hooks/news-hooks/useGetNews'
import NewsTable from './NewsTable'

export default function NewsTablePage() {
  const { isError, isPending, data: newsItems, refetch } = useGetNews()
  const isLoading = isPending

  if (isLoading && !newsItems) {
    return (
      <Card className="p-4">
        <DataTableSkeleton columnCount={7} filterCount={0} />
      </Card>
    )
  }

  if (isError || !newsItems) {
    return (
      <ErrorMessage
        message="Failed to load news data. Please check your connection and try again."
        onRetry={() => refetch()}
        showRetryButton={true}
      />
    )
  }
  return <NewsTable data={newsItems} />
}
