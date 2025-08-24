import type { ColumnDef } from "@tanstack/react-table";

import { AiOutlineUser } from "react-icons/ai";

import type { UserRecord } from "@/api/users.api";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { ucwords } from "@/lib/format";

export const adminUsersColumns: ColumnDef<UserRecord>[] = [
  {
    accessorKey: "user_id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    size: 60,
    meta: { label: "ID" },
  },
  {
    id: "username",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Username" />,
    accessorFn: (row) => row.username,
    cell: ({ row }) => (
      <span className="flex items-center gap-2 truncate" title={row.original.username}>
        <div className="bg-muted flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-sm font-medium" aria-hidden="true">
          <AiOutlineUser size={12} />
        </div>
        {ucwords(row.original.username)}
      </span>
    ),
    meta: { label: "Username" },
  },
  {
    accessorKey: "isAdmin",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => <Badge variant="outline">{row.original.isAdmin === 1 ? "Admin" : "User"}</Badge>,
    meta: { label: "Role" },
  },
  {
    id: "created_at",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    accessorFn: (row) => (row.created_at ? new Date(row.created_at).getTime() : 0),
    cell: ({ row }) => {
      const d = row.original.created_at ? new Date(row.original.created_at) : null;
      const fmt = d && !isNaN(d.getTime()) ? d.toLocaleString() : (row.original.created_at ?? "-");
      return <span title={String(row.original.created_at ?? "-")}>{fmt}</span>;
    },
    enableSorting: true,
    meta: { label: "Created" },
  },
];
