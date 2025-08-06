"use client";

import type { ColumnDef } from "@tanstack/react-table";

import * as React from "react";
import { MoreHorizontal, Archive, Pencil, Eye } from "lucide-react";

import type {
  DeceasedRecords,
  LotOwners,
  Customer,
} from "@/types/interment.types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { capitalizeWords } from "@/lib/stringUtils";
import EditCustomerDialog from "@/pages/admin/interment/customer/UpdateCustomer";
import {
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";

import ViewCustomerDialog from "../customer/ViewCustomer";

// Fix: Checkbox with indeterminate state for header
function SelectAllCheckbox({ table }: { table: any }) {
  // Use ref to set indeterminate on the native input
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (wrapperRef.current) {
      const input = wrapperRef.current.querySelector('input[type="checkbox"]');
      // 🛡️ Only set indeterminate if input is HTMLInputElement
      if (input instanceof HTMLInputElement) {
        input.indeterminate =
          table.getIsSomePageRowsSelected() &&
          !table.getIsAllPageRowsSelected();
      }
    }
  }, [table.getIsSomePageRowsSelected(), table.getIsAllPageRowsSelected()]);
  return (
    <div ref={wrapperRef}>
      <Checkbox
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        className="border-gray-500 dark:border-gray-600"
        checked={table.getIsAllPageRowsSelected()}
        aria-label="Select all"
      />
    </div>
  );
}

export const customerColumns: ColumnDef<Customer>[] = [
  {
    id: "select",
    enableHiding: false,
    enableSorting: false,
    header: ({ table }) => <SelectAllCheckbox table={table} />,
    cell: ({ row }) => {
      if (
        !row ||
        typeof row.getIsSelected !== "function" ||
        typeof row.toggleSelected !== "function"
      )
        return null;
      return (
        <Checkbox
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
          className="border-accent dark:border-accent-background"
          checked={row.getIsSelected()}
          aria-label="Select row"
        />
      );
    },
  },
  {
    header: "#",
    accessorKey: "customer_id",
  },
  {
    id: "full_name",
    header: "Full Name",
    accessorFn: (row) =>
      capitalizeWords(`${row.first_name} ${row.middle_name} ${row.last_name}`),
  },
  {
    header: "Address",
    accessorKey: "address",
    cell: ({ row }) =>
      row.original.address ? (
        row.original.address
      ) : (
        <Badge variant="secondary" asChild={false}>
          <span>N/A</span>
        </Badge>
      ),
  },
  {
    header: "Phone",
    accessorKey: "contact_number",
    cell: ({ row }) =>
      row.original.contact_number ? (
        row.original.contact_number
      ) : (
        <Badge variant="secondary" asChild={false}>
          <span>N/A</span>
        </Badge>
      ),
  },
  {
    header: "Email",
    accessorKey: "email",
    cell: ({ row }) =>
      row.original.email ? (
        row.original.email
      ) : (
        <Badge variant="secondary" asChild={false}>
          <span>N/A</span>
        </Badge>
      ),
  },
  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      const [open, setOpen] = React.useState(false);
      const [viewOpen, setViewOpen] = React.useState(false);
      if (!row?.original) return null;
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-8 w-8 p-0" variant="ghost">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-50" align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setOpen(true);
                }}
              >
                Edit Customer
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setViewOpen(true);
                }}
              >
                View Customer
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(row.original.customer_id)
                }
                className="text-red-600 hover:bg-red-100"
              >
                <Archive className="mr-2 h-4 w-4 text-red-600" />
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <EditCustomerDialog
            customer={row.original}
            onOpenChange={setOpen}
            open={open}
          />
          <ViewCustomerDialog
            onOpenChange={setViewOpen}
            customer={row.original}
            open={viewOpen}
          />
        </>
      );
    },
  },
];

