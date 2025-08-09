import { useGetDeceasedRecord } from "@/hooks/deceased-hooks/useGetDeceasedRecord";

import DeceasedRecordsTable from "./DeceasedTable";
import { ErrorMessage } from "@/components/ErrorMessage";
import SkeletonTableOneWrapper from "@/components/mvpblocks/skeleton-table-1";

export default function DeceasedTablePage() {
  const { isError, isPending, data: deceasedRecords } = useGetDeceasedRecord();

  if (isPending)
    if (isPending)
      return (
        <div className="flex h-full items-center justify-center">
          <SkeletonTableOneWrapper
            rowCount={10}
            columnCount={5}
          />
        </div>
      );

  if (isError || !deceasedRecords) {
    return (
      <ErrorMessage
        message="Failed to load deceased data. Please check your connection and try again."
        onRetry={() => useGetDeceasedRecord()}
        showRetryButton={true}
      />
    );
  }
  return <DeceasedRecordsTable data={deceasedRecords} />;
}
