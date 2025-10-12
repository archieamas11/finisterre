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
import { SearchIcon, PrinterIcon, PlusIcon } from 'lucide-react'
import React from 'react'

import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useReactToPrint } from 'react-to-print'
import { PrintableTable } from '@/components/printable-table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { adminUsersColumns } from './AdminUsersColumns'
import AddNewUserDialog from './dialog/AddNewUserDialog'
import { type UserData } from '@/types/user.types'

interface UsersTableProps {
  data: UserData[]
}

export default function AdminUsersTable({ data }: UsersTableProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [globalFilter, setGlobalFilter] = React.useState('')
  const contentRef = React.useRef<HTMLDivElement>(null)
  const reactToPrintFn = useReactToPrint({ contentRef })

  const onUserCreated = () => {
    setIsDialogOpen(false)
  }

  const table = useReactTable({
    data,
    columns: adminUsersColumns(data),
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
            <Input
              className="peer h-8 ps-9 pe-3"
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              placeholder="Search users..."
              type="search"
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>Create a new user account with admin or staff privileges.</DialogDescription>
                </DialogHeader>
                <AddNewUserDialog onSuccess={onUserCreated} onClose={() => setIsDialogOpen(false)} />
              </DialogContent>
            </Dialog>
            <Button type="button" variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
              <PlusIcon className="h-4 w-4" />
              Add New User
            </Button>
            <Button size={'sm'} variant="outline" onClick={reactToPrintFn}>
              <PrinterIcon />
              Print
            </Button>
          </div>
        </div>
      </DataTableToolbar>
      <DataTable table={table} />

      {/* Hidden printable table content */}
      <PrintableTable ref={contentRef} table={table} title="Users Records Report" subtitle="Finisterre Cemetery Management System" />
    </Card>
  )
}
