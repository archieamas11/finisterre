import { SkullIcon } from "lucide-react";
import DeceasedTablePage from "./DeceasedTablePage";

export default function AdminIntermentDeceasedPage() {
  return (
    <div className="space-y-4">
      <div className="mb-2 flex flex-col">
        <div className="flex items-center gap-2">
          <SkullIcon className="text-primary h-6 w-6" strokeWidth={2.5} />
          <h2 className="text-primary text-2xl font-bold">Deceased Records Management</h2>
        </div>
        <p className="text-muted-foreground text-sm">View, search, and manage your deceased records.</p>
      </div>
      <DeceasedTablePage />
    </div>
  );
}
