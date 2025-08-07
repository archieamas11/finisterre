import SpinnerCircle4 from "@/components/ui/spinner-10";
import { ErrorMessage } from "@/components/ErrorMessage";

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
