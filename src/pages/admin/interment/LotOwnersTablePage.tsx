import { ErrorMessage } from "@/components/ErrorMessage";

import LotOwnersTable from "./LotOwnersTable";
import { useGetLotOwner } from "@/hooks/lot-owner-hooks/useGetLotOwner";
import SkeletonTableOneWrapper from "@/components/mvpblocks/skeleton-table-1";

export default function LotOwnersTablePage() {
  const { isError, isPending, data: lotOwners } = useGetLotOwner();

  if (isPending)
    return (
      <div className="flex h-full items-center justify-center">
        <SkeletonTableOneWrapper
          rowCount={10}
          columnCount={5}
        />
      </div>
    );

  if (isError || !lotOwners) {
    return (
      <ErrorMessage
        message="Failed to load user data. Please check your connection and try again."
        onRetry={() => useGetLotOwner()}
        showRetryButton={true}
      />
    );
  }
  return <LotOwnersTable data={lotOwners} />;
}
