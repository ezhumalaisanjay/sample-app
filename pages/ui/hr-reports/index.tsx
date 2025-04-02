"use client"

import { useState } from "react"
import { DownloadIcon, File, FileText, RefreshCwIcon, SheetIcon, SlidersVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import DemographicsChart from "./charts/demographics-chart"
import HeadcountTable from "./tables/headcount-table"
import TurnoverChart from "./charts/turnover-chart"
import LeaveBalancesChart from "./charts/leave-balance-chart"
import { DateRangePicker } from "@/components/custom/date-range-picker"
import TurnoverTable from "./tables/turnover-table"
import DemographicsTable from "./tables/demographics-table"
import LeaveBalancesTable from "./tables/leavebalances-table"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"
import CustomReportsGenerater from "../custom-reports"
import GamificationChart from "./charts/gamification-chart"
import GamificationTable from "./tables/gamification-table"

// Define proper types for each data structure
type HeadcountDataType = {
  department: string
  headcount: number
  openPositions: number
  newHires: number
  attrition: number
}

type TurnoverDataType = {
  department: string
  voluntaryTurnover: number
  involuntaryTurnover: number
  totalTurnover: number
}

type DemographicsDataType = {
  category: string
  female: number
  male: number
  under30?: number
  thirties?: number
  forties?: number
  fiftyPlus?: number
  remote?: number
  office?: number
  domestic?: number
  international?: number
}

type LeaveDataType = {
  department: string
  availableDays: number
  usedDays: number
  upcomingDays: number
}

const headcountData: HeadcountDataType[] = [
  { department: "Engineering", headcount: 342, openPositions: 15, newHires: 48, attrition: 12 },
  { department: "Sales", headcount: 198, openPositions: 8, newHires: 32, attrition: 18 },
  { department: "Marketing", headcount: 87, openPositions: 4, newHires: 12, attrition: 9 },
  { department: "Product", headcount: 76, openPositions: 3, newHires: 10, attrition: 7 },
  { department: "Customer Support", headcount: 156, openPositions: 6, newHires: 24, attrition: 15 },
]

const turnoverData: TurnoverDataType[] = [
  { department: "Engineering", voluntaryTurnover: 5.2, involuntaryTurnover: 1.8, totalTurnover: 7.0 },
  { department: "Sales", voluntaryTurnover: 8.7, involuntaryTurnover: 2.1, totalTurnover: 10.8 },
  { department: "Marketing", voluntaryTurnover: 6.5, involuntaryTurnover: 1.5, totalTurnover: 8.0 },
  { department: "Product", voluntaryTurnover: 4.8, involuntaryTurnover: 1.2, totalTurnover: 6.0 },
  { department: "Customer Support", voluntaryTurnover: 7.9, involuntaryTurnover: 2.3, totalTurnover: 10.2 },
]

// Helper function to get the current tab data
const getTabData = (tab: string) => {
  switch (tab) {
    case "headcount":
      return headcountData
    case "turnover":
      return turnoverData
    case "demographics":
      // You would need to define this data or fetch it
      return [
        { category: "Gender", female: 52, male: 48 },
        { category: "Age", under30: 25, thirties: 45, forties: 20, fiftyPlus: 10 },
        { category: "Location", remote: 38, office: 62 },
        { category: "International", domestic: 78, international: 22 },
      ]
    case "leave":
      // You would need to define this data or fetch it
      return [
        { department: "Engineering", availableDays: 1250, usedDays: 620, upcomingDays: 28 },
        { department: "Sales", availableDays: 720, usedDays: 380, upcomingDays: 15 },
        { department: "Marketing", availableDays: 310, usedDays: 180, upcomingDays: 12 },
        { department: "Product", availableDays: 280, usedDays: 140, upcomingDays: 8 },
        { department: "Customer Support", availableDays: 560, usedDays: 290, upcomingDays: 24 },
      ]
    default:
      return []
  }
}

// Helper function to get column headers based on tab
const getColumnHeaders = (tab: string) => {
  switch (tab) {
    case "headcount":
      return ["Department", "Headcount", "Open Positions", "New Hires", "Attrition"]
    case "turnover":
      return ["Department", "Voluntary Turnover (%)", "Involuntary Turnover (%)", "Total Turnover (%)"]
    case "demographics":
      return ["Category", "Female (%)", "Male (%)", "Under 30 (%)", "30-39 (%)", "40-49 (%)", "50+ (%)"]
    case "leave":
      return ["Department", "Available Days", "Used Days", "Upcoming Days"]
    default:
      return []
  }
}

// Export to PDF
const exportToPDF = (tab: string) => {
  const doc = new jsPDF()
  const title = `${tab.charAt(0).toUpperCase() + tab.slice(1)} Report`
  const data = getTabData(tab)
  const headers = getColumnHeaders(tab)

  // Add title
  doc.setFontSize(18)
  doc.text(title, 14, 22)
  doc.setFontSize(11)
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)

  // Format data for autotable
  let tableData : any = []
  if (tab === "headcount") {
    const typedData = data as HeadcountDataType[]
    tableData = typedData.map((item) => [item.department, item.headcount, item.openPositions, item.newHires, item.attrition])
  } else if (tab === "turnover") {
    const typedData = data as TurnoverDataType[]
    tableData = typedData.map((item) => [
      item.department,
      item.voluntaryTurnover,
      item.involuntaryTurnover,
      item.totalTurnover,
    ])
  } else if (tab === "demographics") {
    const typedData = data as DemographicsDataType[]
    // Format demographics data
    tableData = typedData.map((item) => {
      if (item.category === "Gender") {
        return [item.category, item.female, item.male, "-", "-", "-", "-"]
      } else if (item.category === "Age") {
        return [item.category, "-", "-", item.under30, item.thirties, item.forties, item.fiftyPlus]
      } else {
        return [item.category, "-", "-", "-", "-", "-", "-"]
      }
    })
  } else if (tab === "leave") {
    const typedData = data as LeaveDataType[]
    tableData = typedData.map((item) => [item.department, item.availableDays, item.usedDays, item.upcomingDays])
  }
  // Add table
  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: 40,
    theme: "grid",
    styles: { fontSize: 10 },
    headStyles: { fillColor: [66, 66, 66] },
  })

  // Save PDF
  doc.save(`${tab}_report.pdf`)
}


