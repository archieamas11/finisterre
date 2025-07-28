import { useEffect, useState } from "react";
import CustomersTable from "./CustomersTable";
import { getCustomers } from "@/api/users";
import type { Customer } from "@/types/IntermentTypes";
import SpinnerCircle4 from "@/components/spinner-10";

export default function CustomersTablePage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await getCustomers();
        if (response && response.success && Array.isArray(response.customers)) {
          setCustomers(response.customers);
        } else {
          setCustomers([]);
        }
      } catch (error) {
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <SpinnerCircle4 />
      </div>
    );
  return <CustomersTable data={customers} />;
}
