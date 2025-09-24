import { NewspaperIcon } from 'lucide-react'

export default function NewsAndUpdates() {
  return (
    <div className="mt-5 space-y-6">
      {/* Header Section */}
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <div className="mb-2 flex items-center gap-3">
          <NewspaperIcon className="text-primary h-6 w-6" strokeWidth={2.5} />
          <h1 className="text-primary text-3xl font-bold">News & Announcement</h1>
        </div>
        <p className="text-muted-foreground text-lg">View, search, and manage your customer records.</p>
      </div>
    </div>
  )
}
