import { AiOutlineUser } from "react-icons/ai";
import ViewCustomerDialog from "@/pages/admin/interment/customer/ViewCustomer";
import { type Customer } from "@/api/customer.api";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import EditCustomerDialog from "@/pages/admin/interment/customer/UpdateCustomer";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Archive, Mail, MapPinHouse, MoreHorizontal, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const IndeterminateCheckbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { indeterminate?: boolean }>(({ indeterminate, ...props }, ref) => {
  const localRef = React.useRef<HTMLInputElement>(null);
  const resolvedRef = (ref as React.RefObject<HTMLInputElement>) ?? localRef;

  React.useEffect(() => {
    if (resolvedRef.current) {
      resolvedRef.current.indeterminate = Boolean(indeterminate) && !props.checked;
    }
  }, [indeterminate, props.checked, resolvedRef]);

  return <input ref={resolvedRef} type="checkbox" {...props} />;
});
IndeterminateCheckbox.displayName = "IndeterminateCheckbox";

export const customerColumns: ColumnDef<Customer>[] = [
  {
    id: "select",
    header: ({ table: tbl }) => (
      <IndeterminateCheckbox
        aria-label="Select all rows"
        checked={tbl.getIsAllPageRowsSelected()}
        indeterminate={tbl.getIsSomePageRowsSelected()}
        onChange={tbl.getToggleAllPageRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <IndeterminateCheckbox aria-label={`Select row ${row.index + 1}`} checked={row.getIsSelected()} disabled={!row.getCanSelect?.()} onChange={row.getToggleSelectedHandler()} />
    ),
    size: 40,
  },
  {
    size: 40,
    accessorKey: "customer_id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    meta: { label: "ID" },
  },
  {
    id: "full_name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Full Name" />,
    accessorFn: (row) => [row.first_name, row.middle_name, row.last_name].filter(Boolean).join(" "),
    cell: ({ row }) => {
      const fullName = String(row.getValue("full_name"));
      return (
        <div className="flex items-center gap-2">
          <div className="bg-muted flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-medium" aria-hidden="true">
            <AiOutlineUser size={14} />
          </div>
          <span title={fullName} className="max-w-[14rem] truncate">
            {fullName}
          </span>
        </div>
      );
    },
    meta: { label: "Full Name" },
  },
  {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Address" />,
    accessorKey: "address",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="bg-muted flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium">
            <MapPinHouse size={14} />
          </div>
          <span>{row.original.address}</span>
        </div>
      );
    },
    meta: { label: "Address" },
  },
  {
    accessorKey: "contact_number",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="bg-muted flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium">
            <Phone size={14} />
          </div>
          <span>{row.original.contact_number}</span>
        </div>
      );
    },
    meta: { label: "Phone Number" },
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    enableSorting: true,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="bg-muted flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium">
            <Mail size={14} />
          </div>
          <span>{row.original.email}</span>
        </div>
      );
    },
    meta: { label: "Email" },
  },
  {
    id: "lot_count",
    header: ({ column }) => (
      <div className="flex justify-center">
        <DataTableColumnHeader column={column} title="Lot Owned" />
      </div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
    accessorFn: (row) => (Array.isArray(row.lot_info) ? row.lot_info.length : 0),
    cell: ({ row }) => {
      const count = Array.isArray(row.original.lot_info) ? row.original.lot_info.length : 0;
      return (
        <div className="flex justify-center">
          <Badge variant={count > 0 ? "secondary" : "outline"}>{count}</Badge>
        </div>
      );
    },
    filterFn: (row, _id, value) => {
      const selected = Array.isArray(value) ? value : [];
      if (selected.length === 0) return true;
      const count = Array.isArray((row.original as Customer).lot_info) ? (row.original as Customer).lot_info!.length : 0;
      const hasLot = count > 0;
      return selected.some((v: string) => (v === "yes" ? hasLot : !hasLot));
    },
    meta: {
      label: "Lot Owned",
      variant: "select",
      options: [
        { label: "Has Lot", value: "yes" },
        { label: "No Lot", value: "no" },
      ],
    },
  },
  {
    id: "actions",
    size: 40,
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(row.original.customer_id))} className="text-red-600 hover:bg-red-100">
                <Archive className="mr-2 h-4 w-4 text-red-600" />
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <EditCustomerDialog customer={row.original} onOpenChange={setOpen} open={open} />
          <ViewCustomerDialog onOpenChange={setViewOpen} customer={row.original} open={viewOpen} />
        </>
      );
    },
  },
];
