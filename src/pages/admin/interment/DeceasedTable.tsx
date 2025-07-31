"use client";
import * as React from "react";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    type SortingState,
    type ColumnFiltersState,
    type VisibilityState,
    type RowSelectionState,
} from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DeceasedRecords } from "@/types/interment.types";
import { ChevronDown, Columns2, Ghost, Search, SkullIcon } from "lucide-react";
import { deceasedRecordsColumns } from "./columns/columns";

interface DeceasedRecordsTableProps {
    data: DeceasedRecords[];
}

export default function DeceasedRecordsTable({ data }: DeceasedRecordsTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

    const [globalFilter, setGlobalFilter] = React.useState("");
    const globalFilterFn = React.useCallback((row: any, _columnId: string, filterValue: string) => {
        if (!filterValue) return true;
        if (!row.original || typeof row.original !== "object") return true;
        return Object.values(row.original).some(val =>
            typeof val === "string" && val.toLowerCase().includes(filterValue.toLowerCase())
        );
    }, []);
    // FIX: use correct type for useReactTable
    const table = useReactTable<DeceasedRecords>({
        data,
        columns: deceasedRecordsColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        globalFilterFn,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
    });
    // Helper function to format column names
    function formatColumnName(name: string): string {
        return name
            .replace(/_/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());
    }
    return (
        <div>
            <div className="flex flex-col mb-2">
                <div className="flex items-center gap-2">
                    <SkullIcon strokeWidth={2.5} className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold text-primary">Deceased Records Management</h2>
                </div>
                <p className="text-muted-foreground text-sm">View, search, and manage your deceased records.</p>
            </div>
            <div className="flex items-center py-2">
                <div className="relative flex items-center rounded-md border focus-within:ring-1 focus-within:ring-ring pl-2 dark:bg-background">
                    <Search className="h-5 w-5 text-muted-foreground dark:bg-background" />
                    <Input
                        placeholder="Search..."
                        value={globalFilter}
                        onChange={event => setGlobalFilter(event.target.value)}
                        className="border-0 focus-visible:ring-0 shadow-none dark:bg-background"
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
                        <DropdownMenuContent align="end" className="w-[150px]">
                            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {table.getAllColumns()
                                .filter(column => column.getCanHide())
                                .map(column => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={value => column.toggleVisibility(!!value)}
                                    >
                                        {formatColumnName(column.id)}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader className="bg-sidebar-accent">
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={deceasedRecordsColumns.length}>
                                    <div className="flex flex-col items-center justify-center gap-1 py-10 text-sm text-muted-foreground">
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