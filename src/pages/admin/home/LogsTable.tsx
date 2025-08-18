"use client";

import React from "react";
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

import type { ActivityLog } from "@/api/logs.api";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { SearchIcon } from "lucide-react";
import { logsColumns } from "./LogsColumns";
import { Button } from "@/components/ui/button";
import { PrinterIcon } from "lucide-react";

interface LogsTableProps {
  data: ActivityLog[];
}

export default function LogsTable({ data }: LogsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const globalFilterFn = React.useCallback((row: any, _columnId: string, filterValue: string) => {
    if (!filterValue) return true;
    const q = String(filterValue).toLowerCase().trim();
    const l = row.original as ActivityLog;
    if (!l) return true;
    const id = String(l.log_id);
    const user = (l.username ?? String(l.user_id)).toLowerCase();
    const action = String(l.action).toLowerCase();
    const target = String(l.target ?? "").toLowerCase();
    const details = String(l.details ?? "").toLowerCase();
    return id.includes(q) || user.includes(q) || action.includes(q) || target.includes(q) || details.includes(q);
  }, []);

  const table = useReactTable<ActivityLog>({
    data,
    globalFilterFn,
    columns: logsColumns,
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
        <div className="flex w-full flex-col justify-between gap-2 sm:flex-row">
          <div className="relative flex items-center gap-2">
            <Input
              className="peer h-8 ps-9 pe-3"
              onChange={(event) => {
                table.setGlobalFilter(event.target.value);
              }}
              placeholder="Search logs..."
              type="search"
            />
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
  );
}
