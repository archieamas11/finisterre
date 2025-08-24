import { LandPlot } from "lucide-react";

import LotOwnersTablePage from "./LotOwnersTablePage";

export default function AdminIntermentLotOwnersPage() {
  return (
    <div className="space-y-4">
      <div className="mb-5 flex flex-col">
        <div className="flex items-center gap-2">
          <LandPlot className="text-primary h-6 w-6" strokeWidth={2.5} />
          <h2 className="text-primary text-2xl font-bold">Lot Owners Management</h2>
        </div>
        <p className="text-muted-foreground text-sm">View, search, and manage your lot owners records.</p>
      </div>
      <LotOwnersTablePage />
    </div>
  );
}
