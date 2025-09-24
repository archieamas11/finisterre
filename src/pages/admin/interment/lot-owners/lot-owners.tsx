import { LandPlot } from 'lucide-react'

import LotOwnersTablePage from './LotOwnersTablePage'

export default function AdminIntermentLotOwnersPage() {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <div className="mb-2 flex items-center gap-3">
          <LandPlot className="text-primary h-6 w-6" strokeWidth={2.5} />
          <h1 className="text-primary text-3xl font-bold">Lot Owners Management</h1>
        </div>
        <p className="text-muted-foreground text-lg">View, search, and manage your lot owners records.</p>
      </div>
      <LotOwnersTablePage />
    </div>
  )
}
