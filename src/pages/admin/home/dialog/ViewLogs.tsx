import type { ActivityLog } from '@/api/logs.api'
import * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface ViewLogProps {
  log: ActivityLog
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ViewLog({ log, open: controlledOpen, onOpenChange }: ViewLogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = onOpenChange ?? setUncontrolledOpen

  const printLog = React.useCallback(() => {
    const win = window.open('', '_blank', 'noopener,noreferrer')
    if (!win) return
    const created = new Date(log.created_at)
    const when = isNaN(created.getTime()) ? log.created_at : created.toLocaleString()
    win.document.write(`<!DOCTYPE html><html lang="en"><head><title>Log #${log.log_id}</title><style>
      body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;padding:24px;line-height:1.4;}
      h1{font-size:20px;margin:0 0 12px;font-weight:600}
      table{border-collapse:collapse;width:100%;max-width:640px}
      th,td{text-align:left;vertical-align:top;padding:6px 8px;font-size:14px;border:1px solid #ddd;}
      th{background:#f5f5f5;width:140px;font-weight:600}
      code{white-space:pre-wrap;word-break:break-word;font-family:ui-monospace,monospace;font-size:12px;background:#f1f5f9;padding:2px 4px;border-radius:4px;}
    </style></head><body>
    <h1>Activity Log #${log.log_id}</h1>
    <table>
      <tr><th>ID</th><td>${log.log_id}</td></tr>
      <tr><th>User</th><td>${log.username ?? log.user_id}</td></tr>
      <tr><th>Action</th><td>${log.action}</td></tr>
      <tr><th>Target</th><td>${log.target}</td></tr>
      <tr><th>Details</th><td>${log.details ?? ''}</td></tr>
      <tr><th>When</th><td>${when}</td></tr>
    </table>
    <script>window.print()</script>
    </body></html>`)
    win.document.close()
  }, [log])

  const created = new Date(log.created_at)
  const when = isNaN(created.getTime()) ? log.created_at : created.toLocaleString()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Activity Log #{log.log_id}</DialogTitle>
          <DialogDescription>Full details of the selected log entry.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4" id={`print-log-${log.log_id}`}>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-muted-foreground font-medium">User</div>
            <div>{log.username ?? log.user_id}</div>
            <div className="text-muted-foreground font-medium">Action</div>
            <div>
              <Badge variant="outline">{log.action}</Badge>
            </div>
            <div className="text-muted-foreground font-medium">Target</div>
            <div>{log.target}</div>
            <div className="text-muted-foreground font-medium">When</div>
            <div>{when}</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1 text-sm font-medium">Details</div>
            <div className="bg-muted/30 rounded border p-2 text-sm leading-relaxed">
              {log.details ? (
                <pre className="font-sans text-xs break-words whitespace-pre-wrap">{log.details}</pre>
              ) : (
                <span className="text-muted-foreground/70">No additional details</span>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <div className="flex gap-2 sm:order-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button type="button" onClick={printLog}>
              Print
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
