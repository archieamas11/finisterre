import type { DeceasedInfo } from '@/api/customer.api'
import { RiHeart2Fill } from 'react-icons/ri'

import { Badge } from '@/components/ui/badge'
import { formatDate, ucwords } from '@/lib/format'
import { calculateYearsBuried } from '@/utils/date.utils'

interface DeceasedInfoCardProps {
  deceased: DeceasedInfo
}

export function DeceasedInfoCard({ deceased }: DeceasedInfoCardProps) {
  return (
    <div className="bg-muted/30 space-y-2 rounded-lg border border-dashed p-3">
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
          <RiHeart2Fill />
        </div>
        <div className="flex flex-1 items-center justify-between leading-none">
          <div>
            <p className="truncate text-sm font-medium">{deceased.dead_fullname}</p>
            <p className="text-muted-foreground truncate text-xs">Deceased ID: {deceased.deceased_id}</p>
          </div>
          {ucwords(deceased.status ?? '') && (
            <Badge variant="outline" className="ml-3 flex-shrink-0 text-xs">
              {ucwords(deceased.status ?? '')}
            </Badge>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Death Date:</span>
          <div className="font-medium">{formatDate(deceased.dead_date_death ?? undefined)}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Interment:</span>
          <div className="font-medium">{formatDate(deceased.dead_interment ?? undefined)}</div>
        </div>
      </div>
      <div className="text-xs">
        <span className="text-muted-foreground">Years Buried:</span>
        <Badge variant="secondary" className="ml-2 text-xs">
          {calculateYearsBuried(String(deceased.dead_date_death ?? ''))}
        </Badge>
      </div>
    </div>
  )
}
