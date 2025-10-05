import * as React from 'react'
import type { Row } from '@tanstack/react-table'
import { MoreHorizontal, Printer } from 'lucide-react'

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

interface LogActionsCellProps {
  row: Row<ActivityLog>
}

export default function LogActionsCell({ row }: LogActionsCellProps) {
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
          <DropdownMenuItem
            onClick={() => {
              const win = window.open('', '_blank', 'noopener,noreferrer')
              if (!win) return
              const created = new Date(log.created_at)
              const when = isNaN(created.getTime()) ? log.created_at : created.toLocaleString()
              const payload = JSON.stringify(
                {
                  id: log.log_id,
                  user: log.username ?? log.user_id,
                  action: log.action,
                  target: log.target,
                  details: log.details,
                  when,
                },
                null,
                2,
              )
              win.document.write(
                `<!DOCTYPE html><html lang="en"><head><title>Log #${log.log_id}</title><style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;padding:24px;}h1{font-size:20px;margin:0 0 12px;}pre{background:#f1f5f9;padding:12px;border-radius:6px;font-size:12px;}</style></head><body><h1>Activity Log #${log.log_id}</h1><pre>${payload}</pre><script>window.print()</script></body></html>`,
              )
              win.document.close()
            }}
          >
            <Printer className="h-4 w-4" /> Quick Print
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ViewLog log={log} open={viewOpen} onOpenChange={setViewOpen} />
    </>
  )
}
