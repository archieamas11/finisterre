import {
  type UniqueIdentifier,
  type DragEndEvent,
  KeyboardSensor,
  closestCenter,
  MouseSensor,
  TouchSensor,
  DndContext,
  useSensors,
  useSensor
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  verticalListSortingStrategy,
  SortableContext,
  useSortable,
  arrayMove
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  IconCircleCheckFilled,
  IconChevronsRight,
  IconLayoutColumns,
  IconChevronRight,
  IconChevronsLeft,
  IconDotsVertical,
  IconGripVertical,
  IconChevronDown,
  IconChevronLeft,
  IconTrendingUp,
  IconLoader,
  IconPlus
} from '@tabler/icons-react'
import {
  type ColumnFiltersState,
  getFacetedUniqueValues,
  getPaginationRowModel,
  type VisibilityState,
  getFilteredRowModel,
  getFacetedRowModel,
  getSortedRowModel,
  type SortingState,
  getCoreRowModel,
  type ColumnDef,
  useReactTable,
  flexRender,
  type Row
} from '@tanstack/react-table'
import * as React from 'react'
import { CartesianGrid, AreaChart, XAxis, Area } from 'recharts'
import { toast } from 'sonner'
import { z } from 'zod'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ChartTooltipContent,
  type ChartConfig,
  ChartContainer,
  ChartTooltip
} from '@/components/ui/chart'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DrawerDescription,
  DrawerContent,
  DrawerTrigger,
  DrawerFooter,
  DrawerHeader,
  DrawerClose,
  DrawerTitle,
  Drawer
} from '@/components/ui/drawer'
import {
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenu
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
  Select
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table
} from '@/components/ui/table'
import { TabsContent, TabsTrigger, TabsList, Tabs } from '@/components/ui/tabs'
import { useIsMobile } from '@/hooks/use-mobile'

export const schema = z.object({
  id: z.number(),
  type: z.string(),
  limit: z.string(),
  header: z.string(),
  status: z.string(),
  target: z.string(),
  reviewer: z.string()
})

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { listeners, attributes } = useSortable({
    id
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      className='text-muted-foreground size-7 hover:bg-transparent'
      variant='ghost'
      size='icon'
    >
      <IconGripVertical className='text-muted-foreground size-3' />
      <span className='sr-only'>Drag to reorder</span>
    </Button>
  )
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: 'drag',
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />
  },
  {
    id: 'select',
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => (
      <div className='flex items-center justify-center'>
        <Checkbox
          onCheckedChange={(value) => {
            row.toggleSelected(!!value)
          }}
          checked={row.getIsSelected()}
          aria-label='Select row'
        />
      </div>
    ),
    header: ({ table }) => (
      <div className='flex items-center justify-center'>
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value)
          }}
          aria-label='Select all'
        />
      </div>
    )
  },
  {
    header: 'Header',
    enableHiding: false,
    accessorKey: 'header',
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />
    }
  },
  {
    accessorKey: 'type',
    header: 'Section Type',
    cell: ({ row }) => (
      <div className='w-32'>
        <Badge className='text-muted-foreground px-1.5' variant='outline'>
          {row.original.type}
        </Badge>
      </div>
    )
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => (
      <Badge className='text-muted-foreground px-1.5' variant='outline'>
        {row.original.status === 'Done' ? (
          <IconCircleCheckFilled className='fill-green-500 dark:fill-green-400' />
        ) : (
          <IconLoader />
        )}
        {row.original.status}
      </Badge>
    )
  },
  {
    accessorKey: 'target',
    header: () => <div className='w-full text-right'>Target</div>,
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            error: 'Error',
            success: 'Done',
            loading: `Saving ${row.original.header}`
          })
        }}
      >
        <Label htmlFor={`${row.original.id}-target`} className='sr-only'>
          Target
        </Label>
        <Input
          className='hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent'
          defaultValue={row.original.target}
          id={`${row.original.id}-target`}
        />
      </form>
    )
  },
  {
    accessorKey: 'limit',
    header: () => <div className='w-full text-right'>Limit</div>,
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            error: 'Error',
            success: 'Done',
            loading: `Saving ${row.original.header}`
          })
        }}
      >
        <Label htmlFor={`${row.original.id}-limit`} className='sr-only'>
          Limit
        </Label>
        <Input
          className='hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent'
          defaultValue={row.original.limit}
          id={`${row.original.id}-limit`}
        />
      </form>
    )
  },
  {
    header: 'Reviewer',
    accessorKey: 'reviewer',
    cell: ({ row }) => {
      const isAssigned = row.original.reviewer !== 'Assign reviewer'

      if (isAssigned) {
        return row.original.reviewer
      }

      return (
        <>
          <Label htmlFor={`${row.original.id}-reviewer`} className='sr-only'>
            Reviewer
          </Label>
          <Select>
            <SelectTrigger
              className='w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate'
              id={`${row.original.id}-reviewer`}
              size='sm'
            >
              <SelectValue placeholder='Assign reviewer' />
            </SelectTrigger>
            <SelectContent align='end'>
              <SelectItem value='Eddie Lake'>Eddie Lake</SelectItem>
              <SelectItem value='Jamik Tashpulatov'>
                Jamik Tashpulatov
              </SelectItem>
            </SelectContent>
          </Select>
        </>
      )
    }
  },
  {
    id: 'actions',
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className='data-[state=open]:bg-muted text-muted-foreground flex size-8'
            variant='ghost'
            size='icon'
          >
            <IconDotsVertical />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-32' align='end'>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive'>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
]

