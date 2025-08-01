import CustomersTable from "./CustomersTable";
import SpinnerCircle4 from "@/components/ui/spinner-10";
import { useCustomers } from '@/hooks/customer-hooks/Customers.hooks';

export default function CustomersTablePage() {
  const { data: customers, isLoading, isError } = useCustomers();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <SpinnerCircle4 />
      </div>
    );
  }

  if (isError || !customers) {
    return <div className="p-4 text-center">Failed to load customers.</div>;
  }

  return <CustomersTable data={customers} />;
}
