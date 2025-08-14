import { AiOutlineUser } from "react-icons/ai";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Archive, MapPin, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LotOwners } from "@/types/interment.types";

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

export const lotOwnerColumns: ColumnDef<LotOwners>[] = [
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
    accessorKey: "lot_id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    meta: { label: "ID" },
  },
  {
    id: "customer_name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Lot Owner" />,
    accessorFn: (row) => `${row.customer_name}`,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="bg-muted flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium">
            <AiOutlineUser size={14} />
          </div>
          <span>{row.original.customer_name}</span>
        </div>
      );
    },
    meta: { label: "Full Name" },
  },

  {
    id: "location",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Location" />,
    accessorFn: (row) =>
      row.block && row.plot_id
        ? `Block ${row.block} • Grave ${row.plot_id}`
        : row.category && row.niche_number
          ? `${row.category} ${row.plot_id} • Niche ${row.niche_number}`
          : null,
    cell: ({ row }) => {
      if (row.original.block && row.original.plot_id) {
        return (
          <div className="flex items-center gap-2">
            <div className="bg-muted flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium">
              <MapPin size={14} />
            </div>
            Block {row.original.block} • Grave {row.original.plot_id}
          </div>
        );
      } else if (row.original.category && row.original.niche_number) {
        return (
          <div className="flex items-center gap-2">
            <div className="bg-muted flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium">
              <MapPin size={14} />
            </div>
            {row.original.category} {row.original.plot_id} • Niche {row.original.niche_number}
          </div>
        );
      }
      return null;
    },
    meta: { label: "Location" },
  },
  {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    accessorKey: "lot_status",
    cell: ({ row }) => {
      const status = row.original.lot_status;
      if (status === "active") {
        return (
          <Badge variant="outline" className="border-amber-500" asChild={false}>
            <span className="text-xs text-amber-600">Active</span>
          </Badge>
        );
      }
      if (status === "canceled") {
        return (
          <Badge variant="destructive" asChild={false}>
            <span className="text-xs text-red-600">Canceled</span>
          </Badge>
        );
      }
      if (status === "completed") {
        return (
          <Badge variant="outline" className="bg-green-500 text-white" asChild={false}>
            <span className="text-xs">Completed</span>
          </Badge>
        );
      }
      return (
        <Badge variant="outline" asChild={false}>
          <span>{row.original.lot_status}</span>
        </Badge>
      );
    },
    meta: {
      label: "Status",
      variant: "select",
      options: [
        { label: "Active", value: "active" },
        { label: "Canceled", value: "canceled" },
        { label: "Completed", value: "completed" },
      ],
    },
  },
  {
    id: "actions",
    size: 40,
    enableHiding: false,
    cell: ({ row }) => {
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.customer_id)} className="text-red-600 hover:bg-red-100">
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
