import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { ErrorMessage } from '@/components/ErrorMessage'
import { Card } from '@/components/ui/card'
import { useGetCustomers } from '@/hooks/customer-hooks/useGetCustomer'
import CustomersTable from '@/pages/admin/interment/customer/CustomersTable'

export default function CustomersPage() {
  const { isError, isPending, data: customers, refetch } = useGetCustomers()
  const isLoading = isPending

  if (isLoading && !customers) {
    return (
      <Card className='p-4'>
        <DataTableSkeleton columnCount={9} filterCount={2} />
      </Card>
    )
  }
  if (isError || !customers) {
    return (
      <ErrorMessage
        message='Failed to load customer data. Please check your connection and try again.'
        onRetry={() => refetch()}
        showRetryButton={true}
      />
    )
  }
  return <CustomersTable data={customers} />
}
