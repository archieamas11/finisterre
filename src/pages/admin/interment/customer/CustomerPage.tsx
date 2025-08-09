import { ErrorMessage } from "@/components/ErrorMessage";
import SkeletonTableOneWrapper from "@/components/mvpblocks/skeleton-table-1";
import { useGetCustomers } from "@/hooks/customer-hooks/useGetCustomer";
import CustomersTable from "@/pages/admin/interment/customer/CustomersTable";

export default function CustomersPage() {
  const { isError, isPending, data: customers } = useGetCustomers();

  if (isPending)
    return (
      <div className="flex h-full items-center justify-center">
        <SkeletonTableOneWrapper
          rowCount={10}
          columnCount={5}
        />
      </div>
    );
  if (isError || !customers) {
    return (
      <ErrorMessage
        message="Failed to load customer data. Please check your connection and try again."
        onRetry={() => useGetCustomers()}
        showRetryButton={true}
      />
    );
  }
  return <CustomersTable data={customers} />;
}
