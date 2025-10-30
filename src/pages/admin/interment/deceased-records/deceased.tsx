import DeceasedTablePage from '@/pages/admin/interment/deceased-records/DeceasedTablePage'

export default function AdminIntermentDeceasedPage() {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <h1 className="text-primary text-3xl font-bold">Deceased Records Management</h1>
        <p className="text-muted-foreground text-lg">View, search, and manage your deceased records.</p>
      </div>
      <DeceasedTablePage />
    </div>
  )
}
