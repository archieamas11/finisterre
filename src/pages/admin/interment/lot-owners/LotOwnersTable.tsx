"use client";
import React from "react";
import { ArrowRightIcon, SearchIcon } from "lucide-react";
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
} from "@tanstack/react-table";
import type { LotOwners } from "@/types/interment.types";
import { Input } from "@/components/ui/input";
import { lotOwnerColumns } from "../columns/LotOwnersColumns";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Card } from "@/components/ui/card";

interface LotOwnersTableProps {
  data: LotOwners[];
}

export default function LotOwnersTable({ data }: LotOwnersTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const [globalFilter, setGlobalFilter] = React.useState("");
  const globalFilterFn = React.useCallback((row: any, _columnId: string, filterValue: string) => {
    if (!filterValue) return true;
    if (!row.original || typeof row.original !== "object") return true;
    return Object.values(row.original).some((val) => typeof val === "string" && val.toLowerCase().includes(filterValue.toLowerCase()));
  }, []);

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
  });

  return (
    <Card className="p-4">
      <DataTableToolbar table={table}>
        <div className="*:not-first:mt-2">
          <div className="relative">
            <Input
              className="peer h-8 ps-9 pe-9"
              onChange={(event) => {
                table.setGlobalFilter(event.target.value);
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
        </div>
      </DataTableToolbar>

      <DataTable table={table} />
    </Card>
  );
}
