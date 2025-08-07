import { ErrorMessage } from "@/components/ErrorMessage";
import SpinnerCircle4 from "@/components/ui/spinner-10";
import { useGetCustomers } from "@/hooks/customer-hooks/useGetCustomer";
import CustomersTable from "@/pages/admin/interment/customer/CustomersTable";

export default function CustomersPage() {
  const { isError, isPending, data: customers } = useGetCustomers();

  if (isPending)
    return (
      <div className="flex h-full items-center justify-center">
        <SpinnerCircle4 />
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
