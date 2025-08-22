import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import type { ActivityLog } from "@/api/logs.api";
import { Badge } from "@/components/ui/badge";
import { BadgeCheckIcon, PencilIcon, TrashIcon, ArchiveIcon, LogInIcon, PlusIcon, UserIcon } from "lucide-react";
import { AiOutlineUser } from "react-icons/ai";
import { ucwords } from "@/lib/format";
const actionConfig = {
  add: {
    icon: PlusIcon,
    variant: "outline" as const,
    className: "border-blue-500 text-blue-500",
  },
  update: {
    icon: PencilIcon,
    variant: "outline" as const,
    className: "text-green-700 border-green-600",
  },
  delete: {
    icon: TrashIcon,
    variant: "destructive" as const,
    className: "text-red-600",
  },
  archive: {
    icon: ArchiveIcon,
    variant: "destructive" as const,
    className: "text-yellow-600",
  },
  login: {
    icon: LogInIcon,
    variant: "outline" as const,
    className: "",
  },
};
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
      <span className="flex items-center gap-2 truncate" title={row.original.username ?? String(row.original.user_id)}>
        <div className="bg-muted flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-sm font-medium" aria-hidden="true">
          <AiOutlineUser size={12} />
        </div>{" "}
        {ucwords(row.original.username ?? "")}
      </span>
    ),
    meta: { label: "User" },
  },
  {
    accessorKey: "action",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
    cell: ({ row }) => {
      const action = row.original.action?.toLowerCase();
      if (action && action in actionConfig) {
        const config = actionConfig[action as keyof typeof actionConfig];
        const Icon = config.icon;

        return (
          <Badge variant={config.variant} className={config.className}>
            <Icon className="mr-1 h-3 w-3" />
            {row.original.action}
          </Badge>
        );
      }
      const config = { icon: BadgeCheckIcon, variant: "outline" as const };
      const Icon = config.icon;

      return (
        <Badge variant={config.variant}>
          <Icon />
          {row.original.action}
        </Badge>
      );
    },
    meta: {
      label: "Action",
      variant: "select",
      options: [
        { label: "Add", value: "add" },
        { label: "Update", value: "update" },
        { label: "Delete", value: "delete" },
        { label: "Archive", value: "archive" },
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
