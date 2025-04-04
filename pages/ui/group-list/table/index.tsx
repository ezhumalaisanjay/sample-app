"use client"

import { Button } from "@/components/ui/button"
import DataTable from "./data-table"
import { Copy, Trash2, MoreHorizontal, Pencil, X } from "lucide-react"
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
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import TenantGroupForm from "../form/create-group"
import type { Schema } from "@/amplify/data/resource"
import { Amplify } from "aws-amplify"
import outputs from "@/amplify_outputs.json"
import { generateClient } from "aws-amplify/api"
import axios from "axios"

interface Data {
  id: string
  groupName: string
  organization: string
  groupDescription: string
}

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

Amplify.configure(outputs)
const client = generateClient<Schema>()

const GroupListTable = () => {
  const [datas, setDatas] = useState<Data[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [mounted, setMounted] = useState(false)
  const [handleDrawer, setHandleDrawer] = useState<boolean>(false);
  const [organizationName, setOrganizationName] = useState<string>("");

  const { toast } = useToast()

  useEffect(() => {
    const fetchingData = async () => {
      const email = localStorage.getItem("email") || "default@example.com"
      try {
        const { data }: { data: TenantResponse } = await axios.post(
          "/api/getTenantUserPool",
          {
            email: email,
          }
        );

        //console.log("User Login Data", data);
        setOrganizationName(data.TenantData.id);

      } catch (err: any) {
        console.error("❌ error:", err.message);
      }
    }

    fetchingData();
  }, [])


  useEffect(() => {
    setMounted(true)
    
    client.models.Groups.observeQuery().subscribe({
      next: (data: any) => {

        const filteredData = data.items.filter((item: any) => item.organization === organizationName);
        
        const transformedData =  filteredData.map((data: any) => ({
          id: data.id || "",
          groupName: data.groupName || "",
          organization: data.organization || "",
          groupDescription: data.groupDescription || "",
        }));
        
        setDatas(transformedData);
        //console.log("Groups Data :", transformedData);
      },
    }) 

    setTimeout(() => setIsLoading(false), 3000);
  }, [organizationName])

  const exportToPDF = () => {
  try {
    // Create a new jsPDF instance
    const doc = new jsPDF()

    // Define table headers
    const headers = ["ID", "Email", "organization", "Group"]

    // Prepare data for PDF
    const tableData = datas.map((data) => [
      data.id,
      data.groupName,
      data.organization,
      data.groupDescription,
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
      groupName: data.groupName,
      organization : data.organization,
      description : data.groupDescription,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.csv";
    link.click();
  };

  const closeDrawer = () => {
    setHandleDrawer(false);
  }

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
      accessorKey: "groupName",
      header: "Group",
      filterFn: (row, columnId, filterValue: string) => {
        const rowValue = row.getValue(columnId) as string
        return filterValue === "all" || rowValue === filterValue
      },
    },
    {
      accessorKey: "organization",
      header: "Admin",
      filterFn: (row, columnId, filterValue: string) => {
        const rowValue = row.getValue(columnId) as string
        return filterValue === "all" || rowValue === filterValue
      },
    },
    {
      accessorKey: "groupDescription",
      header: "Description",
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
                onClick={() => navigator.clipboard.writeText(rowData.groupName)}
                className="hover:cursor-pointer"
              >
                <Copy /> Copy
              </DropdownMenuItem>
              <div>
                <Drawer>
                  <DrawerTrigger>
                  <div className="flex gap-2 ml-2">
                      <Pencil className="size-4" />
                      <div className="text-sm"> Edit</div>
                    </div>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <div className="flex items-center justify-between">
                        <DrawerTitle>Edit</DrawerTitle>
                        <DrawerClose> <X /> </DrawerClose>
                      </div>
                      <TenantGroupForm data={rowData} close={closeDrawer} />
                    </DrawerHeader>
                  </DrawerContent>
                </Drawer>
              </div>
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
      <div className="w-full max-w-full overflow-hidden">
        <DataTable columns={columns} data={datas} isLoading={isLoading} exportCSV={exportToCSV} exportExcel={exportToExcel} exportPDF={exportToPDF} />
      </div>
    </>
  )
}

export default GroupListTable

