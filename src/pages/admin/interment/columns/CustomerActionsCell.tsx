import type { Customer } from '@/api/customer.api'
import type { Row } from '@tanstack/react-table'
import React, { useRef } from 'react'
import { Archive, MoreHorizontal } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useArchiveCustomer } from '@/hooks/customer-hooks/customer.hooks'
import { PrintableCustomerDetails } from '@/pages/admin/interment/customer/components'
import EditCustomerDialog from '@/pages/admin/interment/customer/UpdateCustomer'
import ViewCustomerDialog from '@/pages/admin/interment/customer/ViewCustomer'

export default function CustomerActionsCell({ row }: { row: Row<Customer> }) {
  const [open, setOpen] = React.useState(false)
  const [viewOpen, setViewOpen] = React.useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const reactToPrintFn = useReactToPrint({ contentRef })
  const archiveCustomerMutation = useArchiveCustomer()

  async function handleArchive() {
    if (!confirm(`Archive customer ${row.original.customer_id}?`)) return
    await toast.promise(archiveCustomerMutation.mutateAsync(row.original.customer_id), {
      loading: 'Archiving customer...',
      success: 'Customer archived successfully!',
      error: 'Failed to archive customer. Please try again.',
    })
  }

  if (!row?.original) return null
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
          <DropdownMenuItem
            onClick={() => {
              setOpen(true)
            }}
          >
            Edit Customer
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setViewOpen(true)
            }}
          >
            View Customer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={reactToPrintFn}>Quick Print</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleArchive} className="text-red-600 hover:bg-red-100">
            <Archive className="mr-2 h-4 w-4 text-red-600" />
            Archive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditCustomerDialog customer={row.original} onOpenChange={setOpen} open={open} />
      <ViewCustomerDialog onOpenChange={setViewOpen} customer={row.original} open={viewOpen} />
      <PrintableCustomerDetails ref={contentRef} customer={row.original} />
    </>
  )
}
