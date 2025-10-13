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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { LotOwners } from '@/types/interment.types'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEditLotStatus } from '@/hooks/lot-owner-hooks/UseUpdateLotOwnerStatus'
import { useReactToPrint } from 'react-to-print'
import { PrintableLotOwnerDetails } from '@/pages/admin/interment/lot-owners/components/PrintableLotOwnerDetails'

const lotStatusSchema = z.object({
  lot_status: z.enum(['active', 'completed', 'cancelled']),
})

type LotStatusForm = z.infer<typeof lotStatusSchema>

export default function LotOwnersActionCell({ row }: { row: Row<LotOwners> }) {
  const record = row?.original
  const [open, setOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const reactToPrintFn = useReactToPrint({ contentRef })

  const form = useForm<LotStatusForm>({
    resolver: zodResolver(lotStatusSchema),
    defaultValues: {
      lot_status: (record?.lot_status as 'active' | 'completed' | 'cancelled') || 'active',
    },
  })

  const { mutateAsync, isPending } = useEditLotStatus()

  const onSubmit = async (data: LotStatusForm) => {
    await mutateAsync({ lot_id: String(record.lot_id), lot_status: data.lot_status })
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
          <DropdownMenuItem onClick={() => setOpen(true)}>Edit Lot</DropdownMenuItem>
          <DropdownMenuItem onClick={reactToPrintFn}>Quick Print</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Lot Status</DialogTitle>
            <DialogDescription>
              Update status for Lot #{record.lot_id} {record.niche_number ? `(niche ${record.niche_number})` : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-2">
              <Label htmlFor="lot-status">Lot Status</Label>
              <Controller
                name="lot_status"
                control={form.control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="lot-status" className="w-full">
                      <SelectValue placeholder="Select lot status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
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
      {record && <PrintableLotOwnerDetails ref={contentRef} lotOwner={record} />}
    </>
  )
}
