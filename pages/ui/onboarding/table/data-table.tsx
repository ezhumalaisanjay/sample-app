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
import {
  ChevronLeft,
  ChevronRight,
  Download,
  File,
  FileSpreadsheet,
  FileText,
  ListCollapseIcon,
  Loader2,
  SlidersVertical,
  X,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import AddCandidateForm from "../form/add-candidate"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading: boolean
  isError: boolean
  exportExcel?: () => void
  exportPDF?: () => void
  exportCSV?: () => void
  filterData?: {
    departments: string[]
    jobTitles: string[]
    statuses: string[]
    locations: string[]
  }
}

export type PaginationState = {
  pageIndex: number
  pageSize: number
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  isError,
  exportPDF,
  exportCSV,
  exportExcel,
  filterData,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  })
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    uanNumber: false,
    aadharNumber: false,
    officialEmail: false,
    panNumber: false,
    Address: false,
    School: false,
    Company: false,
    department: false,
    location: false,
  })
  const [mounted, setMounted] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [globalFilter, setGlobalFilter] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  const drawerCloser = () => {
    setDrawerOpen(false)
  }

  const filters = [
    "First name",
    "last name",
    "Email ID",
    "Official Email",
    "Onboarding Status",
    "Department",
    "Source of Hire",
    "PAN card number",
    "Aadhar card number",
    "UAN number",
    "Candidate ID",
    "Present Address",
    "Permanent Address",
    "Phone",
    "Experience",
    "Skill set",
    "Highest Qualification",
    "Location",
    "Title",
    "Current Salary",
    "Additional Information",
    "Offer Letter",
    "Tentative Joining Date",
    "Added By",
    "Added Time",
    "Modified By",
  ]

  /*
  const departments = Array.from(new Set(data.map((item) => item.department)))
  const jobTitles = Array.from(new Set(data.map((item) => item.jobTitle)))
  const statuses = Array.from(new Set(data.map((item) => item.status)))
  const locations = Array.from(new Set(data.map((item) => item.location)))
  */

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
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  })

  if (!mounted) {
    return null
  }

  return (
    <div>
      <div className="flex justify-between flex-wrap sm:flex-nowrap gap-3 items-center p-2">
        <div className="flex w-full gap-2">
          <Input
            placeholder="Search all columns..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm lg:ml-2"
          />
        </div>
        <div className="flex gap-1">
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline">Add Candidate</Button>
            </DrawerTrigger>
            <DrawerContent className="m-4 h-full 2xl:h-max">
              <DrawerHeader>
                <div className="flex justify-between">
                  <DrawerTitle>Add Candidate</DrawerTitle>
                  <DrawerClose asChild>
                    <Button variant={"ghost"}>
                      {" "}
                      <X />{" "}
                    </Button>
                  </DrawerClose>
                </div>
              </DrawerHeader>
              <AddCandidateForm close={drawerCloser} />
            </DrawerContent>
          </Drawer>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <span className="sr-only">Open menu</span>
                <Download className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Download</DropdownMenuLabel>
              <DropdownMenuItem className="hover:cursor-pointer" onClick={exportPDF}>
                <FileText /> PDF
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:cursor-pointer" onClick={exportExcel}>
                <FileSpreadsheet /> Excel
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:cursor-pointer" onClick={exportCSV}>
                <File /> CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost">
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
                        Email
                      </label>
                      <Input
                        id="email"
                        placeholder="Filter by Email"
                        value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
                      />
                    </div>
                    <div className="grid gap-1">
                      <label htmlFor="address" className="text-sm font-medium">
                        Address
                      </label>
                      <Input
                        id="address"
                        placeholder="Filter by Address"
                        value={(table.getColumn("Address")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => table.getColumn("Address")?.setFilterValue(event.target.value)}
                      />
                    </div>
                    <div className="grid gap-1">
                      <label htmlFor="department" className="text-sm font-medium">
                        Department
                      </label>
                      <Select
                        onValueChange={(value) =>
                          table.getColumn("department")?.setFilterValue(value === "all" ? "" : value)
                        }
                      >
                        <SelectTrigger id="department">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          {filterData?.departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-1">
                      <label htmlFor="jobTitle" className="text-sm font-medium">
                        Job Title
                      </label>
                      <Select
                        onValueChange={(value) =>
                          table.getColumn("jobTitle")?.setFilterValue(value === "all" ? "" : value)
                        }
                      >
                        <SelectTrigger id="jobTitle">
                          <SelectValue placeholder="Select job title" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Job Titles</SelectItem>
                          {filterData?.jobTitles.map((title) => (
                            <SelectItem key={title} value={title}>
                              {title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-1">
                      <label htmlFor="status" className="text-sm font-medium">
                        Status
                      </label>
                      <Select
                        onValueChange={(value) =>
                          table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
                        }
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          {filterData?.statuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-1">
                      <label htmlFor="location" className="text-sm font-medium">
                        Location
                      </label>
                      <Select
                        onValueChange={(value) =>
                          table.getColumn("location")?.setFilterValue(value === "all" ? "" : value)
                        }
                      >
                        <SelectTrigger id="location">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          {filterData?.locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
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
      <div>
        <ScrollArea className="rounded-md border w-[84vw] md:w[90vw] lg:w-full">
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                    Loading data...
                  </TableCell>
                </TableRow>
              ) : 
              table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : isError ? 
              (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Error Fetching Data. Try again.
                  </TableCell>
                </TableRow>
              )
              : (
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
      <div className="flex items-center justify-between space-x-2 py-4">
        <PaginationSelection pagination={pagination} setPagination={setPagination} />
        <div className="flex gap-2">
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

