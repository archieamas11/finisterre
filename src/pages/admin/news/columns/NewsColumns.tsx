import type { ColumnDef } from '@tanstack/react-table'

import { Archive, CalendarDays, Clock, Megaphone, MoreHorizontal, Newspaper, Star, User } from 'lucide-react'
import React from 'react'

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/format'
import type { NewsItem } from '@/types/news.types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenu,
} from '@/components/ui/dropdown-menu'

const IndeterminateCheckbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { indeterminate?: boolean }>(
  ({ indeterminate, ...props }, ref) => {
    const localRef = React.useRef<HTMLInputElement>(null)
    const resolvedRef = (ref as React.RefObject<HTMLInputElement>) ?? localRef

    React.useEffect(() => {
      if (resolvedRef.current) {
        resolvedRef.current.indeterminate = Boolean(indeterminate) && !props.checked
      }
    }, [indeterminate, props.checked, resolvedRef])

    return <input ref={resolvedRef} type="checkbox" {...props} />
  },
)
IndeterminateCheckbox.displayName = 'IndeterminateCheckbox'

const statusStyles: Record<NewsItem['status'], string> = {
  draft: 'bg-slate-200 text-slate-700',
  scheduled: 'bg-amber-200 text-amber-800',
  published: 'bg-emerald-200 text-emerald-800',
  archived: 'bg-rose-200 text-rose-800',
}

const categoryIcons: Record<NewsItem['category'], React.ElementType> = {
  Announcement: Megaphone,
  Update: Newspaper,
  Event: CalendarDays,
  Story: Newspaper,
}

export const newsColumns: ColumnDef<NewsItem>[] = [
  {
    id: 'select',
    size: 1,
    header: ({ table: tbl }) => (
      <IndeterminateCheckbox
        aria-label="Select all rows"
        checked={tbl.getIsAllPageRowsSelected()}
        indeterminate={tbl.getIsSomePageRowsSelected()}
        onChange={tbl.getToggleAllPageRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <IndeterminateCheckbox
        aria-label={`Select row ${row.index + 1}`}
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect?.()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  {
    accessorKey: 'title',
    size: 20,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    cell: ({ row }) => {
      const news = row.original
      const Icon = categoryIcons[news.category]

      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-start gap-2">
            <span className="bg-muted text-muted-foreground flex h-7 w-7 shrink-0 items-center justify-center rounded-full">
              <Icon className="h-3.5 w-3.5" aria-hidden />
            </span>
            <div className="flex flex-col">
              <span className="text-foreground line-clamp-1 font-semibold" title={news.title}>
                {news.title}
              </span>
              {news.excerpt ? <span className="text-muted-foreground line-clamp-2 w-80 text-xs">{news.excerpt}</span> : null}
            </div>
          </div>
        </div>
      )
    },
    meta: { label: 'Title' },
  },
  {
    accessorKey: 'category',
    size: 10,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    filterFn: (row, _id, value) => {
      const selected = Array.isArray(value) ? value : []
      if (selected.length === 0) return true
      return selected.includes(row.original.category)
    },
    cell: ({ row }) => {
      const category = row.original.category
      return <Badge className="bg-slate-100 text-slate-700">{category}</Badge>
    },
    meta: {
      label: 'Category',
      variant: 'select',
      options: Object.keys(categoryIcons).map((value) => ({ label: value, value })),
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    enableSorting: true,
    filterFn: (row, _id, value) => {
      const selected = Array.isArray(value) ? value : []
      if (selected.length === 0) return true
      return selected.includes(row.original.status)
    },
    cell: ({ row }) => {
      const status = row.original.status
      return <Badge className={cn('capitalize', statusStyles[status])}>{status}</Badge>
    },
    meta: {
      label: 'Status',
      variant: 'select',
      options: Object.keys(statusStyles).map((value) => ({ label: value, value })),
    },
  },
  {
    id: 'published_at',
    accessorFn: (row) => row.published_at ?? row.created_at,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Published" />,
    enableSorting: true,
    cell: ({ row }) => {
      const published = row.original.published_at ?? row.original.created_at
      return (
        <div className="flex items-center gap-2 text-sm">
          <CalendarDays className="text-muted-foreground h-4 w-4" aria-hidden />
          <span>{formatDate(published)}</span>
        </div>
      )
    },
    meta: { label: 'Published' },
  },
  {
    accessorKey: 'author',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Author" />,
    cell: ({ row }) => {
      const author = row.original.author ?? '—'
      return (
        <div className="flex items-center gap-2 text-sm">
          <User className="text-muted-foreground h-4 w-4" aria-hidden />
          <span>{author}</span>
        </div>
      )
    },
    meta: { label: 'Author' },
  },
  {
    id: 'is_featured',
    accessorFn: (row) => row.is_featured,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Featured" />,
    enableSorting: true,
    cell: ({ row }) => {
      const isFeatured = row.original.is_featured
      return isFeatured ? (
        <Badge className="bg-yellow-200 text-yellow-800">
          <Star className="mr-1 h-3.5 w-3.5" aria-hidden /> Featured
        </Badge>
      ) : (
        <span className="text-muted-foreground text-xs">Not featured</span>
      )
    },
    meta: {
      label: 'Featured',
      variant: 'select',
      options: [
        { label: 'Featured', value: 'true' },
        { label: 'Not featured', value: 'false' },
      ],
    },
    filterFn: (row, _id, value) => {
      const selected = Array.isArray(value) ? value : []
      if (selected.length === 0) return true
      const isFeatured = row.original.is_featured
      return selected.some((v: string) => (v === 'true' ? isFeatured : !isFeatured))
    },
  },
  {
    id: 'updated_at',
    accessorFn: (row) => row.updated_at,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Updated" />,
    enableSorting: true,
    cell: ({ row }) => {
      const updated = row.original.updated_at
      return (
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <Clock className="h-4 w-4" aria-hidden />
          <span>{formatDate(updated, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      )
    },
    meta: { label: 'Last Updated' },
  },
  {
    id: 'actions',
    size: 10,
    enableHiding: false,
    cell: ({ row }) => {
      if (!row?.original) return null
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
            <DropdownMenuItem>View News</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                alert('Archive clicked')
              }}
              className="text-red-600 hover:bg-red-100"
            >
              <Archive className="mr-2 h-4 w-4 text-red-600" />
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
