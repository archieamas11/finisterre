import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import type { ActivityLog } from "@/api/logs.api";
import { Badge } from "@/components/ui/badge";

export const logsColumns: ColumnDef<ActivityLog>[] = [
  {
    accessorKey: "log_id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    meta: { label: "ID" },
    size: 60,
  },
  {
    id: "user",
    header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
    accessorFn: (row) => row.username ?? String(row.user_id),
    cell: ({ row }) => (
      <span className="truncate" title={row.original.username ?? String(row.original.user_id)}>
        {row.original.username ?? row.original.user_id}
      </span>
    ),
    meta: { label: "User" },
  },
  {
    accessorKey: "action",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
    cell: ({ row }) => (
      <Badge variant="secondary" className="uppercase">
        {row.original.action}
      </Badge>
    ),
    meta: {
      label: "Action",
      variant: "select",
      options: [
        { label: "Add", value: "add" },
        { label: "Update", value: "update" },
        { label: "Delete", value: "delete" },
        { label: "Login", value: "login" },
      ],
    },
  },
  {
    accessorKey: "target",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Target" />,
    meta: { label: "Target" },
  },
  {
    accessorKey: "details",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Details" />,
    cell: ({ row }) => (
      <span className="max-w-[24rem] truncate" title={row.original.details ?? "-"}>
        {row.original.details ?? "-"}
      </span>
    ),
    meta: { label: "Details" },
  },
  {
    id: "created_at",
    header: ({ column }) => <DataTableColumnHeader column={column} title="When" />,
    accessorFn: (row) => new Date(row.created_at).getTime(),
    cell: ({ row }) => {
      const d = new Date(row.original.created_at);
      const fmt = isNaN(d.getTime()) ? String(row.original.created_at) : d.toLocaleString();
      return <span title={String(row.original.created_at)}>{fmt}</span>;
    },
    enableSorting: true,
    meta: { label: "When" },
  },
];
