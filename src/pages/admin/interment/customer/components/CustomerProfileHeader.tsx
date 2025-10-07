import { Printer } from 'lucide-react'
import { BiMessageSquareEdit } from 'react-icons/bi'
import type { Customer } from '@/api/customer.api'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/format'

interface CustomerProfileHeaderProps {
  customer: Customer
  onEditClick: () => void
  onPrintClick: () => void
}

export function CustomerProfileHeader({ customer, onEditClick, onPrintClick }: CustomerProfileHeaderProps) {
  return (
    <div className="bg-primary/5 relative flex flex-col items-center pt-12 pb-6">
      {/* Action Buttons */}
      <div className="absolute top-2 left-2 flex gap-2">
        <Button aria-label="Edit customer" size="icon" variant="ghost" className="gap-1" onClick={onEditClick}>
          <BiMessageSquareEdit />
        </Button>
        <Button aria-label="Print" size="icon" variant="ghost" className="gap-1" onClick={onPrintClick}>
          <Printer />
        </Button>
      </div>

      {/* Avatar */}
      <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full text-lg font-semibold">{customer.first_name.charAt(0)}</div>

      {/* Name */}
      <h2 className="mt-4 text-center text-xl font-bold tracking-tight">
        {customer.first_name}
        {customer.middle_name ? ` ${customer.middle_name}` : ''} {customer.last_name ? ` ${customer.last_name}` : ''}
      </h2>

      {/* Footer Dates */}
      <div className="text-muted-foreground mt-5 flex w-[90%] justify-around rounded-lg border p-3 text-center text-sm">
        <div>
          <div>Created</div>
          <div className="font-medium">{formatDate(customer.created_at ?? undefined)}</div>
        </div>
        <div>
          <div>Last Updated</div>
          <div className="font-medium">{formatDate(customer.updated_at ?? undefined)}</div>
        </div>
      </div>
    </div>
  )
}
