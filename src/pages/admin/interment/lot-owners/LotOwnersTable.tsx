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
  type Row,
} from '@tanstack/react-table'
import { ArrowRightIcon, SearchIcon, PrinterIcon } from 'lucide-react'
import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import type { LotOwners } from '@/types/interment.types'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { PrintableTable } from '@/components/printable-table'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { lotOwnerColumns } from '../columns/LotOwnersColumns'

interface LotOwnersTableProps {
  data: LotOwners[]
}

export default function LotOwnersTable({ data }: LotOwnersTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  const [globalFilter, setGlobalFilter] = React.useState('')
  const globalFilterFn = React.useCallback((row: Row<LotOwners>, _columnId: string, filterValue: string) => {
    if (!filterValue) return true
    if (!row.original || typeof row.original !== 'object') return true
    return Object.values(row.original as unknown as Record<string, unknown>).some(
      (val) => typeof val === 'string' && val.toLowerCase().includes(filterValue.toLowerCase()),
    )
  }, [])

  const contentRef = useRef<HTMLDivElement>(null)
  const reactToPrintFn = useReactToPrint({ contentRef })

  const table = useReactTable<LotOwners>({
    data,
    globalFilterFn,
    columns: lotOwnerColumns,
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
          <div className="relative">
            <Input
              className="peer h-8 ps-9 pe-9"
              onChange={(event) => {
                table.setGlobalFilter(event.target.value)
              }}
              placeholder="Search..."
              type="search"
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
            <button
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Submit search"
              type="submit"
            >
              <ArrowRightIcon size={16} aria-hidden="true" />
            </button>
          </div>
          <Button size={'sm'} variant="outline" onClick={reactToPrintFn}>
            <PrinterIcon />
            Print
          </Button>
        </div>
      </DataTableToolbar>

      <DataTable table={table} />

      <PrintableTable ref={contentRef} table={table} title="Lot Owners Report" subtitle="Finisterre Cemetery Management System" />
    </Card>
  )
}
