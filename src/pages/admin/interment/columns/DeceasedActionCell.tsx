import type { Row } from '@tanstack/react-table'
import { useRef, useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { DeceasedRecords } from '@/types/interment.types'
import { useEditDeceasedStatus } from '@/hooks/deceased-hooks/useEditDeceasedStatus'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useReactToPrint } from 'react-to-print'
import { PrintableDeceasedDetails } from '@/pages/admin/interment/deceased-records/components/PrintableDeceasedDetails'

const statusSchema = z.object({
  status: z.enum(['active', 'transferred', 'cancelled']),
})

type StatusForm = z.infer<typeof statusSchema>

export default function DeceasedActionCell({ row }: { row: Row<DeceasedRecords> }) {
  const record = row?.original
  const [open, setOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const reactToPrintFn = useReactToPrint({ contentRef })

  const form = useForm<StatusForm>({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      status: (record?.status as 'active' | 'transferred' | 'cancelled') || 'active',
    },
  })

  const { mutateAsync, isPending } = useEditDeceasedStatus()

  const onSubmit = async (data: StatusForm) => {
    await mutateAsync({ deceased_id: record.deceased_id, status: data.status })
    setOpen(false)
  }

  if (!record) return null

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
          <DropdownMenuItem onClick={() => setOpen(true)}>Edit Deceased</DropdownMenuItem>
          <DropdownMenuItem onClick={reactToPrintFn}>Quick Print</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Deceased Status</DialogTitle>
            <DialogDescription>Update status for {record.dead_fullname || record.full_name}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-2">
              <Label htmlFor="deceased-status">Status</Label>
              <Controller
                name="status"
                control={form.control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="deceased-status" className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="transferred">Transferred</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
              {isPending ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Hidden printable content for Quick Print */}
      {record && <PrintableDeceasedDetails ref={contentRef} deceased={record} />}
    </>
  )
}
