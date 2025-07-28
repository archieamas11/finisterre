import { useEffect, useState } from "react";
import DeceasedTable from "./DeceasedTable";
import { getDeceasedRecords } from "@/api/users";
import type { DeceasedRecords } from "@/types/IntermentTypes";

export default function DeceasedTablePage() {
  const [deceasedRecords, setDeceasedRecords] = useState<DeceasedRecords[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await getDeceasedRecords();
        if (response && response.success && Array.isArray(response.deceased)) {
          setDeceasedRecords(response.deceased);
        } else {
          setDeceasedRecords([]);
        }
      } catch (error) {
        setDeceasedRecords([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading deceased records...</div>;
  return <DeceasedTable data={deceasedRecords} />;
}
