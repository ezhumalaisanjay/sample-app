"use client"

import { useState, useEffect } from "react"
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  type ColumnFiltersState,
  getFilteredRowModel,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import PaginationSelection from "./PaginationState"
import { ChevronLeft, ChevronRight, Download, File, FileText, ListCollapseIcon, Loader2, SheetIcon, SlidersVertical, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import AddUsersForm from "../form/users-form"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading: boolean
  exportExcel?: () => void
  exportPDF?: () => void
  exportCSV?: () => void
}

export type PaginationState = {
  pageIndex: number
  pageSize: number
}

export default function DataTable<TData, TValue>({ columns, data, isLoading, exportCSV, exportExcel, exportPDF }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  })
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [mounted, setMounted] = useState(false)
  const [tenantFilter, setTenantFilter] = useState<string>("all")
  const [groupFilter, setGroupFilter] = useState<string>("all")
  const [handleDrawer, setHandleDrawer] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true)
  }, [])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    filterFns: {
      tenantFilter: (row, id, filterValue) => {
        const rowValue = row.getValue(id) as string
        return filterValue === "all" || rowValue === filterValue
      },
      groupFilter: (row, id, filterValue) => {
        const rowValue = row.getValue(id) as string
        return filterValue === "all" || rowValue === filterValue
      },
    },
  })

  useEffect(() => {
    if (table.getColumn("tenant") && table.getColumn("group")) {
      table.getColumn("tenant")?.setFilterValue(tenantFilter)
      table.getColumn("group")?.setFilterValue(groupFilter)
    }
  }, [tenantFilter, groupFilter, table])

  const closeDrawer = () => {
    setHandleDrawer(false);
  }

  if (!mounted) {
    return null
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Get unique tenants and groups from the data
  const tenants = Array.from(new Set(data.map((item: any) => item.tenant)))
  const groups = Array.from(new Set(data.map((item: any) => item.group)))

  return (
    <div>
      <div className="flex justify-between items-center p-2">
        <div className="flex w-full gap-2">
          <Input
            placeholder="Search Name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="basis-1/3"
          />
        </div>
        <div className="flex items-center">
          <Drawer open={handleDrawer} onOpenChange={setHandleDrawer}>
            <DrawerTrigger asChild>
              <Button variant={"secondary"} className="mr-1 ml-1">Add Users</Button>
            </DrawerTrigger>
            <DrawerContent className="h-full m-4 2xl:h-max">
              <DrawerHeader>
                <div className="flex justify-between items-center">
                  <DrawerTitle>Add Users</DrawerTitle>
                  <DrawerClose> <X /> </DrawerClose>
                </div>
                <AddUsersForm close={closeDrawer} />
              </DrawerHeader>
            </DrawerContent>
          </Drawer>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant={"ghost"}> <SlidersVertical /> </Button>
            </SheetTrigger>
            <SheetContent className="m-4">
              <SheetHeader>
                <SheetTitle>
                  Filter
                </SheetTitle>
                <div className="m-3 flex flex-col w-full gap-3">
                  <Select value={tenantFilter} onValueChange={setTenantFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Tenant" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tenants</SelectItem>
                      {tenants.map((tenant) => (
                        <SelectItem key={tenant} value={tenant}>
                          {tenant}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={groupFilter} onValueChange={setGroupFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Groups</SelectItem>
                      {groups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </SheetHeader>
            </SheetContent>
          </Sheet>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <Download className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Download</DropdownMenuLabel>
              <DropdownMenuItem className="hover:cursor-pointer" onClick={exportPDF} >
                <FileText /> PDF
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:cursor-pointer" onClick={exportExcel} >
                <SheetIcon /> Excel
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:cursor-pointer" onClick={exportCSV} >
                <File /> CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="ml-auto">
                <ListCollapseIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <ScrollArea className="h-[200px] w-[200px] rounded-md">
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
      </div>
      <div className="rounded-md border overflow-x-auto w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
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
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <PaginationSelection pagination={pagination} setPagination={setPagination} />
        <div>
          <Button size="sm" variant="ghost" className="cursor-default font-extralight">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  )
}

