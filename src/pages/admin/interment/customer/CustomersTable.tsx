"use client";

import * as React from "react";
import { ChevronDown, UserCircle, Columns2, Search, Ghost } from "lucide-react";
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

import type { Customer } from "@/types/interment.types";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { customerColumns } from '@/pages/admin/interment/columns/columns';
import { TableHeader, TableBody, TableCell, TableHead, TableRow, Table } from "@/components/ui/table";
import { SelectContent, SelectTrigger, SelectValue, SelectItem, Select } from "@/components/ui/select";
import {
    DropdownMenuCheckboxItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenu,
} from "@/components/ui/dropdown-menu";

import CreateCustomer from "./CreateCustomer";


interface CustomersTableProps {
    data: Customer[];
}

export default function CustomersTable({ data }: CustomersTableProps) {
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
    const table = useReactTable<Customer>({
        data,
        globalFilterFn,
        columns: customerColumns,
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
                    <UserCircle className="w-6 h-6 text-primary" strokeWidth={2.5} />
                    <h2 className="text-2xl font-bold text-primary">Customer Management</h2>
                </div>
                <p className="text-muted-foreground text-sm">View, search, and manage your customer records.</p>
            </div>
            <div className="flex items-center py-2 gap-4">
                <div className="relative flex items-center rounded-md border focus-within:ring-1 focus-within:ring-ring pl-2 dark:bg-background">
                    <Search className="h-5 w-5 text-muted-foreground dark:bg-background" />
                    <Input
                        className="border-0 focus-visible:ring-0 shadow-none dark:bg-background"
                        onChange={event => { setGlobalFilter(event.target.value); }}
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
                            {table.getAllColumns()
                                .filter(column => column.getCanHide())
                                .map(column => (
                                    <DropdownMenuCheckboxItem
                                        onCheckedChange={value => { column.toggleVisibility(!!value); }}
                                        checked={column.getIsVisible()}
                                        className="capitalize"
                                        key={column.id}
                                    >
                                        {formatColumnName(column.id)}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <CreateCustomer />
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
                                <TableRow data-state={row.getIsSelected() && "selected"} key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>{
                                            flexRender(cell.column.columnDef.cell, cell.getContext())
                                        }</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={customerColumns.length}>
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
            {/* Pagination controls */}
            <div className="flex items-center justify-between px-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                        <Label className="text-sm font-medium">Rows per page</Label>
                        <Select
                            onValueChange={(value) => {
                                table.setPageSize(Number(value))
                            }}
                            value={`${table.getState().pagination.pageSize}`}
                        >
                            <SelectTrigger id="rows-per-page" className="w-20" size="sm">
                                <SelectValue
                                    placeholder={table.getState().pagination.pageSize}
                                />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 25, 30, 40, 50].map(pageSize => (
                                    <SelectItem value={`${pageSize}`} key={pageSize}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button onClick={() => { table.setPageIndex(0); }} disabled={!table.getCanPreviousPage()} className="hidden size-8 lg:flex" variant="outline" size="icon">
                            <span className="sr-only">Go to first page</span>
                            {/* ChevronsLeft icon */}
                            <svg stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" height="16" fill="none" width="16"><path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" /></svg>
                        </Button>
                        <Button onClick={() => { table.previousPage(); }} disabled={!table.getCanPreviousPage()} className="size-8" variant="outline" size="icon">
                            <span className="sr-only">Go to previous page</span>
                            {/* ChevronLeft icon */}
                            <svg stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" height="16" fill="none" width="16"><path d="M15 19l-7-7 7-7" /></svg>
                        </Button>
                        <Button onClick={() => { table.nextPage(); }} disabled={!table.getCanNextPage()} className="size-8" variant="outline" size="icon">
                            <span className="sr-only">Go to next page</span>
                            {/* ChevronRight icon */}
                            <svg stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" height="16" fill="none" width="16"><path d="M9 5l7 7-7 7" /></svg>
                        </Button>
                        <Button onClick={() => { table.setPageIndex(table.getPageCount() - 1); }} disabled={!table.getCanNextPage()} className="hidden size-8 lg:flex" variant="outline" size="icon">
                            <span className="sr-only">Go to last page</span>
                            {/* ChevronsRight icon */}
                            <svg stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" height="16" fill="none" width="16"><path d="M13 7l5 5-5 5M6 7l5 5-5 5" /></svg>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}