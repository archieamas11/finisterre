"use client";
import * as React from "react";
import {
  ChevronDown,
  SkullIcon,
  Columns2,
  Search,
  Ghost,
  Plus,
} from "lucide-react";
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
  flexRender,
} from "@tanstack/react-table";

import type { DeceasedRecords } from "@/types/interment.types";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
} from "@/components/ui/table";
import {
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";

import { deceasedRecordsColumns } from "./columns/columns";

interface DeceasedRecordsTableProps {
  data: DeceasedRecords[];
}

export default function DeceasedRecordsTable({
  data,
}: DeceasedRecordsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const [globalFilter, setGlobalFilter] = React.useState("");
  const globalFilterFn = React.useCallback(
    (row: any, _columnId: string, filterValue: string) => {
      if (!filterValue) return true;
      if (!row.original || typeof row.original !== "object") return true;
      return Object.values(row.original).some(
        (val) =>
          typeof val === "string" &&
          val.toLowerCase().includes(filterValue.toLowerCase()),
      );
    },
    [],
  );
  // FIX: use correct type for useReactTable
  const table = useReactTable<DeceasedRecords>({
    data,
    globalFilterFn,
    onSortingChange: setSorting,
    columns: deceasedRecordsColumns,
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
  });
  // Helper function to format column names
  function formatColumnName(name: string): string {
    return name
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
  return (
    <div>
      <div className="mb-2 flex flex-col">
        <div className="flex items-center gap-2">
          <SkullIcon className="text-primary h-6 w-6" strokeWidth={2.5} />
          <h2 className="text-primary text-2xl font-bold">
            Deceased Records Management
          </h2>
        </div>
        <p className="text-muted-foreground text-sm">
          View, search, and manage your deceased records.
        </p>
      </div>
      <div className="flex items-center py-2">
        <div className="focus-within:ring-ring dark:bg-background relative flex items-center rounded-md border pl-2 focus-within:ring-1">
          <Search className="text-muted-foreground dark:bg-background h-5 w-5" />
          <Input
            className="dark:bg-background border-0 shadow-none focus-visible:ring-0"
            onChange={(event) => {
              setGlobalFilter(event.target.value);
            }}
            placeholder="Search..."
            value={globalFilter}
          />
        </div>
        <div className="ml-auto flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="lg">
                <Columns2 className="mr-2 h-4 w-4" />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[150px]" align="end">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    onCheckedChange={(value) => {
                      column.toggleVisibility(!!value);
                    }}
                    checked={column.getIsVisible()}
                    className="capitalize"
                    key={column.id}
                  >
                    {formatColumnName(column.id)}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="lg">
            <Plus className="h-4 w-4" /> Add Deceased Record
          </Button>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-sidebar-accent">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  data-state={row.getIsSelected() && "selected"}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={deceasedRecordsColumns.length}>
                  <div className="text-muted-foreground flex flex-col items-center justify-center gap-1 py-10 text-sm">
                    <Ghost className="mb-1 size-6 opacity-50" />
                    <span>No results found.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
