"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ClipboardCopy, Pencil, Eye } from "lucide-react";

export type Customer = {
    select: boolean;
    customer_id: string;
    first_name: string;
    last_name: string;
    email: string;
    contact_number: string;
    address: string;
    status?: string;
};

function capitalizeWords(str: string) {
    return str.replace(/\b\w+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

// Fix: Checkbox with indeterminate state for header
import * as React from "react";
function SelectAllCheckbox({ table }: { table: any }) {
    const ref = React.useRef<HTMLButtonElement>(null);
    React.useEffect(() => {
        if (ref.current) {
            // @ts-ignore
            ref.current.indeterminate = table.getIsSomePageRowsSelected();
        }
    }, [table.getIsSomePageRowsSelected()]);
    return (
        <Checkbox
            ref={ref}
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
        />
    );
}

export const columns: ColumnDef<Customer>[] = [
    {
        id: "select",
        header: ({ table }) => <SelectAllCheckbox table={table} />,
        cell: ({ row }) => {
            // Defensive: Only render Checkbox if row exists
            if (!row || typeof row.getIsSelected !== 'function' || typeof row.toggleSelected !== 'function') return null;
            return (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "customer_id",
        header: "#",
    },
    {
        header: "Full Name",
        accessorFn: (row) => capitalizeWords(`${row.first_name} ${row.last_name}`),
        id: "full_name",
    },
    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "contact_number",
        header: "Phone",
        cell: ({ row }) => row.original.contact_number ?? "",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            // Defensive: Only render DropdownMenu if row and row.original exist
            if (!row || !row.original) return null;
            const customers = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="z-50">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(customers.customer_id)}>
                            <ClipboardCopy className="mr-2 h-4 w-4" />
                            Copy customer ID
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit customer
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View customer detail
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },

];