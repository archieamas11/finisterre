import type { ColumnDef } from '@tanstack/react-table'

import { BadgeCheckIcon, PencilIcon, TrashIcon, ArchiveIcon, LogInIcon, PlusIcon } from 'lucide-react'
import { AiOutlineUser } from 'react-icons/ai'

import type { ActivityLog } from '@/api/logs.api'

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { ucwords } from '@/lib/format'

import LogActionsCell from './LogActionsCell'
const actionConfig = {
  add: {
    icon: PlusIcon,
    variant: 'outline' as const,
    className: 'border-blue-500 text-blue-500',
  },
  update: {
    icon: PencilIcon,
    variant: 'outline' as const,
    className: 'text-green-700 border-green-600',
  },
  delete: {
    icon: TrashIcon,
    variant: 'outline' as const,
    className: 'text-destructive border-destructive',
  },
  archive: {
    icon: ArchiveIcon,
    variant: 'outline' as const,
    className: 'text-destructive border-destructive',
  },
  login: {
    icon: LogInIcon,
    variant: 'outline' as const,
    className: '',
  },
}

export const getLogsColumns = (users: { username: string }[]): ColumnDef<ActivityLog>[] => [
  {
    accessorKey: 'log_id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    meta: { label: 'ID' },
    size: 10,
  },
  {
    id: 'user',
    header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
    accessorFn: (row) => row.username ?? String(row.user_id),
    cell: ({ row }) => (
      <span className="flex items-center gap-2 truncate" title={row.original.username ?? String(row.original.user_id)}>
        <div className="bg-muted flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-sm font-medium" aria-hidden="true">
          <AiOutlineUser size={12} />
        </div>{' '}
        {ucwords(row.original.username ?? '')}
      </span>
    ),
    meta: {
      label: 'User',
      variant: 'select',
      options: [...new Set(users.map((u) => u.username))].map((username) => ({
        label: ucwords(username),
        value: username,
      })),
    },
  },
  {
    accessorKey: 'action',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
    cell: ({ row }) => {
      const action = row.original.action?.toLowerCase()
      if (action && action in actionConfig) {
        const config = actionConfig[action as keyof typeof actionConfig]
        const Icon = config.icon

        return (
          <Badge variant={config.variant} className={config.className}>
            <Icon className="mr-1 h-3 w-3" />
            {row.original.action}
          </Badge>
        )
      }
      const config = { icon: BadgeCheckIcon, variant: 'outline' as const }
      const Icon = config.icon

      return (
        <Badge variant={config.variant}>
          <Icon />
          {row.original.action}
        </Badge>
      )
    },
    meta: {
      label: 'Action',
      variant: 'select',
      options: [
        { label: 'Add', value: 'add' },
        { label: 'Update', value: 'update' },
        { label: 'Delete', value: 'delete' },
        { label: 'Archive', value: 'archive' },
        { label: 'Login', value: 'login' },
      ],
    },
  },
  {
    accessorKey: 'target',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Target" />,
    meta: { label: 'Target' },
  },
  {
    accessorKey: 'details',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Details" />,
    cell: ({ row }) => (
      <span className="max-w-[24rem] truncate" title={row.original.details ?? '-'}>
        {row.original.details ?? '-'}
      </span>
    ),
    meta: { label: 'Details' },
  },
  {
    id: 'created_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title="When" />,
    accessorFn: (row) => new Date(row.created_at).getTime(),
    cell: ({ row }) => {
      const d = new Date(row.original.created_at)
      const fmt = isNaN(d.getTime()) ? String(row.original.created_at) : d.toLocaleString()
      return <span title={String(row.original.created_at)}>{fmt}</span>
    },
    enableSorting: true,
    filterFn: (row, _columnId, filterValue) => {
      if (!filterValue) return true
      const rowDate = new Date(row.getValue('created_at'))
      const filterDate = new Date(filterValue)
      return (
        rowDate.getFullYear() === filterDate.getFullYear() &&
        rowDate.getMonth() === filterDate.getMonth() &&
        rowDate.getDate() === filterDate.getDate()
      )
    },
    meta: {
      label: 'When',
      variant: 'date',
      print: (row: ActivityLog) => {
        const d = new Date(row.created_at)
        return isNaN(d.getTime()) ? String(row.created_at) : d.toLocaleString()
      },
    } as never,
  },
  { id: 'actions', size: 10, enableHiding: false, cell: ({ row }) => <LogActionsCell row={row} /> },
]
