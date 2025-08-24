import {
  type ColumnFiltersState,
  type RowSelectionState,
  getPaginationRowModel,
  type VisibilityState,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { SearchIcon } from 'lucide-react'
import { PrinterIcon } from 'lucide-react'
import React from 'react'

import type { UserRecord } from '@/api/users.api'

import { getUsers as fetchUsers } from '@/api/users.api'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import { adminUsersColumns } from './AdminUsersColumns'

export default function AdminUsersTable() {
  const [data, setData] = React.useState<UserRecord[]>([])

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [globalFilter, setGlobalFilter] = React.useState('')

  React.useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetchUsers({ isAdmin: 1 })
        if (mounted && res && res.success) {
          setData(res.users ?? [])
        }
      } catch (err) {
        // ignore — backend endpoint may not exist yet
        console.error(err)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const table = useReactTable<UserRecord>({
    data,
    columns: adminUsersColumns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      rowSelection,
      globalFilter,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <Card className="p-4">
      <DataTableToolbar table={table}>
        <div className="flex w-full flex-col justify-between gap-2 sm:flex-row">
          <div className="relative flex items-center gap-2">
            <Input className="peer h-8 ps-9 pe-3" onChange={(event) => table.setGlobalFilter(event.target.value)} placeholder="Search users..." type="search" />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => window.print()}>
              <PrinterIcon size={16} className="me-1" />
              Print
            </Button>
          </div>
        </div>
      </DataTableToolbar>
      <DataTable table={table} />
    </Card>
  )
}
