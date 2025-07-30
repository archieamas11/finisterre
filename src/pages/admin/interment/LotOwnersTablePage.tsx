import { useEffect, useState } from "react";
import LotOwnersTable from "./LotOwnersTable";
import { getLotOwner } from "@/api/LotOwner.api";
import type { LotOwners } from "@/types/IntermentTypes";
import SpinnerCircle4 from "@/components/spinner-10";

export default function LotOwnersTablePage() {
  const [lotOwners, setLotOwners] = useState<LotOwners[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await getLotOwner();
        if (response && response.success && Array.isArray(response.lotOwners)) {
          setLotOwners(response.lotOwners);
        } else {
          setLotOwners([]);
        }
      } catch (error) {
        setLotOwners([]);
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
  return <LotOwnersTable data={lotOwners} />;
}