export function DataTable({
  data: initialData
}: {
  data: z.infer<typeof schema>[]
}) {
  const [data, setData] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10
  })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    enableRowSelection: true,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id.toString(),
    onRowSelectionChange: setRowSelection,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFacetedRowModel: getFacetedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      pagination,
      rowSelection,
      columnFilters,
      columnVisibility
    }
  })

  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  return (
    <Tabs
      className='w-full flex-col justify-start gap-6'
      defaultValue='outline'
    >
      <div className='flex items-center justify-between px-4 lg:px-6'>
        <Label htmlFor='view-selector' className='sr-only'>
          View
        </Label>
        <Select defaultValue='outline'>
          <SelectTrigger
            className='flex w-fit @4xl/main:hidden'
            id='view-selector'
            size='sm'
          >
            <SelectValue placeholder='Select a view' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='outline'>Outline</SelectItem>
            <SelectItem value='past-performance'>Past Performance</SelectItem>
            <SelectItem value='key-personnel'>Key Personnel</SelectItem>
            <SelectItem value='focus-documents'>Focus Documents</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className='**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex'>
          <TabsTrigger value='outline'>Outline</TabsTrigger>
          <TabsTrigger value='past-performance'>
            Past Performance <Badge variant='secondary'>3</Badge>
          </TabsTrigger>
          <TabsTrigger value='key-personnel'>
            Key Personnel <Badge variant='secondary'>2</Badge>
          </TabsTrigger>
          <TabsTrigger value='focus-documents'>Focus Documents</TabsTrigger>
        </TabsList>
        <div className='flex items-center gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm'>
                <IconLayoutColumns />
                <span className='hidden lg:inline'>Customize Columns</span>
                <span className='lg:hidden'>Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='end'>
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== 'undefined' &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      onCheckedChange={(value) => {
                        column.toggleVisibility(!!value)
                      }}
                      checked={column.getIsVisible()}
                      className='capitalize'
                      key={column.id}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant='outline' size='sm'>
            <IconPlus />
            <span className='hidden lg:inline'>Add Section</span>
          </Button>
        </div>
      </div>
      <TabsContent
        className='relative flex flex-col gap-4 overflow-auto px-4 lg:px-6'
        value='outline'
      >
        <div className='overflow-hidden rounded-lg border'>
          <DndContext
            modifiers={[restrictToVerticalAxis]}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className='bg-muted sticky top-0 z-10'>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead colSpan={header.colSpan} key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className='**:data-[slot=table-cell]:first:w-8'>
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    strategy={verticalListSortingStrategy}
                    items={dataIds}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      className='h-24 text-center'
                      colSpan={columns.length}
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className='flex items-center justify-between px-4'>
          <div className='text-muted-foreground hidden flex-1 text-sm lg:flex'>
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className='flex w-full items-center gap-8 lg:w-fit'>
            <div className='hidden items-center gap-2 lg:flex'>
              <Label className='text-sm font-medium' htmlFor='rows-per-page'>
                Rows per page
              </Label>
              <Select
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
                value={`${table.getState().pagination.pageSize}`}
              >
                <SelectTrigger id='rows-per-page' className='w-20' size='sm'>
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side='top'>
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem value={`${pageSize}`} key={pageSize}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex w-fit items-center justify-center text-sm font-medium'>
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </div>
            <div className='ml-auto flex items-center gap-2 lg:ml-0'>
              <Button
                onClick={() => {
                  table.setPageIndex(0)
                }}
                className='hidden h-8 w-8 p-0 lg:flex'
                disabled={!table.getCanPreviousPage()}
                variant='outline'
              >
                <span className='sr-only'>Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                onClick={() => {
                  table.previousPage()
                }}
                disabled={!table.getCanPreviousPage()}
                className='size-8'
                variant='outline'
                size='icon'
              >
                <span className='sr-only'>Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                onClick={() => {
                  table.nextPage()
                }}
                disabled={!table.getCanNextPage()}
                className='size-8'
                variant='outline'
                size='icon'
              >
                <span className='sr-only'>Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                onClick={() => {
                  table.setPageIndex(table.getPageCount() - 1)
                }}
                disabled={!table.getCanNextPage()}
                className='hidden size-8 lg:flex'
                variant='outline'
                size='icon'
              >
                <span className='sr-only'>Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        className='flex flex-col px-4 lg:px-6'
        value='past-performance'
      >
        <div className='aspect-video w-full flex-1 rounded-lg border border-dashed'></div>
      </TabsContent>
      <TabsContent className='flex flex-col px-4 lg:px-6' value='key-personnel'>
        <div className='aspect-video w-full flex-1 rounded-lg border border-dashed'></div>
      </TabsContent>
      <TabsContent
        className='flex flex-col px-4 lg:px-6'
        value='focus-documents'
      >
        <div className='aspect-video w-full flex-1 rounded-lg border border-dashed'></div>
      </TabsContent>
    </Tabs>
  )
}

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id
  })

  return (
    <TableRow
      style={{
        transition: transition,
        transform: CSS.Transform.toString(transform)
      }}
      className='relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80'
      data-state={row.getIsSelected() && 'selected'}
      data-dragging={isDragging}
      ref={setNodeRef}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

const chartData = [
  { mobile: 80, desktop: 186, month: 'January' },
  { mobile: 200, desktop: 305, month: 'February' },
  { mobile: 120, desktop: 237, month: 'March' },
  { desktop: 73, mobile: 190, month: 'April' },
  { mobile: 130, month: 'May', desktop: 209 },
  { mobile: 140, desktop: 214, month: 'June' }
]

const chartConfig = {
  mobile: {
    label: 'Mobile',
    color: 'var(--primary)'
  },
  desktop: {
    label: 'Desktop',
    color: 'var(--primary)'
  }
} satisfies ChartConfig

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? 'bottom' : 'right'}>
      <DrawerTrigger asChild>
        <Button className='text-foreground w-fit px-0 text-left' variant='link'>
          {item.header}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className='gap-1'>
          <DrawerTitle>{item.header}</DrawerTitle>
          <DrawerDescription>
            Showing total visitors for the last 6 months
          </DrawerDescription>
        </DrawerHeader>
        <div className='flex flex-col gap-4 overflow-y-auto px-4 text-sm'>
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  margin={{
                    left: 0,
                    right: 10
                  }}
                  accessibilityLayer
                  data={chartData}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    tickFormatter={(value) => value.slice(0, 3)}
                    tickLine={false}
                    axisLine={false}
                    dataKey='month'
                    tickMargin={8}
                    hide
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent indicator='dot' />}
                    cursor={false}
                  />
                  <Area
                    stroke='var(--color-mobile)'
                    fill='var(--color-mobile)'
                    fillOpacity={0.6}
                    dataKey='mobile'
                    type='natural'
                    stackId='a'
                  />
                  <Area
                    stroke='var(--color-desktop)'
                    fill='var(--color-desktop)'
                    dataKey='desktop'
                    fillOpacity={0.4}
                    type='natural'
                    stackId='a'
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className='grid gap-2'>
                <div className='flex gap-2 leading-none font-medium'>
                  Trending up by 5.2% this month{' '}
                  <IconTrendingUp className='size-4' />
                </div>
                <div className='text-muted-foreground'>
                  Showing total visitors for the last 6 months. This is just
                  some random text to test the layout. It spans multiple lines
                  and should wrap around.
                </div>
              </div>
              <Separator />
            </>
          )}
          <form className='flex flex-col gap-4'>
            <div className='flex flex-col gap-3'>
              <Label htmlFor='header'>Header</Label>
              <Input defaultValue={item.header} id='header' />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-3'>
                <Label htmlFor='type'>Type</Label>
                <Select defaultValue={item.type}>
                  <SelectTrigger className='w-full' id='type'>
                    <SelectValue placeholder='Select a type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Table of Contents'>
                      Table of Contents
                    </SelectItem>
                    <SelectItem value='Executive Summary'>
                      Executive Summary
                    </SelectItem>
                    <SelectItem value='Technical Approach'>
                      Technical Approach
                    </SelectItem>
                    <SelectItem value='Design'>Design</SelectItem>
                    <SelectItem value='Capabilities'>Capabilities</SelectItem>
                    <SelectItem value='Focus Documents'>
                      Focus Documents
                    </SelectItem>
                    <SelectItem value='Narrative'>Narrative</SelectItem>
                    <SelectItem value='Cover Page'>Cover Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='flex flex-col gap-3'>
                <Label htmlFor='status'>Status</Label>
                <Select defaultValue={item.status}>
                  <SelectTrigger className='w-full' id='status'>
                    <SelectValue placeholder='Select a status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Done'>Done</SelectItem>
                    <SelectItem value='In Progress'>In Progress</SelectItem>
                    <SelectItem value='Not Started'>Not Started</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-3'>
                <Label htmlFor='target'>Target</Label>
                <Input defaultValue={item.target} id='target' />
              </div>
              <div className='flex flex-col gap-3'>
                <Label htmlFor='limit'>Limit</Label>
                <Input defaultValue={item.limit} id='limit' />
              </div>
            </div>
            <div className='flex flex-col gap-3'>
              <Label htmlFor='reviewer'>Reviewer</Label>
              <Select defaultValue={item.reviewer}>
                <SelectTrigger className='w-full' id='reviewer'>
                  <SelectValue placeholder='Select a reviewer' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Eddie Lake'>Eddie Lake</SelectItem>
                  <SelectItem value='Jamik Tashpulatov'>
                    Jamik Tashpulatov
                  </SelectItem>
                  <SelectItem value='Emily Whalen'>Emily Whalen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant='outline'>Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
