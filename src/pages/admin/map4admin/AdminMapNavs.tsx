import AdminControls from '@/components/webmap/AdminControls'
import AdminSearchBar from '@/components/webmap/AdminSearchBar'
import ResetMapViewButton from '@/components/webmap/ResetMapViewButton'
import { cn } from '@/lib/utils'

interface AdminMapNavsProps {
  searchLot: (lotId: string) => Promise<void>
  resetView: () => void
}

export default function AdminMapNavs({ searchLot, resetView }: AdminMapNavsProps) {
  return (
    <nav
      className={cn(
        'absolute top-2 right-0 left-0 z-[990] mx-auto flex w-full max-w-full flex-col gap-2 pl-3 sm:top-3 sm:px-4 md:top-4 md:px-2 lg:max-w-2xl',
      )}
      aria-label="Admin map navigation"
    >
      {/* Search Row */}
      <div className="flex w-full items-center gap-2 pr-3">
        <div className="flex-1">
          <div className="mx-auto w-full max-w-sm">
            <AdminSearchBar onSearch={searchLot} />
          </div>
        </div>
      </div>

      {/* Controls Row */}
      <div className="no-scrollbar flex w-full items-center gap-2 overflow-x-auto pt-0 pb-1 md:mx-auto lg:justify-center">
        <ResetMapViewButton onReset={resetView} />
        <AdminControls />
      </div>
    </nav>
  )
}
