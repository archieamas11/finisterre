import type { Row } from '@tanstack/react-table'
import { Archive, MoreHorizontal } from 'lucide-react'
import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import type { Customer } from '@/api/customer.api'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import EditCustomerDialog from '@/pages/admin/interment/customer/UpdateCustomer'
import ViewCustomerDialog from '@/pages/admin/interment/customer/ViewCustomer'
import { PrintableCustomerDetails } from '@/pages/admin/interment/customer/components'

export default function CustomerActionsCell({ row }: { row: Row<Customer> }) {
  const [open, setOpen] = React.useState(false)
  const [viewOpen, setViewOpen] = React.useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const reactToPrintFn = useReactToPrint({ contentRef })

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
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(row.original.customer_id))} className="text-red-600 hover:bg-red-100">
            <Archive className="mr-2 h-4 w-4 text-red-600" />
            Archive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditCustomerDialog customer={row.original} onOpenChange={setOpen} open={open} />
      <ViewCustomerDialog onOpenChange={setViewOpen} customer={row.original} open={viewOpen} />

      {/* Hidden printable content for Quick Print */}
      <PrintableCustomerDetails ref={contentRef} customer={row.original} />
    </>
  )
}
