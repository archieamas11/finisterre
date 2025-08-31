import MapPage from '@/layout/WebMapLayout'

export default function UserMap() {
  return (
    <div className="space-y-6">
      {/* Map Container */}
      <div className="mt-4 h-full w-full rounded-lg border p-2">
        <MapPage />
      </div>
    </div>
  )
}
