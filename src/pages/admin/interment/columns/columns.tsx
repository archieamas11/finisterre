import * as React from "react";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ClipboardCopy, Pencil, Eye, Archive } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { LotOwners, Customer, DeceasedRecords } from "@/types/interment.types";

import EditCustomerDialog from "../dialogs/customers-dialog/EditCustomer";
import NewLotOwnerDialog from "../dialogs/lot-dialogs/NewLotOwner";


function capitalizeWords(str: string) {
    return str.replace(/\b\w+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

// Fix: Checkbox with indeterminate state for header
function SelectAllCheckbox({ table }: { table: any }) {
    // Use ref to set indeterminate on the native input
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        if (wrapperRef.current) {
            const input = wrapperRef.current.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
            if (input) {
                input.indeterminate = table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected();
            }
        }
    }, [table.getIsSomePageRowsSelected(), table.getIsAllPageRowsSelected()]);
    return (
        <div ref={wrapperRef}>
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="border-gray-500 dark:border-gray-600"
            />
        </div>
    );
}

export const customerColumns: ColumnDef<Customer>[] = [
    {
        id: "select",
        header: ({ table }) => <SelectAllCheckbox table={table} />,
        cell: ({ row }) => {
            if (!row || typeof row.getIsSelected !== 'function' || typeof row.toggleSelected !== 'function') return null;
            return (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="border-accent dark:border-accent-background"
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
        accessorKey: "religion",
        header: "Religion",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const [open, setOpen] = React.useState(false);
            if (!row || !row.original) return null;
            return (
                <>
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
                            <DropdownMenuItem onClick={() => setOpen(true)}>
                                Edit Customer
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setOpen(true)}>
                                View Customer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 hover:bg-red-100" onClick={() => navigator.clipboard.writeText(row.original.customer_id)}>
                                <Archive className="mr-2 h-4 w-4 text-red-600" />
                                Archive
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <EditCustomerDialog open={open} onOpenChange={setOpen} customer={row.original} />
                </>
            );
        },
    },

];

export const lotOwnerColumns: ColumnDef<LotOwners>[] =
    [
        {
            id: "select",
            header: ({ table }) => <SelectAllCheckbox table={table} />,
            cell: ({ row }) => {
                if (!row || typeof row.getIsSelected !== 'function' || typeof row.toggleSelected !== 'function') return null;
                return (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                        className="border-gray-300 dark:border-gray-600"
                    />
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "lot_id",
            header: "#",
        },
        {
            accessorKey: "customer_name",
            header: "Lot Owner",
        },
        {
            header: "Location",
            accessorFn: (row) =>
                `Block ${(row.block)} • Grave ${row.plot_id}`,
            id: "location",
        },
        {
            accessorKey: "type",
            header: "Type",
        },
        {
            accessorKey: "payment_type",
            header: "Payment Type",
        },
        {
            accessorKey: "payment_frequency",
            header: "Payment Frequency",
        },
        {
            accessorKey: "start_date",
            header: "Start Date",
        },
        {
            accessorKey: "last_payment_date",
            header: "Last Payment Date",
        },
        {
            accessorKey: "next_due_date",
            header: "Next Due Date",
        },
        {
            accessorKey: "lot_status",
            header: "Status",
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                if (!row || !row.original) return null;
                const lotOwners = row.original;
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
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(lotOwners.lot_id)}>
                                <ClipboardCopy className="mr-2 h-4 w-4" />
                                Copy lot owner ID
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit lot owner
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View lot owner detail
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

export const deceasedRecordsColumns: ColumnDef<DeceasedRecords>[] =
    [
        {
            id: "select",
            header: ({ table }) => <SelectAllCheckbox table={table} />,
            cell: ({ row }) => {
                if (!row || typeof row.getIsSelected !== 'function' || typeof row.toggleSelected !== 'function') return null;
                return (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                        className="border-gray-300 dark:border-gray-600"
                    />
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "deceased_id",
            header: "#",
        },
        {
            accessorKey: "dead_fullname",
            header: "Decesed Name",
        },
        {
            accessorKey: "full_name",
            header: "Kin",
        },
        {
            header: "Buried Location",
            accessorFn: (row) =>
                `Block ${(row.block)} • Grave ${row.plot_id} • ${row.type}`,
            id: "location",
        },
        {
            accessorKey: "dead_interment",
            header: "Buried Date",
        },
        {
            accessorKey: "dead_date_death",
            header: "Date of Death",
        },
        {
            header: "Status",
            id: "years_buried",
            cell: ({ row }) => {
                const buriedDateStr = row.original.dead_interment;
                if (!buriedDateStr) return "Unknown";

                const buriedDate = new Date(buriedDateStr);
                const now = new Date();

                const yearsBuried = now.getFullYear() - buriedDate.getFullYear();
                const monthDiff = now.getMonth() - buriedDate.getMonth();
                const dayDiff = now.getDate() - buriedDate.getDate();

                // If less than a full year
                const isLessThanOneYear =
                    yearsBuried < 1 ||
                    (yearsBuried === 1 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)));

                return isLessThanOneYear ? "Less than a year" : `${yearsBuried} year${yearsBuried > 1 ? "s" : ""}`;
            }
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                if (!row || !row.original) return null;
                const deceasedRecord = row.original;
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
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(deceasedRecord.deceased_id)}>
                                <ClipboardCopy className="mr-2 h-4 w-4" />
                                Copy deceased record ID
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit deceased record
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View lot owner detail
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
