"use client"

import { useState } from "react"
import {
  SlidersVertical,
  ArrowUpDown,
  ChevronDown,
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

type DemographicsDataType = {
  metric: string
  value: string | number
}

const demographicsData: DemographicsDataType[] = [
  { metric: "Gender Diversity Index", value: 0.82 },
  { metric: "Ethnic Diversity Index", value: 0.75 },
  { metric: "Age Diversity Score", value: 0.68 },
  { metric: "Disability Representation", value: "4.2%" },
  { metric: "LGBTQ+ Representation", value: "7.5%" },
]


const demographicsColumns: ColumnDef<DemographicsDataType>[] = [
  {
    accessorKey: "metric",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Metric
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("metric")}</div>,
  },
  {
    accessorKey: "value",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Value
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("value")}</div>,
  },
]

export default function DemographicsTable() {
  const [demographicsSorting, setDemographicsSorting] = useState<SortingState>([])
  const [demographicsFilters, setDemographicsFilters] = useState<ColumnFiltersState>([])

  const demographicsTable = useReactTable({
    data: demographicsData,
    columns: demographicsColumns,
    onSortingChange: setDemographicsSorting,
    onColumnFiltersChange: setDemographicsFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: demographicsSorting,
      columnFilters: demographicsFilters,
    },
  })
  
  return( 
    <>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter metrics..."
          value={(demographicsTable.getColumn("metric")?.getFilterValue() as string) ?? ""}
          onChange={(event) => demographicsTable.getColumn("metric")?.setFilterValue(event.target.value)}
          className="max-w-sm mr-4"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {demographicsTable.getHeaderGroups().map((headerGroup) => (
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
            {demographicsTable.getRowModel().rows?.length ? (
              demographicsTable.getRowModel().rows.map((row) => (
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
                <TableCell colSpan={demographicsColumns.length} className="h-24 text-center">
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