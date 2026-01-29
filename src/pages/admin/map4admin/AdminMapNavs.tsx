import { PrinterIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import AdminControls from '@/components/webmap/AdminControls'
import AdminSearchBar from '@/components/webmap/AdminSearchBar'
import ResetMapViewButton from '@/components/webmap/ResetMapViewButton'
import { cn } from '@/lib/utils'

interface AdminMapNavsProps {
  searchLot: (lotId: string) => Promise<void>
  resetView: () => void
  onSelectResult: (item: import('@/types/search.types').AdminSearchItem) => void
}

export default function AdminMapNavs({ searchLot, resetView, onSelectResult }: AdminMapNavsProps) {
  return (
    <nav className={cn('absolute top-2 right-0 left-0 z-[990] mx-auto flex w-full max-w-sm flex-col gap-2')} aria-label="Admin map navigation">
      {/* Search Row */}
      <div className="flex w-full items-center gap-2 pr-3">
        <div className="flex-1">
          <div className="mx-auto w-full max-w-sm">
            <AdminSearchBar onSearch={searchLot} onSelectResult={onSelectResult} />
          </div>
        </div>
      </div>

      {/* Controls Row */}
      <div className="no-scrollbar flex w-full items-center gap-2 overflow-x-auto pt-0 pb-1 md:mx-auto lg:justify-center">
        <ResetMapViewButton onReset={resetView} />
        <AdminControls />
        <Button
          variant="secondary"
          size={'sm'}
          aria-label="Print map view"
          onClick={() => window.print()}
          className={'bg-background text-background-foreground hover:bg-background/80shrink-0 rounded-lg text-xs sm:text-sm'}
        >
          <PrinterIcon />
          Print Map
        </Button>
      </div>
    </nav>
  )
}
