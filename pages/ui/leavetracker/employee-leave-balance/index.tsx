"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Loader2, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import LeaveRequestPage from "../leave-request"

type LeaveBalance = {
  type: string
  balance: number
  unit: string
}

type LeaveRequest = {
  id: string
  type: string
  startDate: string
  endDate: string
  status: "pending" | "approved" | "rejected"
}

export default function EmployeeLeaveBalanceAndHistoryPage() {
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([])
  const [leaveHistory, setLeaveHistory] = useState<LeaveRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  // Simulating API call to fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real application, you would fetch this data from your API
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

        setLeaveBalances([
          { type: "Annual Leave", balance: 15, unit: "days" },
          { type: "Sick Leave", balance: 10, unit: "days" },
          { type: "Personal Leave", balance: 3, unit: "days" },
        ])

        setLeaveHistory([
          { id: "1", type: "Annual Leave", startDate: "2023-06-01", endDate: "2023-06-05", status: "approved" },
          { id: "2", type: "Sick Leave", startDate: "2023-07-10", endDate: "2023-07-11", status: "approved" },
          { id: "3", type: "Personal Leave", startDate: "2023-08-15", endDate: "2023-08-15", status: "rejected" },
          { id: "4", type: "Annual Leave", startDate: "2023-09-20", endDate: "2023-09-25", status: "pending" },
        ])

        setIsLoading(false)
      } catch (err) {
        setError("Failed to load data. Please try again later.")
        setIsLoading(false)
      }
    }

    fetchData()
  }, []);

  const filteredHistory = leaveHistory.filter((request) => {
    if (!startDate && !endDate) return true
    const requestStartDate = new Date(request.startDate)
    const requestEndDate = new Date(request.endDate)
    return (!startDate || requestEndDate >= startDate) && (!endDate || requestStartDate <= endDate)
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <div className="w-full mx-auto py-8">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold mb-6">Leave History</h1>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant={"secondary"}>Add Leave</Button>
          </DrawerTrigger>
          <DrawerContent className=" h-full 2xl:h-max">
            <DrawerHeader>
              <div className="flex justify-between items-center">
                <div>
                  <DrawerTitle>Submit Leave Request</DrawerTitle>
                  <DrawerDescription>Fill out the form below to submit your leave request.</DrawerDescription>
                </div>
                <DrawerClose> <X /> </DrawerClose>
              </div>
            </DrawerHeader>
            <LeaveRequestPage />
          </DrawerContent>
        </Drawer>
      </div>
      <Tabs defaultValue="balances">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="balances">Current Balances</TabsTrigger>
          <TabsTrigger value="history">Leave History</TabsTrigger>
        </TabsList>
        <TabsContent value="balances">
          <Card>
            <CardHeader>
              <CardTitle>Current Leave Balances</CardTitle>
              <CardDescription>Your available leave balances as of today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {leaveBalances.map((balance) => (
                  <Card key={balance.type}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">{balance.type}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{balance.balance}</div>
                      <p className="text-xs text-muted-foreground">{balance.unit}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Leave Request History</CardTitle>
              <CardDescription>Your past and pending leave requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex-1">
                  <Label htmlFor="endDate">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground",
                        )}
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
                <div className="flex items-end">
                  <Button
                    onClick={() => {
                      setStartDate(undefined)
                      setEndDate(undefined)
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.type}</TableCell>
                        <TableCell>{format(new Date(request.startDate), "PP")}</TableCell>
                        <TableCell>{format(new Date(request.endDate), "PP")}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              request.status === "approved"
                                ? "outline"
                                : request.status === "rejected"
                                  ? "destructive"
                                  : "default"
                            }
                          >
                            {request.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

