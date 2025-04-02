"use client"

import { useState } from "react"
import {
  SlidersVertical,
  ArrowUpDown,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type LeaveBalancesDataType = {
  department: string
  avgPTOUsed: number
  avgPTOBalance: number
}

const leaveBalancesData: LeaveBalancesDataType[] = [
  { department: "Sales", avgPTOUsed: 15.2, avgPTOBalance: 5.8 },
  { department: "Marketing", avgPTOUsed: 14.7, avgPTOBalance: 6.3 },
  { department: "Engineering", avgPTOUsed: 13.5, avgPTOBalance: 7.2 },
  { department: "Product", avgPTOUsed: 12.8, avgPTOBalance: 8.1 },
  { department: "Customer Support", avgPTOUsed: 16.4, avgPTOBalance: 4.5 },
]
const leaveBalancesColumns: ColumnDef<LeaveBalancesDataType>[] = [
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
    accessorKey: "avgPTOUsed",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Average PTO Used
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("avgPTOUsed")} days</div>,
  },
  {
    accessorKey: "avgPTOBalance",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Average PTO Balance
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("avgPTOBalance")} days</div>,
  },
]

export default function LeaveBalancesTable() {
  
  const [leaveBalancesSorting, setLeaveBalancesSorting] = useState<SortingState>([])
  const [leaveBalancesFilters, setLeaveBalancesFilters] = useState<ColumnFiltersState>([])

  const leaveBalancesTable = useReactTable({
    data: leaveBalancesData,
    columns: leaveBalancesColumns,
    onSortingChange: setLeaveBalancesSorting,
    onColumnFiltersChange: setLeaveBalancesFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: leaveBalancesSorting,
      columnFilters: leaveBalancesFilters,
    },
  })


  return(
    <>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter departments..."
          value={(leaveBalancesTable.getColumn("department")?.getFilterValue() as string) ?? ""}
          onChange={(event) => leaveBalancesTable.getColumn("department")?.setFilterValue(event.target.value)}
          className="max-w-sm mr-4"
        />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant={"ghost"} className="ml-auto"> <SlidersVertical /> </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Filters</h4>
                <p className="text-sm text-muted-foreground">Filter by various criteria.</p>
              </div>
              <Input
                placeholder="Filter departments..."
                value={(leaveBalancesTable.getColumn("department")?.getFilterValue() as string) ?? ""}
                onChange={(event) => leaveBalancesTable.getColumn("department")?.setFilterValue(event.target.value)}
                className="max-w-sm mr-4"
              />
              <Select
                onValueChange={(value) => {
                  if (value === "high") {
                    setLeaveBalancesSorting([{ id: "avgPTOUsed", desc: true }])
                  } else if (value === "low") {
                    setLeaveBalancesSorting([{ id: "avgPTOUsed", desc: false }])
                  } else {
                    setLeaveBalancesSorting([])
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by PTO usage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Highest Usage First</SelectItem>
                </SelectContent>
                <SelectContent>
                  <SelectItem value="high">Highest Usage First</SelectItem>
                  <SelectItem value="low">Lowest Usage First</SelectItem>
                  <SelectItem value="none">No Sorting</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {leaveBalancesTable.getHeaderGroups().map((headerGroup) => (
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
            {leaveBalancesTable.getRowModel().rows?.length ? (
              leaveBalancesTable.getRowModel().rows.map((row) => (
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
                <TableCell colSpan={leaveBalancesColumns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}