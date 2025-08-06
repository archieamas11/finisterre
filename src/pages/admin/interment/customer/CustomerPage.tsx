import SpinnerCircle4 from "@/components/ui/spinner-10";
import { useGetCustomers } from "@/hooks/customer-hooks/useGetCustomer";
import CustomersTable from "@/pages/admin/interment/customer/CustomersTable";

export default function CustomersPage() {
    const { isError, isPending, data: customers } = useGetCustomers();

    if (isPending)
        return (
            <div className="flex items-center justify-center h-full">
                <SpinnerCircle4 />
            </div>
        );
    if (isError) return <p>Failed to load customers</p>;

    return <CustomersTable data={customers} />;
}
