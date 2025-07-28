import { useEffect, useState } from "react";
import CustomersTable from "./CustomersTable";
import { getCustomers } from "@/api/users";
import type { Customer } from "@/types/IntermentTypes";

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

  if (loading) return <div>Loading customers...</div>;
  return <CustomersTable data={customers} />;
}
