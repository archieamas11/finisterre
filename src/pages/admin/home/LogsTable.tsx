import type { ActivityLog } from '@/api/logs.api'
import type { ColumnFiltersState, Row, RowSelectionState, SortingState, VisibilityState } from '@tanstack/react-table'
import React from 'react'
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { PrinterIcon, SearchIcon } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'

import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { PrintableTable } from '@/components/printable-table'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { getLogsColumns } from './LogsColumns'

interface LogsTableProps {
  data: ActivityLog[]
}

export default function LogsTable({ data }: LogsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [globalFilter, setGlobalFilter] = React.useState('')
  const contentRef = React.useRef<HTMLDivElement>(null)

  const columns = React.useMemo(() => {
    const users = [...new Set(data.map((item) => item.username).filter(Boolean) as string[])].map((username) => ({
      username,
    }))
    return getLogsColumns(users)
  }, [data])

  const reactToPrintFn = useReactToPrint({ contentRef })

  const globalFilterFn = React.useCallback((row: Row<ActivityLog>, _columnId: string, filterValue: string) => {
    if (!filterValue) return true
    const q = String(filterValue).toLowerCase().trim()
    const l = row.original as ActivityLog
    if (!l) return true
    const id = String(l.log_id)
    const user = (l.username ?? String(l.user_id)).toLowerCase()
    const action = String(l.action).toLowerCase()
    const target = String(l.target ?? '').toLowerCase()
    const details = String(l.details ?? '').toLowerCase()
    return id.includes(q) || user.includes(q) || action.includes(q) || target.includes(q) || details.includes(q)
  }, [])

  const table = useReactTable<ActivityLog>({
    data,
    globalFilterFn,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    // initialState: {
    //   pagination: {
    //     pageSize: 10,
    //   },
    // },
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
            <Input
              className="peer h-8 ps-9 pe-3"
              onChange={(event) => {
                table.setGlobalFilter(event.target.value)
              }}
              placeholder="Search logs..."
              type="search"
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
            <Button type="button" variant="outline" size="sm" onClick={reactToPrintFn}>
              <PrinterIcon size={16} className="me-1" />
              Print
            </Button>
          </div>
        </div>
      </DataTableToolbar>
      <DataTable table={table} />
      <PrintableTable ref={contentRef} table={table} title="Activity Logs Report" subtitle="Finisterre Cemetery Management System" />
    </Card>
  )
}
