"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, ListCollapseIcon, MoreHorizontal, SlidersVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Department = {
  id: string
  name: string
  headcount: number
  openPositions: number
  newHires: number
  attrition: number
  budget: string
}

const data: Department[] = [
  {
    id: "1",
    name: "Engineering",
    headcount: 342,
    openPositions: 15,
    newHires: 48,
    attrition: 12,
    budget: "$4.2M",
  },
  {
    id: "2",
    name: "Sales",
    headcount: 198,
    openPositions: 8,
    newHires: 32,
    attrition: 18,
    budget: "$2.8M",
  },
  {
    id: "3",
    name: "Marketing",
    headcount: 87,
    openPositions: 4,
    newHires: 12,
    attrition: 9,
    budget: "$1.5M",
  },
  {
    id: "4",
    name: "Product",
    headcount: 76,
    openPositions: 3,
    newHires: 10,
    attrition: 7,
    budget: "$1.2M",
  },
  {
    id: "5",
    name: "Customer Support",
    headcount: 156,
    openPositions: 6,
    newHires: 24,
    attrition: 15,
    budget: "$1.8M",
  },
  {
    id: "6",
    name: "HR",
    headcount: 42,
    openPositions: 2,
    newHires: 5,
    attrition: 3,
    budget: "$0.9M",
  },
  {
    id: "7",
    name: "Finance",
    headcount: 38,
    openPositions: 1,
    newHires: 4,
    attrition: 2,
    budget: "$1.1M",
  },
  {
    id: "8",
    name: "Operations",
    headcount: 112,
    openPositions: 3,
    newHires: 18,
    attrition: 10,
    budget: "$1.6M",
  },
]

export const columns: ColumnDef<Department>[] = [
  {
    accessorKey: "name",
    header: "Department",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "headcount",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Headcount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("headcount")}</div>,
  },
  {
    accessorKey: "openPositions",
    header: "Open Positions",
    cell: ({ row }) => <div className="text-center">{row.getValue("openPositions")}</div>,
  },
  {
    accessorKey: "newHires",
    header: "New Hires (YTD)",
    cell: ({ row }) => <div className="text-center">{row.getValue("newHires")}</div>,
  },
  {
    accessorKey: "attrition",
    header: "Attrition (YTD)",
    cell: ({ row }) => <div className="text-center">{row.getValue("attrition")}</div>,
  },
  {
    accessorKey: "budget",
    header: "Personnel Budget",
    cell: ({ row }) => <div className="text-right">{row.getValue("budget")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const department = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(department.id)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Export</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function HeadcountTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  
  const budgets = Array.from(new Set(data.map((item) => item.budget)))
  const openPositions = Array.from(new Set(data.map((item) => item.openPositions)));
  const attritions = Array.from(new Set(data.map((item) => item.attrition)));

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter departments..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="ml-auto mr-2">
              <SlidersVertical />
            </Button>
          </SheetTrigger>
          <SheetContent className="m-12">
            <ScrollArea className="h-[90vh]">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Filters</h4>
                  <p className="text-sm text-muted-foreground">Filter by various criteria.</p>
                </div>
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <label htmlFor="name" className="text-sm font-medium">
                      Headcount
                    </label>
                    <Input
                      id="count"
                      placeholder="Filter by Headcount"
                      value={(table.getColumn("headcount")?.getFilterValue() as string) ?? ""}
                      onChange={(event) => table.getColumn("headcount")?.setFilterValue(event.target.value)}
                    />
                  </div>
                  <div className="grid gap-1">
                    <label htmlFor="budget" className="text-sm font-medium">
                      Budget
                    </label>
                    <Select
                      onValueChange={(value) =>
                        table.getColumn("budget")?.setFilterValue(value === "all" ? "" : value)
                      }
                    >
                      <SelectTrigger id="budget">
                        <SelectValue placeholder="Select Budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Budgets</SelectItem>
                        {budgets.map((price) => (
                          <SelectItem key={price} value={price}>
                            {price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1">
                    <label htmlFor="budget" className="text-sm font-medium">
                      Open Positions
                    </label>
                    <Select
                      onValueChange={(value) =>
                        table.getColumn("openpositions")?.setFilterValue(value === "all" ? "" : value)
                      }
                    >
                      <SelectTrigger id="openpositions">
                        <SelectValue placeholder="Select " />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {openPositions.map((position) => (
                          <SelectItem key={position} value={String(position)}>
                            {position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-1">
                    <label htmlFor="attrition" className="text-sm font-medium">
                      Attrition
                    </label>
                    <Select
                      onValueChange={(value) =>
                        table.getColumn("attrition")?.setFilterValue(value === "all" ? "" : value)
                      }
                    >
                      <SelectTrigger id="attrition">
                        <SelectValue placeholder="Select Attritions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {attritions.map((att) => (
                          <SelectItem key={att} value={String(att)}>
                            {att}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <ListCollapseIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <ScrollArea className="h-[200px] w-[200px]">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <ScrollArea className="w-[75vw] md:w-full">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          <ChevronLeft />
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}

