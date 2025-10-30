import LotOwnersTablePage from './LotOwnersTablePage'

export default function AdminIntermentLotOwnersPage() {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <h1 className="text-primary text-3xl font-bold">Lot Owners Management</h1>
        <p className="text-muted-foreground text-lg">View, search, and manage your lot owners records.</p>
      </div>
      <LotOwnersTablePage />
    </div>
  )
}
