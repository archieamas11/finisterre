import SpinnerCircle4 from "@/components/ui/spinner-10";
import { useLotOwners } from "@/hooks/lot-owner-hooks/LotOwner.hooks";

import LotOwnersTable from "./LotOwnersTable";

export default function LotOwnersTablePage() {
  const { isError, isPending, data: lotOwners } = useLotOwners();

  if (isPending)
    return (
      <div className="flex items-center justify-center h-full">
        <SpinnerCircle4 />
      </div>
    );

  if (isError || !lotOwners) {
    return <div className="p-4 text-center">Failed to load lot owners.</div>;
  }
  return <LotOwnersTable data={lotOwners} />;
}