// Export to Excel
const exportToExcel = (tab: string) => {
  const data = getTabData(tab)
  const headers = getColumnHeaders(tab)
  const title = `${tab.charAt(0).toUpperCase() + tab.slice(1)} Report`

  // Format data for Excel - specify the correct type to allow both strings and numbers
  let worksheetData: (string | number | null)[][] = [headers]

  if (tab === "headcount") {
    const typedData = data as HeadcountDataType[]
    worksheetData = worksheetData.concat(
      typedData.map((item) => [item.department, item.headcount, item.openPositions, item.newHires, item.attrition]),
    )
  } else if (tab === "turnover") {
    const typedData = data as TurnoverDataType[]
    worksheetData = worksheetData.concat(
      typedData.map((item) => [item.department, item.voluntaryTurnover, item.involuntaryTurnover, item.totalTurnover]),
    )
  } else if (tab === "demographics") {
    const typedData = data as DemographicsDataType[]
    typedData.forEach((item) => {
      if (item.category === "Gender") {
        worksheetData.push([item.category, item.female ?? null, item.male ?? null, null, null, null, null])
      } else if (item.category === "Age") {
        worksheetData.push([
          item.category,
          null,
          null,
          item.under30 ?? null,
          item.thirties ?? null,
          item.forties ?? null,
          item.fiftyPlus ?? null,
        ])
      } else {
        worksheetData.push([item.category, null, null, null, null, null, null])
      }
    })
  } else if (tab === "leave") {
    const typedData = data as LeaveDataType[]
    worksheetData = worksheetData.concat(
      typedData.map((item) => [item.department, item.availableDays, item.usedDays, item.upcomingDays]),
    )
  }

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(worksheetData)

  // Create workbook
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, title)

  // Save Excel file
  XLSX.writeFile(wb, `${tab}_report.xlsx`)
}

