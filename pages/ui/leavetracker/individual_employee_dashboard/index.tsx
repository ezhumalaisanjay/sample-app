"use client"

import type React from "react"

import { useState } from "react"
import { format, eachDayOfInterval, isToday, addMonths, subMonths } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, ChevronLeft, ChevronRight, Download, PaperclipIcon, Pencil, Search, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface LeaveBalance {
  type: string
  total: number
  used: number
  remaining: number
}

interface LeaveRequest {
  id: string
  type: string
  startDate: string
  endDate: string
  days: number
  reason: string
  status: "Approved" | "Pending" | "Rejected"
  appliedOn: string
  rewards: number
  attachment?: string | null
}

interface TeamMember {
  id: string
  name: string
  position: string
  department: string
  avatar: string
  leaves: {
    startDate: string
    endDate: string
    type: string
    status: "Approved" | "Pending" | "Rejected"
  }[]
}

export default function IndividualEmployeeLeavePage() {
  // Get current date for mock data
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  // Mock data for leave balances
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([
    { type: "Vacation", total: 20, used: 8, remaining: 12 },
    { type: "Sick Leave", total: 10, used: 2, remaining: 8 },
    { type: "Personal Leave", total: 5, used: 1, remaining: 4 },
  ])

  // Mock data for applied leaves
  const [appliedLeaves, setAppliedLeaves] = useState<LeaveRequest[]>([
    {
      id: "LR001",
      type: "Vacation",
      startDate: "2024-06-10",
      endDate: "2024-06-15",
      days: 5,
      reason: "Family vacation",
      status: "Approved",
      appliedOn: "2024-05-15",
      rewards: 100,
      attachment: "vacation_plan.pdf",
    },
    {
      id: "LR002",
      type: "Sick Leave",
      startDate: "2024-04-05",
      endDate: "2024-04-06",
      days: 2,
      reason: "Fever",
      status: "Approved",
      appliedOn: "2024-04-04",
      rewards: 50,
      attachment: "medical_certificate.pdf",
    },
    {
      id: "LR003",
      type: "Personal Leave",
      startDate: "2024-05-20",
      endDate: "2024-05-20",
      days: 1,
      reason: "Personal work",
      status: "Pending",
      appliedOn: "2024-05-10",
      rewards: 75,
      attachment: null,
    },
  ])

  // Mock data for team members with current month leave data
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "TM001",
      name: "Alex Johnson",
      position: "Senior Developer",
      department: "Engineering",
      avatar: "/placeholder.svg?height=40&width=40",
      leaves: [
        {
          startDate: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-05`,
          endDate: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-10`,
          type: "Vacation",
          status: "Approved",
        },
        {
          startDate: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-20`,
          endDate: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-22`,
          type: "Personal Leave",
          status: "Approved",
        },
      ],
    },
    {
      id: "TM002",
      name: "Sarah Williams",
      position: "Product Manager",
      department: "Product",
      avatar: "/placeholder.svg?height=40&width=40",
      leaves: [
        {
          startDate: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-15`,
          endDate: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-18`,
          type: "Sick Leave",
          status: "Approved",
        },
        {
          startDate: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-25`,
          endDate: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-28`,
          type: "Vacation",
          status: "Approved",
        },
      ],
    },
    {
      id: "TM003",
      name: "Michael Chen",
      position: "UX Designer",
      department: "Design",
      avatar: "/placeholder.svg?height=40&width=40",
      leaves: [
        {
          startDate: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-12`,
          endDate: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-14`,
          type: "Sick Leave",
          status: "Approved",
        },
      ],
    },
    {
      id: "TM004",
      name: "Emily Rodriguez",
      position: "QA Engineer",
      department: "Engineering",
      avatar: "/placeholder.svg?height=40&width=40",
      leaves: [
        {
          startDate: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01`,
          endDate: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-03`,
          type: "Vacation",
          status: "Approved",
        },
      ],
    },
    {
      id: "TM005",
      name: "David Kim",
      position: "Backend Developer",
      department: "Engineering",
      avatar: "/placeholder.svg?height=40&width=40",
      leaves: [
        {
          startDate: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-08`,
          endDate: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-09`,
          type: "Personal Leave",
          status: "Approved",
        },
        {
          startDate: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-17`,
          endDate: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-19`,
          type: "Sick Leave",
          status: "Approved",
        },
      ],
    },
  ])

  // State for team availability view
  const [viewMonth, setViewMonth] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("All")

  // State for leave request form
  const [leaveType, setLeaveType] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reason, setReason] = useState("")
  const [attachmentName, setAttachmentName] = useState("")
  const [leaveTypeError, setLeaveTypeError] = useState(false)

  // State for edit and delete functionality
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentLeave, setCurrentLeave] = useState<LeaveRequest | null>(null)
  const [editFormData, setEditFormData] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
    attachment: "",
  })
  const [editLeaveTypeError, setEditLeaveTypeError] = useState(false)

  // State for showing leave details
  const [showLeaveDetails, setShowLeaveDetails] = useState<string | null>(null)

  // Add a function to handle attachment downloads
  const handleDownloadAttachment = (attachmentName: string) => {
    // In a real application, this would trigger an API call to download the file
    // For this demo, we'll create a simulated download link
    const link = document.createElement("a")
    link.href = `#${attachmentName}` // In a real app, this would be a real URL
    link.download = attachmentName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Add a function to handle file changes in the edit form
  const handleEditFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setEditFormData((prev) => ({ ...prev, attachment: file.name }))
    }
  }

  // Add a function to calculate rewards based on how early the leave is applied:
  const calculateRewards = (startDate: string, appliedOn: string) => {
    const daysInAdvance = Math.floor(
      (new Date(startDate).getTime() - new Date(appliedOn).getTime()) / (1000 * 3600 * 24),
    )
    if (daysInAdvance >= 30) return 100
    if (daysInAdvance >= 14) return 50
    return 0
  }

  // Function to format date from YYYY-MM-DD to readable format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, "MMM dd, yyyy")
    } catch (error) {
      return dateString
    }
  }

  // Function to get badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "Rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Function to determine color based on leave type
  const getColorClass = (type: string) => {
    return "bg-gray-100 text-gray-800 border-gray-300"
  }

  // Function to determine progress color
  const getProgressColor = (type: string) => {
    return "bg-gray-500"
  }

  // Function to get leave type color
  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case "Vacation":
        return "bg-blue-100 text-blue-800"
      case "Sick Leave":
        return "bg-red-100 text-red-800"
      case "Personal Leave":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Handle leave request form submission
  const handleLeaveRequest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Validate leave type is selected
    if (!leaveType) {
      setLeaveTypeError(true)
      document.getElementById("leaveType")?.focus()
      return
    }

    setLeaveTypeError(false)

    // Calculate days between start and end date
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

    // Create new leave request
    const appliedOn = format(new Date(), "yyyy-MM-dd")
    const rewards = calculateRewards(startDate, appliedOn)

    const newLeaveRequest: LeaveRequest = {
      id: `LR${appliedLeaves.length + 1}`.padStart(5, "0"),
      type: leaveType,
      startDate,
      endDate,
      days: diffDays,
      reason,
      status: "Pending",
      appliedOn,
      rewards,
      attachment: attachmentName || null,
    }

    // Update applied leaves
    setAppliedLeaves([...appliedLeaves, newLeaveRequest])

    // Update leave balance
    setLeaveBalances(
      leaveBalances.map((balance) =>
        balance.type === leaveType
          ? { ...balance, used: balance.used + diffDays, remaining: balance.remaining - diffDays }
          : balance,
      ),
    )

    // Reset form
    setLeaveType("")
    setStartDate("")
    setEndDate("")
    setReason("")
    setAttachmentName("")
  }

  // Handle leave type change
  const handleLeaveTypeChange = (value: string) => {
    setLeaveType(value)
    if (value) {
      setLeaveTypeError(false)
    }
  }

  // Handle file attachment
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAttachmentName(file.name)
    }
  }

  // Handle edit button click
  const handleEdit = (leave: LeaveRequest) => {
    setCurrentLeave(leave)
    setEditFormData({
      type: leave.type,
      startDate: leave.startDate,
      endDate: leave.endDate,
      reason: leave.reason,
      attachment: leave.attachment || "",
    })
    setEditLeaveTypeError(false)
    setIsEditDialogOpen(true)
  }

  // Handle delete button click
  const handleDelete = (leave: LeaveRequest) => {
    setCurrentLeave(leave)
    setIsDeleteDialogOpen(true)
  }

  // Handle form input changes for edit
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle type select change for edit
  const handleEditTypeChange = (value: string) => {
    setEditFormData((prev) => ({ ...prev, type: value }))
    if (value) {
      setEditLeaveTypeError(false)
    }
  }

  // Handle edit form submission
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentLeave) return

    // Validate leave type is selected
    if (!editFormData.type) {
      setEditLeaveTypeError(true)
      document.getElementById("edit-type")?.focus()
      return
    }

    setEditLeaveTypeError(false)

    // Calculate days between start and end date
    const start = new Date(editFormData.startDate)
    const end = new Date(editFormData.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

    // Update the leave request
    const updatedLeaves = appliedLeaves.map((leave) =>
      leave.id === currentLeave.id
        ? {
            ...leave,
            type: editFormData.type,
            startDate: editFormData.startDate,
            endDate: editFormData.endDate,
            days: diffDays,
            reason: editFormData.reason,
            attachment: editFormData.attachment || null,
          }
        : leave,
    )

    setAppliedLeaves(updatedLeaves)
    setIsEditDialogOpen(false)
  }

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (!currentLeave) return

    const updatedLeaves = appliedLeaves.filter((leave) => leave.id !== currentLeave.id)
    setAppliedLeaves(updatedLeaves)
    setIsDeleteDialogOpen(false)
  }

  // Function to navigate to previous month
  const previousMonth = () => {
    setViewMonth(subMonths(viewMonth, 1))
  }

  // Function to navigate to next month
  const nextMonth = () => {
    setViewMonth(addMonths(viewMonth, 1))
  }

  // Function to check if a team member is on leave on a specific date
  const isOnLeave = (member: TeamMember, date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    return member.leaves.some((leave) => {
      if (leave.status !== "Approved") return false

      const start = new Date(leave.startDate)
      const end = new Date(leave.endDate)
      const days = eachDayOfInterval({ start, end }).map((d) => format(d, "yyyy-MM-dd"))
      return days.includes(dateStr)
    })
  }

  // Function to get leave type for a specific date
  const getLeaveType = (member: TeamMember, date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    const leave = member.leaves.find((leave) => {
      if (leave.status !== "Approved") return false

      const start = new Date(leave.startDate)
      const end = new Date(leave.endDate)
      const days = eachDayOfInterval({ start, end }).map((d) => format(d, "yyyy-MM-dd"))
      return days.includes(dateStr)
    })

    return leave ? leave.type : null
  }

  // Filter team members based on search and department
  const filteredTeamMembers = teamMembers.filter((member) => {
    return (
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.position.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // Generate dates for the current month view
  const daysInMonth = eachDayOfInterval({
    start: new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1),
    end: new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0),
  })

  // Handle showing leave details
  const handleShowLeaveDetails = (leaveType: string) => {
    setShowLeaveDetails(leaveType)
  }

  // Handle closing leave details
  const handleCloseLeaveDetails = () => {
    setShowLeaveDetails(null)
  }

  return (
    <div className="container mx-auto py-4 px-2 sm:py-8 sm:px-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Employee Leave Management</h1>

      {/* Leave Balance Cards */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Leave Balance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {leaveBalances.map((balance, index) => {
            const percentUsed = (balance.used / balance.total) * 100

            return (
              <Card key={index} className="border shadow-sm">
                <CardHeader className={`py-2 sm:py-3 px-3 sm:px-4 rounded-t-lg ${getColorClass(balance.type)}`}>
                  <CardTitle className="text-base sm:text-lg font-medium">{balance.type}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 sm:pt-6 pb-3 sm:pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Available</span>
                    <span className="text-2xl sm:text-3xl font-bold">{balance.remaining}</span>
                  </div>
                  <Progress value={percentUsed} className={`h-2 mt-2 mb-3 ${getProgressColor(balance.type)}`} />
                  <div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-2">
                    <span
                      className="cursor-pointer hover:underline flex items-center"
                      onClick={() => handleShowLeaveDetails(balance.type)}
                    >
                      Used: {balance.used}
                    </span>
                    <span>Total: {balance.total}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="mb-6">
        <Tabs defaultValue="team" className="w-full">
          <div className="inline-block bg-gray-50 p-2 rounded-md">
            <TabsList className="flex space-x-2 justify-start">
              <TabsTrigger
                value="request"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-gray-900"
              >
                Leave Request
              </TabsTrigger>
              <TabsTrigger
                value="summary"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-gray-900"
              >
                Leave Summary
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-gray-900"
              >
                Leave History
              </TabsTrigger>
              <TabsTrigger
                value="team"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-gray-900"
              >
                Team Availability
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-6">
            <TabsContent value="request">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Submit Leave Request</CardTitle>
                </CardHeader>
                <form onSubmit={handleLeaveRequest}>
                  <CardContent className="space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="leaveType">
                        Leave Type <span className="text-red-500">*</span>
                      </Label>
                      <Select value={leaveType} onValueChange={handleLeaveTypeChange} required>
                        <SelectTrigger id="leaveType" className={leaveTypeError ? "border-red-500 ring-red-500" : ""}>
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Vacation">Vacation</SelectItem>
                          <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                          <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {leaveTypeError && <p className="text-sm text-red-500 mt-1">Please select leave type</p>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <div className="relative">
                          <Input
                            type="date"
                            id="startDate"
                            required
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="pl-10"
                          />
                          <CalendarIcon
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={18}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <div className="relative">
                          <Input
                            type="date"
                            id="endDate"
                            required
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="pl-10"
                          />
                          <CalendarIcon
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={18}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason</Label>
                      <Textarea
                        id="reason"
                        placeholder="Enter the reason for your leave request"
                        required
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="attachment">Attachment (Optional)</Label>
                      <div className="flex items-center space-x-2">
                        <Input type="file" id="attachment" className="hidden" onChange={handleFileChange} />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("attachment")?.click()}
                        >
                          <PaperclipIcon className="mr-2 h-4 w-4" />
                          {attachmentName || "Upload File"}
                        </Button>
                        {attachmentName && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm text-gray-500">{attachmentName}</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => handleDownloadAttachment(attachmentName)}
                                  >
                                    <Download className="h-4 w-4" />
                                    <span className="sr-only">Download</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Download attachment</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full">
                      Submit Leave Request
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            <TabsContent value="summary">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Leave Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Leave Days Taken:</span>
                      <span className="font-bold">{leaveBalances.reduce((acc, curr) => acc + curr.used, 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Leave Days Available:</span>
                      <span className="font-bold">{leaveBalances.reduce((acc, curr) => acc + curr.remaining, 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Pending Requests:</span>
                      <span className="font-bold">
                        {appliedLeaves.filter((leave) => leave.status === "Pending").length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Rewards Earned:</span>
                      <span className="font-bold">
                        {appliedLeaves.reduce((acc, curr) => acc + curr.rewards, 0)} pts
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="history">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead className="hidden sm:table-cell">Days</TableHead>
                      <TableHead className="hidden md:table-cell">Applied On</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Reason</TableHead>
                      <TableHead>Rewards</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appliedLeaves.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-4 sm:py-6 text-gray-500">
                          No leave requests found
                        </TableCell>
                      </TableRow>
                    ) : (
                      appliedLeaves.map((leave) => (
                        <TableRow key={leave.id}>
                          <TableCell className="font-medium">{leave.id}</TableCell>
                          <TableCell>{leave.type}</TableCell>
                          <TableCell>
                            <span className="whitespace-nowrap">
                              {formatDate(leave.startDate)}
                              {leave.startDate !== leave.endDate && (
                                <>
                                  <br className="sm:hidden" />
                                  <span className="hidden sm:inline"> - </span>
                                  {formatDate(leave.endDate)}
                                </>
                              )}
                            </span>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">{leave.days}</TableCell>
                          <TableCell className="hidden md:table-cell">{formatDate(leave.appliedOn)}</TableCell>
                          <TableCell>{getStatusBadge(leave.status)}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="max-w-[200px] truncate" title={leave.reason}>
                              {leave.reason}
                              {leave.attachment && (
                                <div className="mt-1 text-xs flex items-center">
                                  <PaperclipIcon className="h-3 w-3 mr-1" />
                                  <span className="truncate">{leave.attachment}</span>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-5 w-5 ml-1"
                                          onClick={() => handleDownloadAttachment(leave.attachment as string)}
                                        >
                                          <Download className="h-3 w-3" />
                                          <span className="sr-only">Download</span>
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Download attachment</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{leave.rewards}</TableCell>
                          <TableCell>
                            <div className="flex space-x-1 sm:space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(leave)}
                                disabled={leave.status === "Approved"}
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(leave)}
                                disabled={leave.status === "Approved"}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="team">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Team Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          type="text"
                          placeholder="Search team members..."
                          className="pl-9"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="whitespace-nowrap font-medium">Department: Engineering</Label>
                      </div>
                    </div>

                    {/* Month Navigation */}
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm" onClick={previousMonth}>
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous month</span>
                      </Button>
                      <h3 className="text-lg font-semibold">{format(viewMonth, "MMMM yyyy")}</h3>
                      <Button variant="outline" size="sm" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next month</span>
                      </Button>
                    </div>

                    {/* Leave Type Legend */}
                    <div className="flex flex-wrap gap-2 items-center text-sm">
                      <span className="font-medium">Leave Types:</span>
                      <Badge className="bg-blue-100 text-blue-800">Vacation</Badge>
                      <Badge className="bg-red-100 text-red-800">Sick Leave</Badge>
                      <Badge className="bg-purple-100 text-purple-800">Personal Leave</Badge>
                    </div>

                    {/* Team Availability Calendar */}
                    <div className="overflow-x-auto">
                      <Table className="min-w-[800px]">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[200px]">Team Member</TableHead>
                            {daysInMonth.slice(0, 15).map((day) => (
                              <TableHead key={day.toString()} className="text-center p-1 w-8">
                                <div className={`text-xs ${isToday(day) ? "font-bold bg-gray-100 rounded-full" : ""}`}>
                                  {format(day, "d")}
                                </div>
                                <div className="text-[10px] text-gray-500">{format(day, "EEE")}</div>
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredTeamMembers.map((member) => (
                            <TableRow key={member.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={member.avatar} alt={member.name} />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{member.name}</div>
                                    <div className="text-xs text-gray-500">{member.position}</div>
                                  </div>
                                </div>
                              </TableCell>
                              {daysInMonth.slice(0, 15).map((day) => {
                                const onLeave = isOnLeave(member, day)
                                const leaveType = getLeaveType(member, day)
                                return (
                                  <TableCell key={day.toString()} className="p-1 text-center">
                                    {onLeave ? (
                                      <div className="w-full h-6 flex items-center justify-center">
                                        <Badge
                                          className={`text-[8px] py-0 px-1 ${
                                            leaveType === "Vacation"
                                              ? "bg-blue-100 text-blue-800"
                                              : leaveType === "Sick Leave"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-purple-100 text-purple-800"
                                          }`}
                                        >
                                          {leaveType === "Vacation"
                                            ? "Vacation"
                                            : leaveType === "Sick Leave"
                                              ? "Sick"
                                              : "Personal"}
                                        </Badge>
                                      </div>
                                    ) : null}
                                  </TableCell>
                                )
                              })}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Second half of the month */}
                    <div className="overflow-x-auto mt-4">
                      <Table className="min-w-[800px]">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[200px]">Team Member</TableHead>
                            {daysInMonth.slice(15).map((day) => (
                              <TableHead key={day.toString()} className="text-center p-1 w-8">
                                <div className={`text-xs ${isToday(day) ? "font-bold bg-gray-100 rounded-full" : ""}`}>
                                  {format(day, "d")}
                                </div>
                                <div className="text-[10px] text-gray-500">{format(day, "EEE")}</div>
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredTeamMembers.map((member) => (
                            <TableRow key={`${member.id}-2`}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={member.avatar} alt={member.name} />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{member.name}</div>
                                    <div className="text-xs text-gray-500">{member.position}</div>
                                  </div>
                                </div>
                              </TableCell>
                              {daysInMonth.slice(15).map((day) => {
                                const onLeave = isOnLeave(member, day)
                                const leaveType = getLeaveType(member, day)
                                return (
                                  <TableCell key={day.toString()} className="p-1 text-center">
                                    {onLeave ? (
                                      <div className="w-full h-6 flex items-center justify-center">
                                        <Badge
                                          className={`text-[8px] py-0 px-1 ${
                                            leaveType === "Vacation"
                                              ? "bg-blue-100 text-blue-800"
                                              : leaveType === "Sick Leave"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-purple-100 text-purple-800"
                                          }`}
                                        >
                                          {leaveType === "Vacation"
                                            ? "Vacation"
                                            : leaveType === "Sick Leave"
                                              ? "Sick"
                                              : "Personal"}
                                        </Badge>
                                      </div>
                                    ) : null}
                                  </TableCell>
                                )
                              })}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Leave Request</DialogTitle>
            <DialogDescription>Make changes to your leave request here.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Leave Type</Label>
                <Select value={editFormData.type} onValueChange={handleEditTypeChange} required>
                  <SelectTrigger id="edit-type" className={editLeaveTypeError ? "border-red-500 ring-red-500" : ""}>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vacation">Vacation</SelectItem>
                    <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                    <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {editLeaveTypeError && <p className="text-sm text-red-500 mt-1">Please select leave type</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate">Start Date</Label>
                  <div className="relative">
                    <Input
                      type="date"
                      id="edit-startDate"
                      name="startDate"
                      required
                      value={editFormData.startDate}
                      onChange={handleEditInputChange}
                      className="pl-10"
                    />
                    <CalendarIcon
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate">End Date</Label>
                  <div className="relative">
                    <Input
                      type="date"
                      id="edit-endDate"
                      name="endDate"
                      required
                      value={editFormData.endDate}
                      onChange={handleEditInputChange}
                      className="pl-10"
                    />
                    <CalendarIcon
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-reason">Reason</Label>
                <Textarea
                  id="edit-reason"
                  name="reason"
                  placeholder="Enter the reason for your leave request"
                  value={editFormData.reason}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-attachment">Attachment (Optional)</Label>
                <div className="flex items-center space-x-2">
                  <Input type="file" id="edit-attachment" className="hidden" onChange={handleEditFileChange} />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("edit-attachment")?.click()}
                  >
                    <PaperclipIcon className="mr-2 h-4 w-4" />
                    {editFormData.attachment || "Upload File"}
                  </Button>
                  {editFormData.attachment && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm text-gray-500">{editFormData.attachment}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleDownloadAttachment(editFormData.attachment)}
                            >
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Download attachment</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your leave request.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Leave Details Dialog */}
      <Dialog open={showLeaveDetails !== null} onOpenChange={() => setShowLeaveDetails(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{showLeaveDetails} Leave Details</DialogTitle>
          </DialogHeader>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Duration</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rewards</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appliedLeaves.filter((leave) => leave.type === showLeaveDetails).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                      No leave records found
                    </TableCell>
                  </TableRow>
                ) : (
                  appliedLeaves
                    .filter((leave) => leave.type === showLeaveDetails)
                    .map((leave) => (
                      <TableRow key={leave.id}>
                        <TableCell>
                          {formatDate(leave.startDate)}
                          {leave.startDate !== leave.endDate && (
                            <>
                              <br />
                              {formatDate(leave.endDate)}
                            </>
                          )}
                        </TableCell>
                        <TableCell>{leave.days}</TableCell>
                        <TableCell>{formatDate(leave.appliedOn)}</TableCell>
                        <TableCell>{getStatusBadge(leave.status)}</TableCell>
                        <TableCell>{leave.rewards} pts</TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate" title={leave.reason}>
                            {leave.reason}
                            {leave.attachment && (
                              <div className="mt-1 text-xs flex items-center">
                                <PaperclipIcon className="h-3 w-3 mr-1" />
                                <span className="truncate">{leave.attachment}</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5 ml-1"
                                        onClick={() => handleDownloadAttachment(leave.attachment as string)}
                                      >
                                        <Download className="h-3 w-3" />
                                        <span className="sr-only">Download</span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Download attachment</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

