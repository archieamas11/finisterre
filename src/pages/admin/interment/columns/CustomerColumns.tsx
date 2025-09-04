import type { ColumnDef } from '@tanstack/react-table'

import { Mail, MapPinHouse, Phone } from 'lucide-react'
import React from 'react'
import { AiOutlineUser } from 'react-icons/ai'

import { type Customer } from '@/api/customer.api'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import CustomerActionsCell from '@/pages/admin/interment/columns/CustomerActionsCell'

const IndeterminateCheckbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { indeterminate?: boolean }>(
  ({ indeterminate, ...props }, ref) => {
    const localRef = React.useRef<HTMLInputElement>(null)
    const resolvedRef = (ref as React.RefObject<HTMLInputElement>) ?? localRef

    React.useEffect(() => {
      if (resolvedRef.current) {
        resolvedRef.current.indeterminate = Boolean(indeterminate) && !props.checked
      }
    }, [indeterminate, props.checked, resolvedRef])

    return <input ref={resolvedRef} type="checkbox" {...props} />
  },
)
IndeterminateCheckbox.displayName = 'IndeterminateCheckbox'

export const customerColumns: ColumnDef<Customer>[] = [
  {
    id: 'select',
    header: ({ table: tbl }) => (
      <IndeterminateCheckbox
        aria-label="Select all rows"
        checked={tbl.getIsAllPageRowsSelected()}
        indeterminate={tbl.getIsSomePageRowsSelected()}
        onChange={tbl.getToggleAllPageRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <IndeterminateCheckbox
        aria-label={`Select row ${row.index + 1}`}
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect?.()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
    size: 10,
  },
  {
    size: 10,
    accessorKey: 'customer_id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    meta: { label: 'ID' },
  },
  {
    id: 'full_name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Full Name" />,
    accessorFn: (row) => [row.first_name, row.middle_name, row.last_name].filter(Boolean).join(' '),
    cell: ({ row }) => {
      const fullName = String(row.getValue('full_name'))
      return (
        <div className="flex items-center gap-2">
          <div className="bg-muted flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-medium" aria-hidden="true">
            <AiOutlineUser size={14} />
          </div>
          <span title={fullName} className="max-w-[14rem] truncate">
            {fullName}
          </span>
        </div>
      )
    },
    meta: { label: 'Full Name' },
  },
  {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Address" />,
    accessorKey: 'address',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="bg-muted flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium">
            <MapPinHouse size={14} />
          </div>
          <span>{row.original.address}</span>
        </div>
      )
    },
    meta: { label: 'Address' },
  },
  {
    accessorKey: 'contact_number',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="bg-muted flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium">
            <Phone size={14} />
          </div>
          <span>{row.original.contact_number}</span>
        </div>
      )
    },
    meta: { label: 'Phone Number' },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    enableSorting: true,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="bg-muted flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium">
            <Mail size={14} />
          </div>
          <span>{row.original.email}</span>
        </div>
      )
    },
    meta: { label: 'Email' },
  },
  {
    id: 'lot_count',
    size: 10,
    header: ({ column }) => (
      <div className="flex justify-center">
        <DataTableColumnHeader column={column} title="Lot" />
      </div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
    accessorFn: (row) => (Array.isArray(row.lot_info) ? row.lot_info.length : 0),
    cell: ({ row }) => {
      const count = Array.isArray(row.original.lot_info) ? row.original.lot_info.length : 0
      return (
        <div className="flex justify-center">
          <Badge variant={count > 0 ? 'secondary' : 'outline'}>{count}</Badge>
        </div>
      )
    },
    filterFn: (row, _id, value) => {
      const selected = Array.isArray(value) ? value : []
      if (selected.length === 0) return true
      const count = Array.isArray((row.original as Customer).lot_info) ? (row.original as Customer).lot_info!.length : 0
      const hasLot = count > 0
      return selected.some((v: string) => (v === 'yes' ? hasLot : !hasLot))
    },
    meta: {
      label: 'Lot Owned',
      variant: 'select',
      options: [
        { label: 'Has Lot', value: 'yes' },
        { label: 'No Lot', value: 'no' },
      ],
    },
  },
  {
    id: 'deceased_count',
    size: 10,
    header: ({ column }) => (
      <div className="flex justify-center">
        <DataTableColumnHeader column={column} title="Deceased" />
      </div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
    accessorFn: (row) => {
      if (!Array.isArray(row.lot_info)) return 0
      return row.lot_info.reduce((total, lot) => {
        return total + (Array.isArray(lot.deceased_info) ? lot.deceased_info.length : 0)
      }, 0)
    },
    cell: ({ row }) => {
      const count = Array.isArray(row.original.lot_info)
        ? row.original.lot_info.reduce((total, lot) => {
            return total + (Array.isArray(lot.deceased_info) ? lot.deceased_info.length : 0)
          }, 0)
        : 0
      return (
        <div className="flex justify-center">
          <Badge variant={count > 0 ? 'secondary' : 'outline'}>{count}</Badge>
        </div>
      )
    },
    filterFn: (row, _id, value) => {
      const selected = Array.isArray(value) ? value : []
      if (selected.length === 0) return true
      const count = Array.isArray((row.original as Customer).lot_info)
        ? (row.original as Customer).lot_info!.reduce((total, lot) => {
            return total + (Array.isArray(lot.deceased_info) ? lot.deceased_info.length : 0)
          }, 0)
        : 0
      const hasDeceased = count > 0
      return selected.some((v: string) => (v === 'yes' ? hasDeceased : !hasDeceased))
    },
    meta: {
      label: 'Deceased',
      variant: 'select',
      options: [
        { label: 'Has Deceased', value: 'yes' },
        { label: 'No Deceased', value: 'no' },
      ],
    },
  },
  {
    id: 'actions',
    size: 10,
    enableHiding: false,
    cell: ({ row }) => <CustomerActionsCell row={row} />,
  },
]
