import { useEffect, useState } from "react";
import LotOwnersTable from "./LotOwnersTable";
import { getLotOwners } from "@/api/users";
import type { LotOwners } from "@/types/IntermentTypes";

export default function LotOwnersTablePage() {
  const [lotOwners, setLotOwners] = useState<LotOwners[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await getLotOwners();
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

  if (loading) return <div>Loading lot owners...</div>;
  return <LotOwnersTable data={lotOwners} />;
}
