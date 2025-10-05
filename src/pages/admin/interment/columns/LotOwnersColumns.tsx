import type { ColumnDef } from '@tanstack/react-table'

import { MapPin } from 'lucide-react'
import React from 'react'
import { AiOutlineUser } from 'react-icons/ai'

import type { LotOwners } from '@/types/interment.types'

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Badge } from '@/components/ui/badge'

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

export const lotOwnerColumns: ColumnDef<LotOwners>[] = [
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
    accessorKey: 'lot_id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    meta: { label: 'ID' },
  },
  {
    id: 'customer_name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Lot Owner" />,
    accessorFn: (row) => `${row.customer_name}`,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="bg-muted flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium">
            <AiOutlineUser size={14} />
          </div>
          <span>{row.original.customer_name}</span>
        </div>
      )
    },
    meta: { label: 'Full Name' },
  },

  {
    id: 'location',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Location" />,
    accessorFn: (row) =>
      row.block && row.plot_id
        ? `Block ${row.block} • Grave ${row.plot_id}`
        : row.category && row.niche_number
          ? `${row.category} ${row.plot_id} • Niche ${row.niche_number}`
          : null,
    cell: ({ row }) => {
      if (row.original.block && row.original.plot_id) {
        return (
          <div className="flex items-center gap-2">
            <div className="bg-muted flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium">
              <MapPin size={14} />
            </div>
            Block {row.original.block} • Grave {row.original.plot_id}
          </div>
        )
      } else if (row.original.category && row.original.niche_number) {
        return (
          <div className="flex items-center gap-2">
            <div className="bg-muted flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium">
              <MapPin size={14} />
            </div>
            {row.original.category} {row.original.plot_id} • Niche {row.original.niche_number}
          </div>
        )
      }
      return null
    },
    meta: { label: 'Location' },
  },
  {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    accessorKey: 'lot_status',
    cell: ({ row }) => {
      const status = row.original.lot_status
      if (status === 'active') {
        return (
          <Badge className="bg-yellow-200 text-yellow-800">
            <span className="text-xs text-yellow-800">Active</span>
          </Badge>
        )
      }
      if (status === 'cancelled') {
        return (
          <Badge className="bg-rose-200 text-rose-800" asChild={false}>
            <span className="text-xs text-rose-800">Canceled</span>
          </Badge>
        )
      }
      if (status === 'completed') {
        return (
          <Badge className="bg-emerald-200 text-emerald-800" asChild={false}>
            <span className="text-xs text-emerald-800">Completed</span>
          </Badge>
        )
      }
      return (
        <Badge variant="outline" asChild={false}>
          <span>{row.original.lot_status}</span>
        </Badge>
      )
    },
    meta: {
      label: 'Status',
      variant: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Canceled', value: 'canceled' },
        { label: 'Completed', value: 'completed' },
      ],
    },
  },
]
