import { BsFillSuitHeartFill } from 'react-icons/bs'

import DeceasedTablePage from '@/pages/admin/interment/deceased-records/DeceasedTablePage'

export default function AdminIntermentDeceasedPage() {
  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <div className="mb-2 flex items-center gap-3">
          <BsFillSuitHeartFill className="text-primary h-6 w-6" />
          <h1 className="text-primary text-3xl font-bold">Deceased Records Management</h1>
        </div>
        <p className="text-muted-foreground text-lg">View, search, and manage your deceased records.</p>
      </div>
      <DeceasedTablePage />
    </div>
  )
}
