import SpinnerCircle4 from "@/components/ui/spinner-10";
import { useDeceasedRecords } from "@/hooks/deceased-hooks/DeceasedRecords.hooks";

import DeceasedRecordsTable from "./DeceasedTable";

export default function DeceasedTablePage() {
  const { isError, isPending, data: deceasedRecords } = useDeceasedRecords();

  if (isPending)
    return (
      <div className="flex items-center justify-center h-full">
        <SpinnerCircle4 />
      </div>
    );

  if (isError || !deceasedRecords) {
    return <div className="p-4 text-center">Failed to load deceased records.</div>;
  }
  return <DeceasedRecordsTable data={deceasedRecords} />;
}