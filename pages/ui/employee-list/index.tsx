"use client"

import { Badge } from "@/components/ui/badge"
import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type OnChangeFn,
  type RowSelectionState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  MoreHorizontal,
  Copy,
  Eye,
  Pencil,
  ListCollapseIcon,
  CalendarIcon,
  Download,
  SlidersVertical,
  ChevronLeft,
  ChevronRight,
  SheetIcon,
  FileText,
  File,
  List,
  Trash2,
  ArrowUpDown,
  Mail,
  UserPlus,
  X,
  BarChart3,
  FileDown,
  Building,
  ShieldCheck,
  Plus,
} from "lucide-react"
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
import Link from "next/link"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import ViewEmployeeDialog from "./view-employee"
import EditEmployeeDialog from "./edit-employee"
import SendMessageDialog from "./send-message"
import DeleteConfirmationDialog from "./delete-employee"
import axios from "axios"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"
import Papa from "papaparse"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
// Add the import for the DeleteConfirmationDialog at the top of the file, after the other imports
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import AddUsersForm from "../users-list/form/users-form"
import { useRouter } from "next/router"
import { Amplify } from "aws-amplify"
import outputs from "@/amplify_outputs.json"
import { generateClient } from "aws-amplify/api"
import type { Schema } from "@/amplify/data/resource"

interface TenantResponse {
  ClientId: string
  TenantData: {
    UserID: string
    admin_email: string
    admin_name: string
    client_id: string
    createdAt: string
    group_name: string
    id: string
    identity_pool_id: string
    phone_number: string
    tenant_name: string
    updatedAt: string
    user_pool_id: string
  }
}

// Update the Employee interface to handle Nullable types
interface Employee {
  id: string
  name?: string
  firstName: string
  lastName: string
  employeeId?: string | null
  department?: string | null
  jobTitle?: string | null
  status?: "Active" | "Inactive" | "On Leave" | "Remote" | "New Hire" | null
  startDate?: string | null
  joiningDate?: string | null
  location?: string | null
  manager?: string | null
  mailId?: string | null
  email?: string | null
  phoneCountryCode?: string | null
  phoneNumber?: string | null
  leaveRequestPending?: boolean
  performanceReviewDue?: boolean
  trainingOverdue?: boolean
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onView: (item: TData) => void
  onEdit: (item: TData) => void
  onDelete: (items: TData[]) => void
  exportExcel?: () => void
  exportPDF?: () => void
  exportCSV?: () => void
  viewMode: "table" | "list"
  setViewMode: React.Dispatch<React.SetStateAction<"table" | "list">>
  setData: React.Dispatch<React.SetStateAction<TData[]>>
  rowSelection: RowSelectionState
  onRowSelectionChange: OnChangeFn<RowSelectionState>
  onAfterMessageSent?: () => void
}

Amplify.configure(outputs)

const client = generateClient<Schema>()

