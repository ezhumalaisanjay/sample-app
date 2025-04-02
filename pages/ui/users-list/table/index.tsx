"use client"

import { Button } from "@/components/ui/button"
import DataTable from "./data-table"
import { Copy, Trash2, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx";
import Papa from "papaparse";

interface Data {
  id: number
  name: string
  email: string
  tenant: string
  group: string
}

const UsersListTable = () => {
  const [datas, setDatas] = useState<Data[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [mounted, setMounted] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    // Simulate data fetching
    setTimeout(() => {
      setDatas([
        { id: 1, name: "Alice Johnson", email: "alice@example.com", tenant: "Tenant A", group: "Group 1" },
        { id: 2, name: "Bob Smith", email: "bob@example.com", tenant: "Tenant B", group: "Group 2" },
        { id: 3, name: "Charlie Brown", email: "charlie@example.com", tenant: "Tenant A", group: "Group 1" },
        { id: 4, name: "David Lee", email: "david@example.com", tenant: "Tenant B", group: "Group 2" },
        { id: 5, name: "Eva Martinez", email: "eva@example.com", tenant: "Tenant A", group: "Group 2" },
        { id: 6, name: "Frank Wilson", email: "frank@example.com", tenant: "Tenant B", group: "Group 1" },
        { id: 7, name: "Grace Taylor", email: "grace@example.com", tenant: "Tenant A", group: "Group 1" },
        { id: 8, name: "Henry Davis", email: "henry@example.com", tenant: "Tenant B", group: "Group 2" },
        { id: 9, name: "Ivy Chen", email: "ivy@example.com", tenant: "Tenant A", group: "Group 2" },
        { id: 10, name: "Jack Brown", email: "jack@example.com", tenant: "Tenant B", group: "Group 1" },
        { id: 11, name: "Karen White", email: "karen@example.com", tenant: "Tenant A", group: "Group 1" },
        { id: 12, name: "Liam Harris", email: "liam@example.com", tenant: "Tenant B", group: "Group 2" },
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  const exportToPDF = () => {
  try {
    // Create a new jsPDF instance
    const doc = new jsPDF()

    // Define table headers
    const headers = ["ID", "Email", "Tenant", "Group"]

    // Prepare data for PDF
    const tableData = datas.map((data) => [
      data.id,
      data.email,
      data.tenant,
      data.group,
    ])

    // Add title
    doc.text("Users Data", 14, 15)

    // Alternative approach using the imported autoTable function
    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 20,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 1 },
      headStyles: { fillColor: [66, 66, 66] },
    })

    doc.save("users.pdf")
  } catch (error) {
    console.error("Error generating PDF:", error)
    toast({
      title: "Error",
      description: "Failed to generate PDF. See console for details.",
      variant: "destructive",
      })
    }
  }

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(datas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "data.xlsx");
  };

  const exportToCSV = () => {
    const csvData = datas.map((data) => ({
      id : data.id,
      email: data.email,
      tenant : data.tenant,
      group : data.group,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.csv";
    link.click();
  };

  const columns: ColumnDef<Data>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "tenant",
      header: "Tenant",
      filterFn: (row, columnId, filterValue: string) => {
        const rowValue = row.getValue(columnId) as string
        return filterValue === "all" || rowValue === filterValue
      },
    },
    {
      accessorKey: "group",
      header: "Group",
      filterFn: (row, columnId, filterValue: string) => {
        const rowValue = row.getValue(columnId) as string
        return filterValue === "all" || rowValue === filterValue
      },
    },
    {
      id: "modify",
      cell: ({ row }) => {
        const rowData = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Modifications</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(rowData.name)}
                className="hover:cursor-pointer"
              >
                <Copy /> Copy
              </DropdownMenuItem>
              <div className="ml-2"></div>
              <div>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <div className="flex gap-2 ml-2">
                      <Trash2 className="size-4" />
                      <div className="text-sm"> Delete</div>
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle> Are you absolutely sure? </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your data from the servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          const newArray = datas?.filter((data) => data.id !== rowData.id)
                          console.log("This is new Array", newArray)
                          setDatas(newArray)
                          toast({
                            title: "Data",
                            description: "Data has been deleted Successfully",
                          })
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  if (!mounted) {
    return null
  }

  return (
    <>
      <DataTable columns={columns} data={datas} isLoading={isLoading} exportCSV={exportToCSV} exportExcel={exportToExcel} exportPDF={exportToPDF} />
    </>
  )
}

export default UsersListTable

