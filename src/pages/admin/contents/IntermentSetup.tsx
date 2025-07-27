import CustomersTable from "@/components/layout/CustomersTable";
import { useEffect, useState } from "react";
import { getCustomers } from "@/api/users";
import type { Customer } from "@/components/layout/columns";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function IntermentSetup() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      try {
        const response = await getCustomers();
        console.log("API Response:", response); // Debug line

        // Expect customer data as array under response.customers
        if (response && response.success && Array.isArray(response.customers)) {
          setCustomers(response.customers);
        } else {
          setCustomers([]);
        }
      } catch (error) {
        console.error("Error fetching customers:", error); // Debug line
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {loading ? (
            <div>Loading customers...</div>
          ) : (
            <>
              <h2 className="text-lg font-semibold">Customers</h2>
              <Tabs defaultValue="customers">
                <TabsList className="hidden @4xl/main:flex">
                  <TabsTrigger value="customers">Customers</TabsTrigger>
                  <TabsTrigger value="lot-owners">Lot Owners</TabsTrigger>
                  <TabsTrigger value="deceased-records">
                    Deceased Records
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="customers" className="mt-4">
                  <CustomersTable data={customers} />
                </TabsContent>

                <TabsContent value="lot-owners" className="mt-4">
                  <div>Sample Lot Owners Content</div>
                </TabsContent>

                <TabsContent value="deceased-records" className="mt-4">
                  <div>Sample Deceased Records Content</div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
}