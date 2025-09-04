'use client'

import type { ColumnDef } from '@tanstack/react-table'

import { MoreHorizontal, Archive } from 'lucide-react'
// React import intentionally omitted; JSX runtime handles it
import React from 'react'

import type { DeceasedRecords } from '@/types/interment.types'

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenuSeparator, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuItem, DropdownMenu } from '@/components/ui/dropdown-menu'
import { capitalizeWords } from '@/lib/stringUtils'
import { calculateYearsBuried } from '@/utils/date.utils'

const IndeterminateCheckbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { indeterminate?: boolean }>(({ indeterminate, ...props }, ref) => {
  const localRef = React.useRef<HTMLInputElement>(null)
  const resolvedRef = (ref as React.RefObject<HTMLInputElement>) ?? localRef

  React.useEffect(() => {
    if (resolvedRef.current) {
      resolvedRef.current.indeterminate = Boolean(indeterminate) && !props.checked
    }
  }, [indeterminate, props.checked, resolvedRef])

  return <input ref={resolvedRef} type="checkbox" {...props} />
})
IndeterminateCheckbox.displayName = 'IndeterminateCheckbox'

export const deceasedRecordsColumns: ColumnDef<DeceasedRecords>[] = [
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
      <IndeterminateCheckbox aria-label={`Select row ${row.index + 1}`} checked={row.getIsSelected()} disabled={!row.getCanSelect?.()} onChange={row.getToggleSelectedHandler()} />
    ),
    size: 10,
  },
  {
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    size: 10,
    accessorKey: 'deceased_id',
    meta: { label: 'Deceased ID' },
  },
  {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Deceased Name" />,
    accessorKey: 'dead_fullname',
    cell: ({ row }) =>
      row.original.dead_fullname ? (
        row.original.dead_fullname
      ) : (
        <Badge variant="secondary" asChild={false}>
          <span>N/A</span>
        </Badge>
      ),
    meta: { label: 'Deceased Name' },
  },
  {
    header: ({ column }) => <DataTableColumnHeader column={column} title="kin" />,
    accessorKey: 'full_name',
    cell: ({ row }) =>
      row.original.full_name ? (
        row.original.full_name
      ) : (
        <Badge variant="secondary" asChild={false}>
          <span>N/A</span>
        </Badge>
      ),
    meta: { label: 'Kin Name' },
  },
  {
    id: 'location',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Buried Location" />,
    accessorFn: (row) =>
      row.block && row.plot_id
        ? `Block ${row.block} • Grave ${row.plot_id}`
        : row.category && row.niche_number
          ? `${capitalizeWords(row.category)} • Niche ${row.niche_number}`
          : null,
    cell: ({ row }) => {
      // Show block/plot if present, else category/niche_id, else N/A badge
      if (row.original.block && row.original.plot_id) {
        return `Block ${row.original.block} • Grave ${row.original.plot_id}`
      } else if (row.original.category && row.original.niche_number) {
        return `${capitalizeWords(row.original.category)} • Niche ${row.original.niche_number}`
      } else {
        return (
          <Badge variant="secondary" asChild={false}>
            <span>N/A</span>
          </Badge>
        )
      }
    },
    meta: { label: 'Buried Location' },
  },
  {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Interment Date" />,
    accessorKey: 'dead_interment',
    cell: ({ row }) =>
      row.original.dead_interment ? (
        row.original.dead_interment
      ) : (
        <Badge variant="secondary" asChild={false}>
          <span>N/A</span>
        </Badge>
      ),
  },
  {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    size: 10,
    id: 'years_buried',
    cell: ({ row }) => calculateYearsBuried(row.original.dead_interment),
    meta: { label: 'Years Buried' },
  },
  {
    id: 'actions',
    size: 10,
    enableHiding: false,
    cell: ({ row }) => {
      if (!row?.original) return null
      return (
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
            <DropdownMenuItem>View deceased</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                alert('Archive clicked')
              }}
              className="text-red-600 hover:bg-red-100"
            >
              <Archive className="mr-2 h-4 w-4 text-red-600" />
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