// Export to CSV
const exportToCSV = (tab: string) => {
  const data = getTabData(tab)
  const headers = getColumnHeaders(tab)

  // Format data for CSV
  let csvData = headers.join(",") + "\n"

  if (tab === "headcount") {
    const typedData = data as HeadcountDataType[]
    csvData += typedData
      .map((item) => `${item.department},${item.headcount},${item.openPositions},${item.newHires},${item.attrition}`)
      .join("\n")
  } else if (tab === "turnover") {
    const typedData = data as TurnoverDataType[]
    csvData += typedData
      .map((item) => `${item.department},${item.voluntaryTurnover},${item.involuntaryTurnover},${item.totalTurnover}`)
      .join("\n")
  } else if (tab === "demographics") {
    const typedData = data as DemographicsDataType[]
    // Format demographics data
    typedData.forEach((item) => {
      if (item.category === "Gender") {
        csvData += `${item.category},${item.female},${item.male},,,,\n`
      } else if (item.category === "Age") {
        csvData += `${item.category},,,${item.under30},${item.thirties},${item.forties},${item.fiftyPlus}\n`
      } else {
        csvData += `${item.category},,,,,,\n`
      }
    })
  } else if (tab === "leave") {
    const typedData = data as LeaveDataType[]
    csvData += typedData
      .map((item) => `${item.department},${item.availableDays},${item.usedDays},${item.upcomingDays}`)
      .join("\n")
  }

  // Create blob and download
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `${tab}_report.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export default function HRReports() {
  const [detailedReportOpen, setDetailedReportOpen] = useState(false)
  const [currentReport, setCurrentReport] = useState("")

  const DetailedReportContent = ({ reportType }: { reportType: string }) => {
    switch (reportType) {
      case "Headcount":
        return (
          <>
            <h3 className="text-lg font-semibold mb-4">Headcount by Department</h3>
            <div className="flex items-center py-2">
              <HeadcountTable />
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={headcountData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="headcount" fill="#8884d8" name="Headcount" />
                    <Bar dataKey="openPositions" fill="#82ca9d" name="Open Positions" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <h3 className="text-lg font-semibold my-4">Headcount Trends</h3>
            <div className="h-[300px]">
              <TurnoverChart />
            </div>
          </>
        )
      case "Turnover":
        return (
          <>
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold mb-4">Turnover Rates</h3>
              <TurnoverTable />
            </div>
            <h3 className="text-lg font-semibold my-4">Turnover Trends</h3>
            <div className="h-[300px]">
              <TurnoverChart />
            </div>
          </>
        )
      case "Demographics":
        return (
          <>
            <h3 className="text-lg font-semibold mb-4">Workforce Demographics</h3>
            <div className="h-[400px]">
              <DemographicsChart />
            </div>
            <h3 className="text-lg font-semibold my-4">Diversity Metrics</h3>
            <DemographicsTable />
          </>
        )
      case "Leave":
        return (
          <>
            <h3 className="text-lg font-semibold mb-4">Leave Balances Overview</h3>
            <div className="h-[400px]">
              <LeaveBalancesChart />
            </div>
            <h3 className="text-lg font-semibold my-4">Top 5 Departments by PTO Usage</h3>
            <LeaveBalancesTable />
          </>
        )
      case "Gamification":
        return (
          <>
            <h3 className="text-lg font-semibold mb-4">Gamification Overview</h3>
            <div className="h-[400px]">
              <GamificationChart />
            </div>
            <h3 className="text-lg font-semibold my-4">Top 5 Departments by PTO Usage</h3>
            <GamificationTable />
          </>
        )
      default:
        return <p>No detailed report available for this section.</p>
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-2 md:gap-8 md:p-8">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-lg font-semibold md:text-2xl">HR Metrics Reports</h1>
          <div className="md:ml-auto flex items-center gap-2">
            <DateRangePicker />
            <Button variant="outline" size="sm" onClick={() => console.log("Refreshing data...")}>
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <SlidersVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Department</DropdownMenuItem>
                <DropdownMenuItem>Location</DropdownMenuItem>
                <DropdownMenuItem>Job Level</DropdownMenuItem>
                <DropdownMenuItem>Employment Type</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Tabs defaultValue="headcount" className="space-y-4">
          <ScrollArea className="w-[80vw] lg:w-full">
            <TabsList>
              <TabsTrigger value="headcount">Headcount</TabsTrigger>
              <TabsTrigger value="turnover">Turnover</TabsTrigger>
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
              <TabsTrigger value="leave">Leave Balances</TabsTrigger>
              <TabsTrigger value="gamification">Gamification</TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          {["headcount", "turnover", "demographics", "leave", "gamification"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{tab.charAt(0).toUpperCase() + tab.slice(1)} Overview</CardTitle>
                    <CardDescription>
                      {tab === "leave"
                        ? "Employee time off and leave management"
                        : `${tab.charAt(0).toUpperCase() + tab.slice(1)} metrics and trends`}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">Custom Report</Button>
                      </DialogTrigger>
                      <DialogContent className="w-full lg:max-w-4xl">
                        <ScrollArea className="w-full h-[70vh]">
                          <CustomReportsGenerater />
                        <ScrollBar orientation="horizontal"/>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <DownloadIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem className="hover:cursor-pointer" onClick={() => exportToPDF(tab)}>
                          <FileText className="mr-2 h-4 w-4" /> PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:cursor-pointer" onClick={() => exportToExcel(tab)}>
                          <SheetIcon className="mr-2 h-4 w-4" /> Excel
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:cursor-pointer" onClick={() => exportToCSV(tab)}>
                          <File className="mr-2 h-4 w-4" /> CSV
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Content specific to each tab */}
                  {tab === "headcount" && (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-3">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription>Total Employees</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">1,248</div>
                            <p className="text-xs text-muted-foreground">+3.2% from last month</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription>New Hires (YTD)</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">187</div>
                            <p className="text-xs text-muted-foreground">+12.5% from last year</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription>Open Positions</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">42</div>
                            <p className="text-xs text-muted-foreground">-5 from last month</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription>Avg. Time to Hire</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">32 days</div>
                            <p className="text-xs text-muted-foreground">-3 days from last quarter</p>
                          </CardContent>
                        </Card>
                      </div>
                      <HeadcountTable />
                    </>
                  )}
                  {tab === "turnover" && (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-3">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription>Overall Turnover Rate</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">14.2%</div>
                            <p className="text-xs text-muted-foreground">-1.5% from last year</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription>Voluntary Turnover</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">9.8%</div>
                            <p className="text-xs text-muted-foreground">-0.7% from last year</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription>Involuntary Turnover</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">4.4%</div>
                            <p className="text-xs text-muted-foreground">-0.8% from last year</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription>Avg. Tenure</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">3.7 years</div>
                            <p className="text-xs text-muted-foreground">+0.3 years from last year</p>
                          </CardContent>
                        </Card>
                      </div>
                      <TurnoverChart />
                    </>
                  )}
                  {tab === "demographics" && (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-3">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription>Gender Ratio</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">52% / 48%</div>
                            <p className="text-xs text-muted-foreground">Female / Male</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription>Avg. Age</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">34.7</div>
                            <p className="text-xs text-muted-foreground">Years</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription>Remote Workers</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">38%</div>
                            <p className="text-xs text-muted-foreground">+5% from last year</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription>International</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">22%</div>
                            <p className="text-xs text-muted-foreground">Across 14 countries</p>
                          </CardContent>
                        </Card>
                      </div>
                      <DemographicsChart />
                    </>
                  )}
                  {tab === "leave" && (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-3">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription>Total PTO Available</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">4,328 days</div>
                            <p className="text-xs text-muted-foreground">Across all employees</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription>PTO Used (YTD)</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">2,156 days</div>
                            <p className="text-xs text-muted-foreground">49.8% utilization</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription>Avg. PTO Balance</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">8.2 days</div>
                            <p className="text-xs text-muted-foreground">Per employee</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription>Upcoming PTO</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">87 days</div>
                            <p className="text-xs text-muted-foreground">Next 30 days</p>
                          </CardContent>
                        </Card>
                      </div>
                      <LeaveBalancesChart />
                    </>
                  )}
                  {
                    tab === "gamification" && (
                      <>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-3">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardDescription>Total Points Earned</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">1,568,420</div>
                              <p className="text-xs text-muted-foreground">+12.3% from last quarter</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="pb-2">
                              <CardDescription>Badges Awarded</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">3,912</div>
                              <p className="text-xs text-muted-foreground">+8.7% from last quarter</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="pb-2">
                              <CardDescription>Challenge Completion</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">76.4%</div>
                              <p className="text-xs text-muted-foreground">+5.2% from last quarter</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="pb-2">
                              <CardDescription>Engagement Score</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">82/100</div>
                              <p className="text-xs text-muted-foreground">+3 points from last quarter</p>
                            </CardContent>
                          </Card>
                        </div>
                        <GamificationChart />
                      </>
                    )}
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Dialog open={detailedReportOpen} onOpenChange={setDetailedReportOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="ml-auto"
                        size="sm"
                        onClick={() => {
                          setCurrentReport(tab.charAt(0).toUpperCase() + tab.slice(1))
                          setDetailedReportOpen(true)
                        }}
                      >
                        View Detailed Report
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="lg:max-w-4xl">
                      <ScrollArea className="max-h-[80vh]">
                        <DialogHeader>
                          <DialogTitle>{currentReport} Detailed Report</DialogTitle>
                          <DialogDescription>
                            Comprehensive analysis and breakdown of {currentReport.toLowerCase()} data.
                          </DialogDescription>
                        </DialogHeader>
                        <DetailedReportContent reportType={currentReport} />
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}