export const lotOwnerColumns: ColumnDef<LotOwners>[] = [
  {
    id: "select",
    enableHiding: false,
    enableSorting: false,
    header: ({ table }) => <SelectAllCheckbox table={table} />,
    cell: ({ row }) => {
      if (
        !row ||
        typeof row.getIsSelected !== "function" ||
        typeof row.toggleSelected !== "function"
      )
        return null;
      return (
        <Checkbox
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
          className="border-gray-300 dark:border-gray-600"
          checked={row.getIsSelected()}
          aria-label="Select row"
        />
      );
    },
  },
  {
    header: "#",
    accessorKey: "lot_id",
    cell: ({ row }) =>
      row.original.lot_id ? (
        row.original.lot_id
      ) : (
        <Badge variant="secondary" asChild={false}>
          <span>N/A</span>
        </Badge>
      ),
  },
  {
    header: "Lot Owner",
    accessorKey: "customer_name",
    cell: ({ row }) =>
      row.original.customer_name ? (
        row.original.customer_name
      ) : (
        <Badge variant="secondary" asChild={false}>
          <span>N/A</span>
        </Badge>
      ),
  },
  {
    id: "location",
    header: "Location",
    accessorFn: (row) =>
      row.block && row.plot_id
        ? `Block ${row.block} • Grave ${row.plot_id}`
        : row.category && row.niche_number
          ? `${capitalizeWords(row.category)} • Niche ${row.niche_number}`
          : null,
    cell: ({ row }) => {
      // 🧩 Show block/plot if present, else category/niche_id, else N/A badge
      if (row.original.block && row.original.plot_id) {
        return `Block ${row.original.block} • Grave ${row.original.plot_id}`;
      } else if (row.original.category && row.original.niche_number) {
        return `${capitalizeWords(row.original.category)} • Niche ${row.original.niche_number}`;
      } else {
        return (
          <Badge variant="secondary" asChild={false}>
            <span>N/A</span>
          </Badge>
        );
      }
    },
  },
  {
    header: "Status",
    accessorKey: "lot_status",
    cell: ({ row }) => {
      // 🟡 Show colored badge based on status value
      const status = row.original.lot_status?.toLowerCase();
      if (!status) {
        return (
          <Badge variant="secondary" asChild={false}>
            <span>N/A</span>
          </Badge>
        );
      }
      if (status === "active") {
        return (
          <Badge className="bg-yellow-400 text-black" asChild={false}>
            <span>Active</span>
          </Badge>
        );
      }
      if (status === "canceled") {
        return (
          <Badge className="bg-red-500 text-white" asChild={false}>
            <span>Canceled</span>
          </Badge>
        );
      }
      if (status === "completed") {
        return (
          <Badge className="bg-green-500 text-white" asChild={false}>
            <span>Completed</span>
          </Badge>
        );
      }
      return (
        <Badge variant="secondary" asChild={false}>
          <span>{row.original.lot_status}</span>
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      // const [openLot, setOpenLot] = React.useState(false);
      if (!row?.original) return null;
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-8 w-8 p-0" variant="ghost">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-50" align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit lot owner</DropdownMenuItem>
              <DropdownMenuItem>View lot owner</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(row.original.customer_id)
                }
                className="text-red-600 hover:bg-red-100"
              >
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

export const deceasedRecordsColumns: ColumnDef<DeceasedRecords>[] = [
  {
    id: "select",
    enableHiding: false,
    enableSorting: false,
    header: ({ table }) => <SelectAllCheckbox table={table} />,
    cell: ({ row }) => {
      if (
        !row ||
        typeof row.getIsSelected !== "function" ||
        typeof row.toggleSelected !== "function"
      )
        return null;
      return (
        <Checkbox
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
          className="border-gray-300 dark:border-gray-600"
          checked={row.getIsSelected()}
          aria-label="Select row"
        />
      );
    },
  },
  {
    header: "#",
    accessorKey: "deceased_id",
  },
  {
    header: "Decesed Name",
    accessorKey: "dead_fullname",
    cell: ({ row }) =>
      row.original.dead_fullname ? (
        row.original.dead_fullname
      ) : (
        <Badge variant="secondary" asChild={false}>
          <span>N/A</span>
        </Badge>
      ),
  },
  {
    header: "Kin",
    accessorKey: "full_name",
    cell: ({ row }) =>
      row.original.full_name ? (
        row.original.full_name
      ) : (
        <Badge variant="secondary" asChild={false}>
          <span>N/A</span>
        </Badge>
      ),
  },
  {
    id: "location",
    header: "Buried Location",
    accessorFn: (row) =>
      row.block && row.plot_id
        ? `Block ${row.block} • Grave ${row.plot_id}`
        : row.category && row.niche_number
          ? `${capitalizeWords(row.category)} • Niche ${row.niche_number}`
          : null,
    cell: ({ row }) => {
      // 🧩 Show block/plot if present, else category/niche_id, else N/A badge
      if (row.original.block && row.original.plot_id) {
        return `Block ${row.original.block} • Grave ${row.original.plot_id}`;
      } else if (row.original.category && row.original.niche_number) {
        return `${capitalizeWords(row.original.category)} • Niche ${row.original.niche_number}`;
      } else {
        return (
          <Badge variant="secondary" asChild={false}>
            <span>N/A</span>
          </Badge>
        );
      }
    },
  },
  {
    header: "Buried Date",
    accessorKey: "dead_interment",
    cell: ({ row }) =>
      row.original.dead_interment ? (
        row.original.dead_interment
      ) : (
        <Badge variant="secondary" asChild={false}>
          <span>N/A</span>
        </Badge>
      ),
  },
  {
    header: "Date of Death",
    accessorKey: "dead_date_death",
    cell: ({ row }) =>
      row.original.dead_date_death ? (
        row.original.dead_date_death
      ) : (
        <Badge variant="secondary" asChild={false}>
          <span>N/A</span>
        </Badge>
      ),
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
        (yearsBuried === 1 &&
          (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)));

      return isLessThanOneYear
        ? "Less than a year"
        : `${yearsBuried} year${yearsBuried > 1 ? "s" : ""}`;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      if (!row?.original) return null;
      const deceasedRecord = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-8 w-8 p-0" variant="ghost">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-50" align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(deceasedRecord.deceased_id)
              }
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit deceased record
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View deceased record
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
