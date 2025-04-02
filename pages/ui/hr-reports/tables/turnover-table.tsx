"use client"

import { useState } from "react"
import {
  SlidersVertical,
  ArrowUpDown,
  ChevronDown,
  ListCollapse,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"

type TurnoverDataType = {
  department: string
  voluntaryTurnover: number
  involuntaryTurnover: number
  totalTurnover: number
}

const turnoverData: TurnoverDataType[] = [
  { department: "Engineering", voluntaryTurnover: 5.2, involuntaryTurnover: 1.8, totalTurnover: 7.0 },
  { department: "Sales", voluntaryTurnover: 8.7, involuntaryTurnover: 2.1, totalTurnover: 10.8 },
  { department: "Marketing", voluntaryTurnover: 6.5, involuntaryTurnover: 1.5, totalTurnover: 8.0 },
  { department: "Product", voluntaryTurnover: 4.8, involuntaryTurnover: 1.2, totalTurnover: 6.0 },
  { department: "Customer Support", voluntaryTurnover: 7.9, involuntaryTurnover: 2.3, totalTurnover: 10.2 },
]


const turnoverColumns: ColumnDef<TurnoverDataType>[] = [
  {
    accessorKey: "department",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Department
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("department")}</div>,
  },
  {
    accessorKey: "voluntaryTurnover",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Voluntary Turnover
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("voluntaryTurnover")}%</div>,
  },
  {
    accessorKey: "involuntaryTurnover",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Involuntary Turnover
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("involuntaryTurnover")}%</div>,
  },
  {
    accessorKey: "totalTurnover",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Total Turnover
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("totalTurnover")}%</div>,
  },
]


export default function TurnoverTable() {
  const [turnoverSorting, setTurnoverSorting] = useState<SortingState>([])
  const [turnoverFilters, setTurnoverFilters] = useState<ColumnFiltersState>([])

  const turnoverTable = useReactTable({
    data: turnoverData,
    columns: turnoverColumns,
    onSortingChange: setTurnoverSorting,
    onColumnFiltersChange: setTurnoverFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: turnoverSorting,
      columnFilters: turnoverFilters,
    },
  })

  return (
    <>
    <div className="flex items-center py-4">
      <Input
        placeholder="Filter departments..."
        value={(turnoverTable.getColumn("department")?.getFilterValue() as string) ?? ""}
        onChange={(event) => turnoverTable.getColumn("department")?.setFilterValue(event.target.value)}
        className="max-w-sm mr-4"
      />
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="ml-auto">
            <SlidersVertical />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <div className="space-y-4 py-4">
            <h3 className="text-lg font-medium">Filters</h3>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Department</h4>
              <Input
                placeholder="Filter departments..."
                value={(turnoverTable.getColumn("department")?.getFilterValue() as string) ?? ""}
                onChange={(event) => turnoverTable.getColumn("department")?.setFilterValue(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Minimum Total Turnover</h4>
              <Input
                placeholder="Filter departments..."
                value={(turnoverTable.getColumn("totalTurnover")?.getFilterValue() as string) ?? ""}
                onChange={(event) => turnoverTable.getColumn("totalTurnover")?.setFilterValue(event.target.value)}
                className="max-w-sm"
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <ListCollapse className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <ScrollArea className="w-[200px] h-max">
          {turnoverTable
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
    <div>
      <div>
        <div className="rounded-md border">
          <ScrollArea className="w-[80vw] md:w-full" >
            <Table>
              <TableHeader>
                {turnoverTable.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {turnoverTable.getRowModel().rows?.length ? (
                  turnoverTable.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                    <TableRow>
                      <TableCell colSpan={turnoverColumns.length} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => turnoverTable.previousPage()}
              disabled={!turnoverTable.getCanPreviousPage()}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => turnoverTable.nextPage()}
              disabled={!turnoverTable.getCanNextPage()}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
} 