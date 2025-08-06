import SpinnerCircle4 from "@/components/ui/spinner-10";

import LotOwnersTable from "./LotOwnersTable";
import { useGetLotOwner } from "@/hooks/lot-owner-hooks/useGetLotOwner";

export default function LotOwnersTablePage() {
  const { isError, isPending, data: lotOwners } = useGetLotOwner();

  if (isPending)
    return (
      <div className="flex h-full items-center justify-center">
        <SpinnerCircle4 />
      </div>
    );

  if (isError || !lotOwners) {
    return <div className="p-4 text-center">Failed to load lot owners.</div>;
  }
  return <LotOwnersTable data={lotOwners} />;
}
