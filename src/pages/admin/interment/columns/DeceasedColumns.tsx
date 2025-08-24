"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { MoreHorizontal, Archive } from "lucide-react";
// React import intentionally omitted; JSX runtime handles it

import type { DeceasedRecords } from "@/types/interment.types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenuSeparator, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuItem, DropdownMenu } from "@/components/ui/dropdown-menu";
import { capitalizeWords } from "@/lib/stringUtils";
import DeceasedSelectAllCheckbox from "@/pages/admin/interment/columns/DeceasedSelectAllCheckbox";

export const deceasedRecordsColumns: ColumnDef<DeceasedRecords>[] = [
  {
    id: "select",
    size: 40,
    enableHiding: false,
    enableSorting: false,
    header: ({ table }) => <DeceasedSelectAllCheckbox table={table} />,
    cell: ({ row }) => {
      if (!row || typeof row.getIsSelected !== "function" || typeof row.toggleSelected !== "function") return null;
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
    header: "ID",
    size: 40,
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
    header: "Interment Date",
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
      const isLessThanOneYear = yearsBuried < 1 || (yearsBuried === 1 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)));

      return isLessThanOneYear ? "Less than a year" : `${yearsBuried} year${yearsBuried > 1 ? "s" : ""}`;
    },
  },
  {
    id: "actions",
    size: 40,
    enableHiding: false,
    cell: ({ row }) => {
      if (!row?.original) return null;
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
            <DropdownMenuItem>View deceased</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                alert("Archive clicked");
              }}
              className="text-red-600 hover:bg-red-100"
            >
              <Archive className="mr-2 h-4 w-4 text-red-600" />
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
