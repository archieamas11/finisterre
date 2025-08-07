import SpinnerCircle4 from "@/components/ui/spinner-10";
import { useGetDeceasedRecord } from "@/hooks/deceased-hooks/useGetDeceasedRecord";

import DeceasedRecordsTable from "./DeceasedTable";
import { ErrorMessage } from "@/components/ErrorMessage";

export default function DeceasedTablePage() {
  const { isError, isPending, data: deceasedRecords } = useGetDeceasedRecord();

  if (isPending)
    return (
      <div className="flex h-full items-center justify-center">
        <SpinnerCircle4 />
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
