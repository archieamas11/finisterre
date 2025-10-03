import type { ColumnDef } from '@tanstack/react-table'

import { AiOutlineUser } from 'react-icons/ai'

import type { UserData } from '@/types/user.types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { ucwords } from '@/lib/format'
import { Archive, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const adminUsersColumns: ColumnDef<UserData>[] = [
  {
    accessorKey: 'user_id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    size: 10,
    meta: { label: 'ID' },
  },
  {
    id: 'username',
    size: 100,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Username" />,
    accessorFn: (row) => row.username,
    cell: ({ row }) => (
      <span className="flex items-center gap-2 truncate" title={row.original.username}>
        <div className="bg-muted flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-sm font-medium" aria-hidden="true">
          <AiOutlineUser size={12} />
        </div>
        {ucwords(row.original.username)}
      </span>
    ),
    meta: { label: 'Username' },
  },
  {
    accessorKey: 'isAdmin',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => <Badge variant="outline">{row.original.isAdmin === 1 ? 'Admin' : 'User'}</Badge>,
    meta: { label: 'Role' },
  },
  {
    id: 'created_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    accessorFn: (row) => (row.created_at ? new Date(row.created_at).getTime() : 0),
    cell: ({ row }) => {
      const raw = row.original.created_at
      const d = raw ? new Date(raw) : null
      const fmt = d && !isNaN(d.getTime()) ? d.toLocaleString() : String(raw ?? '-')
      return <span title={String(raw ?? '-')}>{fmt}</span>
    },
    enableSorting: true,
    meta: { label: 'Created' },
  },
  {
    id: 'actions',
    size: 10,
    enableHiding: false,
    cell: ({ row }) => {
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
              {/* TODO: Add user functionality */}
              <DropdownMenuItem onClick={() => alert('View user functionality not implemented yet.')}>View User</DropdownMenuItem>

              {/* TODO: Edit user functionality */}
              <DropdownMenuItem onClick={() => alert('Edit user functionality not implemented yet.')}>Edit User</DropdownMenuItem>
              <DropdownMenuSeparator />

              {/* TODO: Archive user functionality */}
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.username)} className="text-red-600 hover:bg-red-100">
                <Archive className="mr-2 h-4 w-4 text-red-600" />
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )
    },
  },
]