function DataTable<TData extends Employee, TValue>({
  columns,
  data,
  onView,
  onEdit,
  onDelete,
  exportPDF,
  exportCSV,
  exportExcel,
  viewMode,
  setViewMode,
  setData,
  rowSelection,
  onRowSelectionChange,
  onAfterMessageSent,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    location: false,
    manager: false,
  })
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = React.useState<Date | undefined>(undefined)
  const [groupData, setGroupData] = React.useState<string | null>(null)
  const [handleDrawer, setHandleDrawer] = React.useState<boolean>(false)
  const [showSendMessageDialog, setShowSendMessageDialog] = React.useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const [globalFilter, setGlobalFilter] = React.useState("")
  const router = useRouter()
  const { toast } = useToast()
  const [datas, setDatas] = React.useState<Employee[]>([])

  // Keep track of previous data length to detect changes
  const prevDataLength = React.useRef(data.length)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updaterOrValue) => {
      onRowSelectionChange(typeof updaterOrValue === "function" ? updaterOrValue(rowSelection) : updaterOrValue)
    },
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    meta: {
      onView,
      onEdit,
      onDelete,
    },
    onGlobalFilterChange: setGlobalFilter,
  })

  // Reset row selection when data changes (e.g., after deletion)
  React.useEffect(() => {
    if (data.length !== prevDataLength.current) {
      onRowSelectionChange({})
      prevDataLength.current = data.length
    }
  }, [data.length, onRowSelectionChange])

  // Remove 'managers' from the filter options
  const departments = Array.from(new Set(data.map((item) => item.department).filter(Boolean)))
  const jobTitles = Array.from(new Set(data.map((item) => item.jobTitle).filter(Boolean)))
  const statuses = Array.from(new Set(data.map((item) => item.status).filter(Boolean))) as string[]
  const locations = Array.from(new Set(data.map((item) => item.location).filter(Boolean)))

  React.useEffect(() => {
    if (startDate && endDate) {
      table.getColumn("startDate")?.setFilterValue([startDate, endDate])
    }
  }, [startDate, endDate, table])

  React.useEffect(() => {
    const fetchingData = async () => {
      const email = localStorage.getItem("email") || "default@example.com"
      try {
        const response = await axios.post("/api/getTenantUserPool", {
          email: email,
        })

        // Add proper null checking
        if (response?.data?.TenantData?.group_name) {
          setGroupData(response.data.TenantData.group_name)
        } else {
          console.log("Group name not found in response")
          setGroupData(null)
        }
      } catch (err: any) {
        console.error("❌ error:", err.message)
        setGroupData(null)
      }
    }

    fetchingData()
  }, [])

  const closeDrawer = () => {
    setHandleDrawer(false)
  }

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedEmployees = selectedRows.map((row) => row.original)

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedRows.length > 0) {
      onDelete(selectedEmployees)
    }
  }

  // Handle single employee delete
  const handleSingleDelete = (employee: TData) => {
    onDelete([employee])
  }

  // Handle message sent - reset row selection
  const handleMessageSent = () => {
    onRowSelectionChange({})
    if (onAfterMessageSent) {
      onAfterMessageSent()
    }
  }

  // Update the handleExportPDF function to handle null/undefined values
  const handleExportPDF = () => {
    try {
      // Create a new jsPDF instance
      const doc = new jsPDF()

      // Define table headers
      const headers = [
        "ID",
        "Name",
        "EmployeeID",
        "Department",
        "Job Title",
        "Status",
        "StartDate",
        "Location",
        "Manager",
      ]

      // Prepare data for PDF, ensuring all values are strings
      const tableData = datas.map((data) => [
        data.id || "",
        `${data.firstName || ""} ${data.lastName || ""}`.trim(),
        data.employeeId || "",
        data.department || "",
        data.jobTitle || "",
        data.status || "",
        data.joiningDate || data.startDate || "",
        data.location || "",
        data.manager || "",
      ])

      // Add title
      doc.text("Employees Data", 14, 15)

      // Alternative approach using the imported autoTable function
      autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: 20,
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 1 },
        headStyles: { fillColor: [66, 66, 66] },
      })

      doc.save("employees.pdf")
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Error",
        description: "Failed to generate PDF. See console for details.",
        variant: "destructive",
      })
    }

    console.log("Exporting PDF...")
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center py-4 justify-between gap-2">
        <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center border rounded-md overflow-hidden">
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="icon"
              className="rounded-md rounded-r-none flex items-center justify-center border-r"
              onClick={() => setViewMode("table")}
              title="Switch to table view"
            >
              <SheetIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              className="rounded-md rounded-l-none flex items-center justify-center"
              onClick={() => setViewMode("list")}
              title="Switch to list view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Input
            placeholder="Search all columns..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm ml-2"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" onClick={() => setIsDropdownOpen((p) => !p)}>
                {" "}
                {isDropdownOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <ScrollArea>
                <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:cursor-pointer h-10" onClick={() => setHandleDrawer(true)}>
                  <UserPlus />
                  <span>Add New Employee</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:cursor-pointer h-10"
                  onClick={
                    groupData === "tenant" ? () => router.push("/tenant/reports") : () => router.push("/hr/reports")
                  }
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Run Headcount Report</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:cursor-pointer h-10" onClick={exportCSV}>
                  <FileDown className="h-4 w-4" />
                  <span>Export Employee Data (CSV)</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:cursor-pointer h-10">
                  <Building className="h-4 w-4" />
                  <span>Manage Departments</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:cursor-pointer h-10"
                  onClick={
                    groupData === "tenant" ? () => router.push("/tenant/settings") : () => router.push("/hr/settings")
                  }
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Manage Roles & Permissions</span>
                </DropdownMenuItem>
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          {selectedRows.length > 0 && (
            <Button variant="destructive" size="sm" className="h-8" onClick={handleBulkDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete ({selectedRows.length})
            </Button>
          )}
          {groupData === "tenant" && (
            <Drawer open={handleDrawer} onOpenChange={setHandleDrawer}>
              <DrawerTrigger asChild>
                <Button variant="outline">
                  {" "}
                  <UserPlus className="h-4 w-4" />{" "}
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <div className="flex justify-between items-center">
                    <DrawerTitle>Add Users</DrawerTitle>
                    <DrawerClose>
                      {" "}
                      <X />{" "}
                    </DrawerClose>
                  </div>
                </DrawerHeader>
                <AddUsersForm close={closeDrawer} />
              </DrawerContent>
            </Drawer>
          )}
          <Button
            variant="outline"
            size="sm"
            className="ml-auto h-8"
            onClick={() => {
              console.log("Sending message to:", selectedEmployees.map((e) => `${e.name} (${e.mailId})`).join(", "))
              setShowSendMessageDialog(true)
            }}
            disabled={selectedRows.length === 0}
          >
            <Mail className="mr-2 h-4 w-4" />
            Send Message
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <SlidersVertical className="h-4 w-4" />
                {table.getState().columnFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-2 rounded-sm px-1 font-normal lg:hidden">
                    {table.getState().columnFilters.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="m-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Filters</h4>
                  <p className="text-sm text-muted-foreground">Filter employees by various criteria.</p>
                </div>
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <label htmlFor="name" className="text-sm font-medium">
                      Employee Name
                    </label>
                    <Input
                      id="name"
                      placeholder="Filter by name"
                      value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                      onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                    />
                  </div>
                  <div className="grid gap-1">
                    <label htmlFor="employeeId" className="text-sm font-medium">
                      Employee ID
                    </label>
                    <Input
                      id="employeeId"
                      placeholder="Filter by ID"
                      value={(table.getColumn("employeeId")?.getFilterValue() as string) ?? ""}
                      onChange={(event) => table.getColumn("employeeId")?.setFilterValue(event.target.value)}
                    />
                  </div>
                  <div className="grid gap-1">
                    <label htmlFor="manager" className="text-sm font-medium">
                      Manager
                    </label>
                    <Input
                      id="manager"
                      placeholder="Filter by Manager"
                      value={(table.getColumn("manager")?.getFilterValue() as string) ?? ""}
                      onChange={(event) => table.getColumn("manager")?.setFilterValue(event.target.value)}
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
                        {departments.map(
                          (dept) =>
                            dept && (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ),
                        )}
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
                        {jobTitles.map(
                          (title) =>
                            title && (
                              <SelectItem key={title} value={title}>
                                {title}
                              </SelectItem>
                            ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1">
                    <label htmlFor="status" className="text-sm font-medium">
                      Status
                    </label>
                    <Select
                      onValueChange={(value) => table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {statuses.map((status) => (
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
                        {locations.map(
                          (location) =>
                            location && (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1">
                    <label className="text-sm font-medium">Start Date Range</label>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={`w-full sm:w-[140px] justify-start text-left font-normal ${
                              !startDate && "text-muted-foreground"
                            }`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={`w-full sm:w-[140px] justify-start text-left font-normal ${
                              !endDate && "text-muted-foreground"
                            }`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="hover:cursor-pointer" onClick={exportCSV}>
                <File />
                CSV
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:cursor-pointer" onClick={exportPDF}>
                <FileText />
                PDF
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:cursor-pointer" onClick={exportExcel}>
                <SheetIcon />
                Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <ListCollapseIcon />
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
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id === "actions" ? "Actions" : column.id.charAt(0).toUpperCase() + column.id.slice(1)}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        {viewMode === "list" ? (
          <div className="space-y-2 mt-2 p-4">
            <div className="flex items-center mb-4">
              <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="mr-2"
              />
              <span>Select All</span>
            </div>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <div key={row.id} className="border rounded-md p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex items-start md:items-center">
                      <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                        className="mr-4 mt-1"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div className="flex flex-col">
                          {table.getColumn("name")?.getIsVisible() && (
                            <Link href={`/employee/${row.original.id}`} className="font-medium text-lg">
                              {row.getValue("name")}
                            </Link>
                          )}
                          <div className="text-sm text-muted-foreground">
                            {table.getColumn("employeeId")?.getIsVisible() && <span>{row.getValue("employeeId")}</span>}
                            {table.getColumn("jobTitle")?.getIsVisible() && <span> • {row.getValue("jobTitle")}</span>}
                          </div>
                          {table.getColumn("mailId")?.getIsVisible() && (
                            <div className="text-sm text-muted-foreground">Mail ID: {row.getValue("mailId")}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2 md:mt-0">
                          {table.getColumn("status")?.getIsVisible() && (
                            <Badge
                              variant={
                                row.getValue("status") === "Active"
                                  ? "default"
                                  : row.getValue("status") === "Inactive"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {row.getValue("status")}
                            </Badge>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                className="hover:cursor-pointer"
                                onClick={() => navigator.clipboard.writeText(row.original.id)}
                              >
                                <Copy className="mr-2 h-4 w-4" /> Copy ID
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:cursor-pointer" onClick={() => onView(row.original)}>
                                <Eye className="mr-2 h-4 w-4" /> View
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:cursor-pointer" onClick={() => onEdit(row.original)}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="hover:cursor-pointer text-red-600"
                                onClick={() => handleSingleDelete(row.original)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                        {table.getColumn("department")?.getIsVisible() && (
                          <div className="flex flex-col space-y-1">
                            <span className="text-sm font-medium">Department:</span>
                            <span className="text-sm truncate">{row.getValue("department")}</span>
                          </div>
                        )}
                        {table.getColumn("startDate")?.getIsVisible() && (
                          <div className="flex flex-col space-y-1">
                            <span className="text-sm font-medium">Start Date:</span>
                            <span className="text-sm truncate">{row.getValue("startDate")}</span>
                          </div>
                        )}
                        {table.getColumn("location")?.getIsVisible() && row.original.location && (
                          <div className="flex flex-col space-y-1">
                            <span className="text-sm font-medium">Location:</span>
                            <span className="text-sm truncate">{row.original.location}</span>
                          </div>
                        )}
                        {table.getColumn("mailId")?.getIsVisible() && row.original.mailId && (
                          <div className="flex flex-col space-y-1">
                            <span className="text-sm font-medium">Mail ID:</span>
                            <span className="text-sm truncate">{row.original.mailId}</span>
                          </div>
                        )}
                        {table.getColumn("manager")?.getIsVisible() && row.original.manager && (
                          <div className="flex flex-col space-y-1">
                            <span className="text-sm font-medium">Manager:</span>
                            <span className="text-sm truncate">{row.original.manager}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4 border rounded-md">No results.</div>
            )}
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <ScrollArea className="lg:w-full md:w-[90vw] w-[85vw]">
              <Table className="min-w-[800px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px] px-2">
                      <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                      />
                    </TableHead>
                    {table
                      .getHeaderGroups()
                      .map((headerGroup) =>
                        headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        )),
                      )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                        <TableCell className="w-[40px] px-2">
                          <Checkbox
                            checked={row.getIsSelected()}
                            onCheckedChange={(value) => row.toggleSelected(!!value)}
                            aria-label="Select row"
                          />
                        </TableCell>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 space-x-0 sm:space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground">Rows Per Page</div>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[4, 6, 8, 10, 15, 20, 30].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <span className="text-sm text-muted-foreground mr-2">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <SendMessageDialog
        open={showSendMessageDialog}
        onClose={() => setShowSendMessageDialog(false)}
        selectedEmployees={selectedEmployees}
        onMessageSent={handleMessageSent}
      />
    </div>
  )
}

export default function EmployeeListTable() {
  const [viewEmployee, setViewEmployee] = React.useState<Employee | null>(null)
  const [editEmployee, setEditEmployee] = React.useState<Employee | null>(null)
  const [viewMode, setViewMode] = React.useState<"table" | "list">("table")
  const { toast } = useToast()
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [employeesToDelete, setEmployeesToDelete] = React.useState<Employee[]>([])
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [datas, setDatas] = React.useState<Employee[]>([]);
  const [organizationName, setOrganizationName] = React.useState<string>("");


  // Update the responseData function to handle Nullable types
  function responseData() {
    client.models.Onboarding.observeQuery().subscribe({
      next: (data) => {
        const filteredData = data.items.filter((item) => item.organization === organizationName);

        const transformedData = filteredData.map((item) => ({
          id: item.id,
          firstName: item.firstName || "",
          lastName: item.lastName || "",
          name: `${item.firstName || ""} ${item.lastName || ""}`.trim(),
          employeeId: item.employeeId,
          department: item.department,
          jobTitle: item.jobTitle,
          status: item.status as "Active" | "Inactive" | "On Leave" | "Remote" | "New Hire" | null,
          startDate: item.joiningDate,
          joiningDate: item.joiningDate,
          location: item.location,
          manager: item.manager,
          mailId: item.email,
          email: item.email,
          phoneCountryCode: item.phoneCountryCode,
          phoneNumber: item.phoneNumber,
          leaveRequestPending: false,
          performanceReviewDue: false,
          trainingOverdue: false,
        }))
        setDatas(transformedData)
      },
    })
  }

  React.useEffect(() => {
    console.log("Employee Table Data", datas);
  }, [datas])

  React.useEffect(() => {
    const fetchingData = async () => {
      const email = localStorage.getItem("email") || "default@example.com"
      try {
        const { data }: { data: TenantResponse } = await axios.post(
          "/api/getTenantUserPool",
          {
            email: email,
          }
        );

        console.log("User Login Data", data);
        setOrganizationName(data.TenantData.id);

      } catch (err: any) {
        console.error("❌ error:", err.message);
      }
    }

    fetchingData();
  }, [])

  React.useEffect(() => {

    responseData()
  }, [organizationName])

  // Handle deleting multiple employees
  const handleDeleteEmployees = (employees: Employee[]) => {
    setEmployeesToDelete(employees)
    setDeleteDialogOpen(true)
  }

  // Add this new function to handle the actual deletion after confirmation
  
  async function confirmDelete(id: string) {
    try {
      // First, fetch all related education records
      const educationRecords = await client.models.Education.list({
        filter: { onboardingID: { eq: id } },
      })

      // Delete each education record
      for (const edu of educationRecords.data) {
        if (edu.id) {
          await client.models.Education.delete({ id: edu.id })
        }
      }

      // Next, fetch all related experience records
      const experienceRecords = await client.models.Experience.list({
        filter: { onboardingID: { eq: id } },
      })

      // Delete each experience record
      for (const exp of experienceRecords.data) {
        if (exp.id) {
          await client.models.Experience.delete({ id: exp.id })
        }
      }

      // Finally, delete the onboarding record
      await client.models.Onboarding.delete({ id })

      toast({
        title: "Success",
        description: "Candidate and all related data deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting data:", error)
      toast({
        title: "Error",
        description: "Failed to delete candidate data. Please try again.",
        variant: "destructive",
      })
    }
    setDeleteDialogOpen(false);
  }

  const handleExportCSV = () => {
    const csvData = datas.map((data) => ({
      id: data.id,
      name: data.name || `${data.firstName} ${data.lastName}`,
      employeeId: data.employeeId,
      department: data.department,
      jobTitle: data.jobTitle,
      status: data.status,
      startDate: data.joiningDate || data.startDate,
      location: data.location,
      manager: data.manager,
      email: data.email || data.mailId,
    }))

    const csv = Papa.unparse(csvData)
    const blob = new Blob([csv], { type: "text/csv" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "employees.csv"
    link.click()
    console.log("Exporting CSV...")
  }

  // Update the handleExportPDF function to handle null/undefined values
  const handleExportPDF = () => {
    try {
      // Create a new jsPDF instance
      const doc = new jsPDF()

      // Define table headers
      const headers = [
        "ID",
        "Name",
        "EmployeeID",
        "Department",
        "Job Title",
        "Status",
        "StartDate",
        "Location",
        "Manager",
      ]

      // Prepare data for PDF, ensuring all values are strings
      const tableData = datas.map((data) => [
        data.id || "",
        `${data.firstName || ""} ${data.lastName || ""}`.trim(),
        data.employeeId || "",
        data.department || "",
        data.jobTitle || "",
        data.status || "",
        data.joiningDate || data.startDate || "",
        data.location || "",
        data.manager || "",
      ])

      // Add title
      doc.text("Employees Data", 14, 15)

      // Alternative approach using the imported autoTable function
      autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: 20,
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 1 },
        headStyles: { fillColor: [66, 66, 66] },
      })

      doc.save("employees.pdf")
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Error",
        description: "Failed to generate PDF. See console for details.",
        variant: "destructive",
      })
    }

    console.log("Exporting PDF...")
  }

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(datas)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Data")
    XLSX.writeFile(wb, "data.xlsx")

    console.log("Exporting Excel...")
  }

  // Handle after message sent - reset row selection
  const handleAfterMessageSent = () => {
    setRowSelection({})
  }

  // Remove the 'select' column definition from here
  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "employeeId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "department",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Dept
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "jobTitle",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <Badge
          variant={
            row.getValue("status") === "Active"
              ? "default"
              : row.getValue("status") === "Inactive"
                ? "secondary"
                : "outline"
          }
        >
          {row.getValue("status")}
        </Badge>
      ),
    },
    {
      accessorKey: "startDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Start
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const startDate = row.getValue("startDate") || row.original.joiningDate

        if (!startDate) {
          return <span className="text-muted-foreground">Not set</span>
        }

        try {
          // Parse the date string to a Date object
          const date = new Date(startDate as string)

          // Check if the date is valid
          if (isNaN(date.getTime())) {
            return <span className="text-muted-foreground">Invalid date</span>
          }

          // Format the date using date-fns
          return <span>{format(date, "MMM d, yyyy")}</span>
        } catch (error) {
          console.error("Error formatting date:", error)
          return <span className="text-muted-foreground">Invalid date</span>
        }
      },
    },
    {
      accessorKey: "location",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Location
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "manager",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Manager
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "mailId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Mail ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("mailId")}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={() => navigator.clipboard.writeText(row.original.id)}
            >
              <Copy className="mr-2 h-4 w-4" /> Copy ID
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={() => {
                setViewEmployee(row.original)
              }}
            >
              <Eye className="mr-2 h-4 w-4" /> View
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={() => {
                setEditEmployee(row.original)
              }}
            >
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer text-red-600"
              onClick={() => handleDeleteEmployees([row.original])}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={datas}
        onView={(employee) => setViewEmployee(employee)}
        onEdit={(employee) => setEditEmployee(employee)}
        onDelete={handleDeleteEmployees}
        exportCSV={handleExportCSV}
        exportPDF={handleExportPDF}
        exportExcel={handleExportExcel}
        viewMode={viewMode}
        setViewMode={setViewMode}
        setData={setDatas}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        onAfterMessageSent={handleAfterMessageSent}
      />
      <ViewEmployeeDialog employee={viewEmployee} open={!!viewEmployee} onClose={() => setViewEmployee(null)} />
      <EditEmployeeDialog
        employee={{
          id: editEmployee?.id || "",
          firstName: editEmployee?.firstName || "",
          lastName: editEmployee?.lastName || "",
          employeeId: editEmployee?.employeeId || "",
          department: editEmployee?.department || "",
          jobTitle: editEmployee?.jobTitle || "",
          status: editEmployee?.status || "Active",
          startDate: editEmployee?.startDate || "",
          location: editEmployee?.location || "",
          manager: editEmployee?.manager || "",
          leaveRequestPending: false,
          performanceReviewDue: false,
          trainingOverdue: false,
          mailId: editEmployee?.mailId || "",
        }}
        open={!!editEmployee}
        onClose={() => setEditEmployee(null)}
      />
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        selectedEmployees={employeesToDelete}
      />
    </>
  )
}

