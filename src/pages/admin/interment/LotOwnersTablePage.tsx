import { ErrorMessage } from "@/components/ErrorMessage";
import { Card } from "@/components/ui/card";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

import LotOwnersTable from "./LotOwnersTable";
import { useGetLotOwner } from "@/hooks/lot-owner-hooks/useGetLotOwner";

export default function LotOwnersTablePage() {
  const { isError, isPending, data: lotOwners } = useGetLotOwner();
  const isLoading = isPending;

  if (isLoading && !lotOwners) {
    return (
      <Card className="p-4">
        <DataTableSkeleton columnCount={9} filterCount={0} />
      </Card>
    );
  }

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
