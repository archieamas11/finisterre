import type { NewsItem } from '@/types/news.types'
import type { ColumnFiltersState, Row, RowSelectionState, SortingState, VisibilityState } from '@tanstack/react-table'
import React from 'react'
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { ArrowRightIcon, SearchIcon } from 'lucide-react'

import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { newsColumns } from './columns/NewsColumns'
import CreateNewsDialog from './modal/CreateNewsDialog'

interface NewsTableProps {
  data: NewsItem[]
}

export default function NewsTable({ data }: NewsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)

  const [globalFilter, setGlobalFilter] = React.useState('')
  const globalFilterFn = React.useCallback((row: Row<NewsItem>, _columnId: string, filterValue: string) => {
    if (!filterValue) return true
    if (!row.original || typeof row.original !== 'object') return true
    const haystack = Object.values(row.original as unknown as Record<string, unknown>)
      .map((value) => {
        if (typeof value === 'string') return value.toLowerCase()
        if (typeof value === 'boolean') return value ? 'true' : 'false'
        return null
      })
      .filter(Boolean) as string[]

    const needle = filterValue.toLowerCase()
    return haystack.some((val) => val.includes(needle))
  }, [])

  const table = useReactTable({
    data,
    columns: newsColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    globalFilterFn,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  const summary = React.useMemo(() => {
    return data.reduce(
      (acc, item) => {
        acc.total += 1
        acc.status[item.status] = (acc.status[item.status] ?? 0) + 1
        if (item.is_featured) {
          acc.featured += 1
        }
        return acc
      },
      {
        total: 0,
        featured: 0,
        status: {
          draft: 0,
          scheduled: 0,
          published: 0,
          archived: 0,
        } as Record<NewsItem['status'], number>,
      },
    )
  }, [data])

  const summaryBadges = React.useMemo(
    () => [
      { label: 'Total', value: summary.total, className: 'bg-slate-100 text-slate-700' },
      { label: 'Published', value: summary.status.published, className: 'bg-emerald-100 text-emerald-700' },
      { label: 'Scheduled', value: summary.status.scheduled, className: 'bg-amber-100 text-amber-800' },
      { label: 'Drafts', value: summary.status.draft, className: 'bg-slate-200 text-slate-700' },
      { label: 'Archived', value: summary.status.archived, className: 'bg-rose-100 text-rose-800' },
      { label: 'Featured', value: summary.featured, className: 'bg-yellow-100 text-yellow-800' },
    ],
    [summary.featured, summary.status.archived, summary.status.draft, summary.status.published, summary.status.scheduled, summary.total],
  )

  return (
    <Card className="p-4">
      <div className="mb-4 flex flex-wrap gap-2">
        {summaryBadges.map((item) => (
          <Badge key={item.label} className={cn('gap-1 rounded-full px-3 py-1 text-xs font-medium', item.className)}>
            <span>{item.label}</span>
            <span className="font-semibold">{item.value}</span>
          </Badge>
        ))}
      </div>
      <DataTableToolbar table={table}>
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Input
              className="peer h-8 ps-9 pe-9"
              value={globalFilter}
              onChange={(event) => {
                table.setGlobalFilter(event.target.value)
                setGlobalFilter(event.target.value)
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
          <div>
            <Button variant="outline" size={'sm'} onClick={() => setIsCreateDialogOpen(true)}>
              Create News
            </Button>
          </div>
        </div>
      </DataTableToolbar>

      <DataTable table={table} />

      <CreateNewsDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </Card>
  )
}
