"use client"

import { Button } from "@/components/ui/button"
import { Copy, Trash2, MoreHorizontal, X, Pencil } from "lucide-react"
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
import { useCallback, useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import OnboardingTable from "./data-table"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import AddCandidateForm from "../form/add-candidate"
import type { Schema } from "@/amplify/data/resource"
import { Amplify } from "aws-amplify"
import outputs from "@/amplify_outputs.json"
import { generateClient } from "aws-amplify/api"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"
import Papa from "papaparse"
import { Badge } from "@/components/ui/badge"
import axios from "axios"

interface Data {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneCountryCode: string
  phoneNumber: string
  uanNumber: string
  panNumber: string
  aadharNumber: string
  officialEmail: string
  sourceofhire?: string
  skillset?: string
  currentSalary?: string
  qualifications?: string
  joiningDate?: Date
  presentAddressLine1: string
  presentAddressLine2?: string
  presentAddressCity: string
  presentAddressState?: string
  presentAddressCountry: string
  presentAddressPostalCode: string
  permanentAddressSameAsPresent: boolean
  permanentAddressLine1?: string
  permanentAddressLine2?: string
  permanentAddressCity?: string
  permanentAddressState?: string
  permanentAddressCountry?: string
  permanentAddressPostalCode?: string
  department: string
  jobTitle: string
  location: string
  status: string
  createdAt: string
  updatedAt: string
  education: Array<{
    schoolName: string
    degree: string
    fieldOfStudy: string
    completionDate: Date
    notes: string
  }>
  experience: Array<{
    occupation: string
    company: string
    summary: string
    duration: string
    notes: string
  }>
  photo?: any
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

const UsersListTable = () => {
  const [datas, setDatas] = useState<Data[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [mounted, setMounted] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [onboardingSubscription, setOnboardingSubscription] = useState<any>(null)
  const [educationSubscription, setEducationSubscription] = useState<any>(null)
  const [experienceSubscription, setExperienceSubscription] = useState<any>(null)
  const [onboardingData, setOnboardingData] = useState<Array<any>>([])
  const [educationData, setEducationData] = useState<Array<any>>([])
  const [experienceData, setExperienceData] = useState<Array<any>>([])
  const [organizationName, setOrganizationName] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

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

        setOrganizationName(data.TenantData.id);
        setIsLoading(false);

      } catch (err: any) {
        console.error("❌ error:", err.message);      
        setIsError(true);
        setIsLoading(false);
      }
    }

    fetchingData();
  }, [])

  // Function to fetch and combine all data
  const combineData = useCallback(async () => {
    if (onboardingData.length === 0) return

    try {
      // Create a map of education and experience records by onboardingID for faster lookup
      const educationMap = new Map()
      educationData.forEach((edu) => {
        if (edu.onboardingID) {
          if (!educationMap.has(edu.onboardingID)) {
            educationMap.set(edu.onboardingID, [])
          }
          educationMap.get(edu.onboardingID).push(edu)
        }
      })

      const experienceMap = new Map()
      experienceData.forEach((exp) => {
        if (exp.onboardingID) {
          if (!experienceMap.has(exp.onboardingID)) {
            experienceMap.set(exp.onboardingID, [])
          }
          experienceMap.get(exp.onboardingID).push(exp)
        }
      })

      // Combine the data
      const combinedData = onboardingData.map((onboarding) => ({
        ...onboarding,
        education: educationMap.get(onboarding.id) || [],
        experience: experienceMap.get(onboarding.id) || [],
      }))

      const organizationFilterData = combinedData.filter((data) => data.organization === organizationName);
      
      const filteredData = organizationFilterData.filter((data) => data.status === "New Hire")

      //console.log("filtered Data", filteredData);
      setDatas(filteredData);
      setTimeout(() => {setIsLoading(false)}, 2000);
    } catch (error) {
      console.error("Error combining data:", error)
      setIsLoading(false);
      setIsError(true);
    }
  }, [onboardingData, educationData, experienceData, organizationName])

  // Set up subscriptions
  const setupSubscriptions = useCallback(() => {
    // Onboarding subscription
    const onboardingSub = client.models.Onboarding.observeQuery().subscribe({
      next: (data) => {
        //console.log("Onboarding data updated:", data.items)
        setOnboardingData([...data.items])
      },
      error: (error) => {
        console.error("Onboarding subscription error:", error)
        setIsError(true);
        setIsLoading(false);
      },
    })

    // Education subscription
    const educationSub = client.models.Education.observeQuery().subscribe({
      next: (data) => {
        //console.log("Education data updated:", data.items)
        setEducationData([...data.items])
      },
      error: (error) => {
        console.error("Education subscription error:", error)
        setIsError(true);
        setIsLoading(false);
      },
    })

    // Experience subscription
    const experienceSub = client.models.Experience.observeQuery().subscribe({
      next: (data) => {
        //console.log("Experience data updated:", data.items)
        setExperienceData([...data.items])
      },
      error: (error) => {
        setIsError(true);
        setIsLoading(false);
        console.error("Experience subscription error:", error)
      },
    })

    setOnboardingSubscription(onboardingSub)
    setEducationSubscription(educationSub)
    setExperienceSubscription(experienceSub)

    return () => {
      onboardingSub.unsubscribe()
      educationSub.unsubscribe()
      experienceSub.unsubscribe()
    }
  }, [])

  // Cleanup subscriptions on unmount
  useEffect(() => {
    return () => {
      if (onboardingSubscription) onboardingSubscription.unsubscribe()
      if (educationSubscription) educationSubscription.unsubscribe()
      if (experienceSubscription) experienceSubscription.unsubscribe()
    }
  }, [onboardingSubscription, educationSubscription, experienceSubscription])

  // Combine data whenever any of the source data changes
  useEffect(() => {
    
    combineData()
  }, [onboardingData, educationData, experienceData, combineData])

  // Initialize component
  useEffect(() => {
    setMounted(true)
    const cleanup = setupSubscriptions()
    return cleanup
  }, [setupSubscriptions])

  async function deleteData(id: string) {
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
  }

  const drawerClose = () => {
    setDrawerOpen(false)
  }

  const exportToPDF = () => {
    try {
      // Create a new jsPDF instance
      const doc = new jsPDF()

      // Define table headers
      const headers = ["Name", "Email", "Phone", "Aadhar", "UAN", "PAN", "Address"]

      // Prepare data for PDF
      const tableData = datas.map((data) => [
        `${data.firstName} ${data.lastName}`,
        data.email,
        `${data.phoneCountryCode} ${data.phoneNumber}`,
        data.aadharNumber,
        data.uanNumber,
        data.panNumber || "N/A",
        `${data.presentAddressLine1}, ${data.presentAddressLine2}, ${data.presentAddressCity}, ${data.presentAddressCountry}, ${data.presentAddressState}`,
      ])

      // Add title
      doc.text("Candidates Data", 14, 15)

      // Alternative approach using the imported autoTable function
      autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: 20,
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 1 },
        headStyles: { fillColor: [66, 66, 66] },
      })

      doc.save("candidates-data.pdf")
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
    const ws = XLSX.utils.json_to_sheet(datas)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Data")
    XLSX.writeFile(wb, "data.xlsx")
  }

  const exportToCSV = () => {
    const csvData = datas.map((data) => ({
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phoneNo: `${data.phoneCountryCode} ${data.phoneNumber}`,
      aadhar: data.aadharNumber,
      uan: data.uanNumber,
      pan: data.panNumber || "N/A",
      address: `${data.presentAddressLine1}, ${data.presentAddressLine2}, ${data.presentAddressCity}, ${data.presentAddressCountry}, ${data.presentAddressState}`,
      officialEmail: data.officialEmail,
    }))

    const csv = Papa.unparse(csvData)
    const blob = new Blob([csv], { type: "text/csv" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "data.csv"
    link.click()
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
      enableColumnFilter: true,
    },
    {
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      header: "Name",
      enableColumnFilter: true,
    },
    {
      accessorKey: "email",
      header: "Email",
      enableColumnFilter: true,
    },
    {
      accessorFn: (row) => `${row.phoneCountryCode} ${row.phoneNumber}`,
      header: "Phone No",
      enableColumnFilter: true,
    },
    {
      accessorFn: (row) => {
        if (row.education && row.education.length > 0) {
          return row.education[0].schoolName || "N/A"
        }
        return "N/A"
      },
      header: "School",
      enableColumnFilter: true,
    },
    {
      accessorFn: (row) => {
        if (row.experience && row.experience.length > 0) {
          return row.experience[0].company || "N/A"
        }
        return "N/A"
      },
      header: "Company",
      enableColumnFilter: true,
    },
    {
      accessorKey: "uanNumber",
      header: "UAN",
      enableColumnFilter: true,
    },
    {
      accessorKey: "aadharNumber",
      header: "Aadhar",
      enableColumnFilter: true,
    },
    {
      accessorKey: "officialEmail",
      header: "Official Email",
      enableColumnFilter: true,
    },
    {
      accessorKey: "panNumber",
      header: "PAN",
      enableColumnFilter: true,
    },
    {
      accessorFn: (row) => {
        return `${row.presentAddressLine1}, ${row.presentAddressCity}, ${row.presentAddressState || ""}, ${row.presentAddressCountry} ${row.presentAddressPostalCode}`
      },
      header: "Address",
      enableColumnFilter: true,
    },
    {
      accessorKey: "department",
      header: "Department",
    },
    {
      accessorKey: "jobTitle",
      header: "Position",
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({row}) => {
        const rowData = row.original;
        const statusData = rowData.status;
        return (
          <>
            <Badge className="bg-green-500 text-nowrap hover:bg-green-400 text-white">{statusData}</Badge>
          </>
        )
      }
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
                onClick={() => navigator.clipboard.writeText(rowData.firstName)}
                className="hover:cursor-pointer"
              >
                <Copy /> Copy
              </DropdownMenuItem>
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="ghost" className="h-8 w-full p-2">
                    <div className="flex gap-2 w-full justify-start items-center">
                      <Pencil className="h-4 w-4" />
                      <span className="font-normal">Edit</span>
                    </div>
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="m-4 h-full 2xl:h-max">
                  <DrawerHeader>
                    <div className="flex justify-between">
                      <DrawerTitle>Edit Candidate Details</DrawerTitle>
                      <DrawerClose asChild>
                        <Button variant={"ghost"}>
                          {" "}
                          <X />{" "}
                        </Button>
                      </DrawerClose>
                    </div>
                  </DrawerHeader>
                  <AddCandidateForm close={drawerClose} data={rowData} />
                </DrawerContent>
              </Drawer>
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
                          deleteData(rowData.id)
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

  const getUniqueValues = (data: Data[], key: keyof Data) => {
    const values = data.map((item) => item[key])
    return Array.from(new Set(values)).filter(Boolean)
  }

  // Extract unique values for filters
  const departments = getUniqueValues(datas, "department")
  const jobTitles = getUniqueValues(datas, "jobTitle")
  const statuses = getUniqueValues(datas, "status")
  const locations = getUniqueValues(datas, "location")

  if (!mounted) {
    return null
  }

  return (
    <>
      <div>
        <OnboardingTable
          columns={columns}
          data={datas}
          isError={isError}
          isLoading={isLoading}
          exportPDF={exportToPDF}
          exportCSV={exportToCSV}
          exportExcel={exportToExcel}
          filterData={{
            departments,
            jobTitles,
            statuses,
            locations,
          }}
        />
      </div>
    </>
  )
}

export default UsersListTable

