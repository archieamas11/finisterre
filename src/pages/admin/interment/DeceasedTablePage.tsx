import { useEffect, useState } from "react";
import DeceasedTable from "./DeceasedTable";
import { getDeceasedRecords } from "@/api/users";
import type { DeceasedRecords } from "@/types/IntermentTypes";
import SpinnerCircle4 from "@/components/spinner-10";

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

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <SpinnerCircle4 />
      </div>
    );
  return <DeceasedTable data={deceasedRecords} />;
}
