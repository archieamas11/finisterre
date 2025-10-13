import type { Row } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import React from 'react'
import type { ActivityLog } from '@/api/logs.api'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ViewLog } from './dialog/ViewLogs'
import { useReactToPrint } from 'react-to-print'
import PrintableLogDetails from './components/PrintableLogDetails'

interface LogActionsCellProps {
  row: Row<ActivityLog>
}

export default function LogActionsCell({ row }: LogActionsCellProps) {
  const contentRef = React.useRef<HTMLDivElement>(null)
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `Activity Log #${row?.original?.log_id ?? ''}`,
  })
  const [viewOpen, setViewOpen] = React.useState(false)
  if (!row?.original) return null
  const log = row.original

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-8 w-8 p-0" variant="ghost">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-50" align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setViewOpen(true)}>View Log</DropdownMenuItem>
          <DropdownMenuItem onClick={reactToPrintFn}>Quick Print</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <PrintableLogDetails ref={contentRef} log={log} />
      <ViewLog log={log} open={viewOpen} onOpenChange={setViewOpen} />
    </>
  )
}
