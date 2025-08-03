"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ClipboardCopy, Pencil, Eye, Archive } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { LotOwners, Customer, DeceasedRecords } from "@/types/interment.types";
import EditCustomerDialog from "@/pages/admin/interment/customer/UpdateCustomer";
import ViewCustomerDialog from "../customer/ViewCustomer";

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
        accessorFn: (row) => capitalizeWords(`${row.first_name} ${row.middle_name} ${row.last_name}`),
        id: "full_name",
    },
    {
        accessorKey: "address",
        header: "Address",
        cell: ({ row }) => row.original.address ? row.original.address : (<Badge variant="secondary" asChild={false}><span>N/A</span></Badge>),
    },
    {
        accessorKey: "contact_number",
        header: "Phone",
        cell: ({ row }) => row.original.contact_number ? row.original.contact_number : (<Badge variant="secondary" asChild={false}><span>N/A</span></Badge>),
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => row.original.email ? row.original.email : (<Badge variant="secondary" asChild={false}><span>N/A</span></Badge>),
    },
    {
        id: "actions",
        header: "Action",
        enableHiding: false,
        cell: ({ row }) => {
            const [open, setOpen] = React.useState(false);
            const [viewOpen, setViewOpen] = React.useState(false);
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
                            <DropdownMenuItem onClick={() => setViewOpen(true)}>
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
                    <ViewCustomerDialog open={viewOpen} onOpenChange={setViewOpen} customer={row.original} />
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
            cell: ({ row }) => row.original.lot_id ? row.original.lot_id : (<Badge variant="secondary" asChild={false}><span>N/A</span></Badge>),
        },
        {
            accessorKey: "customer_name",
            header: "Lot Owner",
            cell: ({ row }) => row.original.customer_name ? row.original.customer_name : (<Badge variant="secondary" asChild={false}><span>N/A</span></Badge>),
        },
        {
            header: "Location",
            accessorFn: (row) =>
                row.block && row.plot_id
                    ? `Block ${row.block} • Grave ${row.plot_id}`
                    : (row.category && row.niche_id
                        ? `${row.category} • Niche ${row.niche_id}`
                        : null),
            id: "location",
            cell: ({ row }) => {
                // 🧩 Show block/plot if present, else category/niche_id, else N/A badge
                if (row.original.block && row.original.plot_id) {
                    return `Block ${row.original.block} • Grave ${row.original.plot_id}`;
                }
                if (row.original.category && row.original.niche_id) {
                    return `${row.original.category} ${row.original.plot_id} • Niche ${row.original.niche_number}`;
                }
                return (<Badge variant="secondary" asChild={false}><span>N/A</span></Badge>);
            },
        },
        {
            accessorKey: "lot_status",
            header: "Status",
            cell: ({ row }) => {
                // 🟡 Show colored badge based on status value
                const status = row.original.lot_status?.toLowerCase();
                if (!status) {
                    return (<Badge variant="secondary" asChild={false}><span>N/A</span></Badge>);
                }
                if (status === "active") {
                    return (<Badge className="bg-yellow-400 text-black" asChild={false}><span>Active</span></Badge>);
                }
                if (status === "canceled") {
                    return (<Badge className="bg-red-500 text-white" asChild={false}><span>Canceled</span></Badge>);
                }
                if (status === "completed") {
                    return (<Badge className="bg-green-500 text-white" asChild={false}><span>Completed</span></Badge>);
                }
                return (<Badge variant="secondary" asChild={false}><span>{row.original.lot_status}</span></Badge>);
            },
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => {
                // const [openLot, setOpenLot] = React.useState(false);
                if (!row || !row.original) return null;
                return (
                    <><DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="z-50">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                Edit lot owner
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                View lot owner
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 hover:bg-red-100" onClick={() => navigator.clipboard.writeText(row.original.customer_id)}>
                                <Archive className="mr-2 h-4 w-4 text-red-600" />
                                Archive
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </>
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
            cell: ({ row }) => row.original.dead_fullname ? row.original.dead_fullname : (<Badge variant="secondary" asChild={false}><span>N/A</span></Badge>),
        },
        {
            accessorKey: "full_name",
            header: "Kin",
            cell: ({ row }) => row.original.full_name ? row.original.full_name : (<Badge variant="secondary" asChild={false}><span>N/A</span></Badge>),
        },
        {
            header: "Buried Location",
            accessorFn: (row) =>
                row.block && row.plot_id && row.type
                    ? `Block ${(row.block)} • Grave ${row.plot_id} • ${row.type}`
                    : null,
            id: "location",
            cell: ({ row }) => {
                const value = row.original.block && row.original.plot_id && row.original.type
                    ? `Block ${row.original.block} • Grave ${row.original.plot_id} • ${row.original.type}`
                    : null;
                return value ? value : (<Badge variant="secondary" asChild={false}><span>N/A</span></Badge>);
            },
        },
        {
            accessorKey: "dead_interment",
            header: "Buried Date",
            cell: ({ row }) => row.original.dead_interment ? row.original.dead_interment : (<Badge variant="secondary" asChild={false}><span>N/A</span></Badge>),
        },
        {
            accessorKey: "dead_date_death",
            header: "Date of Death",
            cell: ({ row }) => row.original.dead_date_death ? row.original.dead_date_death : (<Badge variant="secondary" asChild={false}><span>N/A</span></Badge>),
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
