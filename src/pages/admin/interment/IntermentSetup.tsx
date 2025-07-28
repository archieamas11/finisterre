import { useEffect, useState } from "react";

import CustomersTable from "@/pages/admin/interment/CustomersTable";
import LotOwnersTable from "@/pages/admin/interment/LotOwnersTable";
import type { Customer, DeceasedRecords, LotOwners } from "@/types/IntermentTypes";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { getCustomers, getDeceasedRecords, getLotOwners } from "@/api/users";
import DeceasedTable from "./DeceasedTable";

export default function IntermentSetup() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [lotOwners, setLotOwners] = useState<LotOwners[]>([]);
  const [deceasedRecords, setDeceasedRecords] = useState<DeceasedRecords[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [getCustomerResponse, getLotOwnersResponse, getDeceasedRecordsResponse] = await Promise.all([
          getCustomers(),
          getLotOwners(),
          getDeceasedRecords(),
        ]);

        console.log("Customer response:", getCustomerResponse);
        console.log("Lot owners response:", getLotOwnersResponse);
        console.log("Deceased records response:", getDeceasedRecordsResponse);

        if (getCustomerResponse && getCustomerResponse.success && Array.isArray(getCustomerResponse.customers)) {
          setCustomers(getCustomerResponse.customers);
        } else {
          setCustomers([]);
        }

        if (getLotOwnersResponse && getLotOwnersResponse.success && Array.isArray(getLotOwnersResponse.lotOwners)) {
          setLotOwners(getLotOwnersResponse.lotOwners);
        } else {
          setLotOwners([]);
        }

        // Fix: Use correct property name from backend response (deceased)
        if (getDeceasedRecordsResponse && getDeceasedRecordsResponse.success && Array.isArray(getDeceasedRecordsResponse.deceased)) {
          setDeceasedRecords(getDeceasedRecordsResponse.deceased);
        } else {
          setDeceasedRecords([]);
        }
      } catch (error) {
        console.error("Error fetching customers or lot owners:", error);
        setCustomers([]);
        setLotOwners([]);
        setDeceasedRecords([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);


  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {loading ? (
            <div>Loading customers...</div>
          ) : (
            <>
              <Tabs defaultValue="customers">
                <TabsList className="hidden @4xl/main:flex">
                  <TabsTrigger value="customers">Customers</TabsTrigger>
                  <TabsTrigger value="lot-owners">Lot Owners</TabsTrigger>
                  <TabsTrigger value="deceased-records">Deceased Records</TabsTrigger>
                </TabsList>
                <TabsContent value="customers">
                  <CustomersTable data={customers} />
                </TabsContent>
                <TabsContent value="lot-owners">
                  <LotOwnersTable data={lotOwners} />
                </TabsContent>
                <TabsContent value="deceased-records">
                  <DeceasedTable data={deceasedRecords} />
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
}