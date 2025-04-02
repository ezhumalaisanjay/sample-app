"use client"

import { useState, useEffect } from "react"
import { format, differenceInBusinessDays } from "date-fns"
import { Loader2, Search, Check, X, Info, ChevronRight, ChevronDown, MessageSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type LeavePolicy = {
  leaveTypes: {
    type: string
    accrualRate: number
    maxAccrual: number
    carryOver: number
  }[]
  holidays: {
    date: Date
    name: string
  }[]
  workWeek: boolean[]
  fiscalYearStart: Date
}

type LeaveBalance = {
  type: string
  balance: number
  unit: string
}

// Update the LeaveRequest type to include employeeId and email
type LeaveRequest = {
  id: string
  employeeId: string
  employeeName: string
  email: string
  type: string
  startDate: string
  endDate: string
  status: "pending" | "approved" | "rejected"
  reason?: string
  selected?: boolean
  statusComment?: string
  additionalInfo?: string // Add this field to store additional information
}

// Mock function to simulate sending an email
const sendEmail = async (to: string, subject: string, body: string) => {
  // In a real application, this would send an actual email
  console.log(`Sending email to ${to}:`)
  console.log(`Subject: ${subject}`)
  console.log(`Body: ${body}`)
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))
}

// Mock function to fetch leave policy
const fetchLeavePolicy = async (): Promise<LeavePolicy> => {
  // In a real application, this would fetch the policy from your API
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
  return {
    leaveTypes: [
      { type: "annual", accrualRate: 1.67, maxAccrual: 20, carryOver: 5 },
      { type: "sick", accrualRate: 0.83, maxAccrual: 10, carryOver: 0 },
    ],
    holidays: [
      { date: new Date(2023, 0, 1), name: "New Year's Day" },
      { date: new Date(2023, 11, 25), name: "Christmas Day" },
    ],
    workWeek: [false, true, true, true, true, true, false], // Sunday to Saturday
    fiscalYearStart: new Date(2023, 0, 1), // January 1st
  }
}

export default function LeaveApprovalsPage() {
  const { toast } = useToast()
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([])
  const [pendingRequests, setPendingRequests] = useState<LeaveRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [leavePolicy, setLeavePolicy] = useState<LeavePolicy | null>(null)
  const [selectAll, setSelectAll] = useState(false)
  const [openDialogs, setOpenDialogs] = useState<Record<string, boolean>>({})
  const [approvalDialogs, setApprovalDialogs] = useState<Record<string, boolean>>({})
  const [rejectionDialogs, setRejectionDialogs] = useState<Record<string, boolean>>({})
  const [additionalInfoInputs, setAdditionalInfoInputs] = useState<Record<string, string>>({})
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})
  const [infoDialogs, setInfoDialogs] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const policy = await fetchLeavePolicy()
        setLeavePolicy(policy)

        // Simulate fetching leave balances based on policy
        const balances = policy.leaveTypes.map((type) => ({
          type: type.type,
          balance: Math.floor(Math.random() * type.maxAccrual),
          unit: "days",
        }))
        setLeaveBalances(balances)

        // Fetch pending requests (simulated)
        setPendingRequests([
          {
            id: "4",
            employeeId: "EMP001",
            employeeName: "Bob Brown",
            email: "bob.brown@example.com",
            type: "Annual Leave",
            startDate: "2023-09-20",
            endDate: "2023-09-25",
            status: "pending",
            reason: "Family vacation",
            selected: false,
          },
          {
            id: "5",
            employeeId: "EMP002",
            employeeName: "Charlie Davis",
            email: "charlie.davis@example.com",
            type: "Sick Leave",
            startDate: "2023-10-15",
            endDate: "2023-10-16",
            status: "pending",
            reason: "Doctor's appointment",
            selected: false,
          },
        ])

        setIsLoading(false)
      } catch (err) {
        setError("Failed to load data. Please try again later.")
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredPendingRequests = pendingRequests.filter(
    (request) =>
      request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const calculateLeaveDuration = (startDate: string, endDate: string) => {
    if (!leavePolicy) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const duration = differenceInBusinessDays(end, start) + 1

    // Subtract holidays that fall within the leave period
    const holidaysInPeriod = leavePolicy.holidays.filter(
      (holiday) => holiday.date >= start && holiday.date <= end,
    ).length

    return Math.max(duration - holidaysInPeriod, 0)
  }

  // Update the handleApprove function to fix any issues
  const handleApprove = async (id: string, comment?: string) => {
    if (!leavePolicy) return

    const requestToApprove = pendingRequests.find((request) => request.id === id)
    if (!requestToApprove) return

    const leaveDuration = calculateLeaveDuration(requestToApprove.startDate, requestToApprove.endDate)
    const leaveTypePolicy = leavePolicy.leaveTypes.find(
      (type) => type.type.toLowerCase() === requestToApprove.type.toLowerCase().replace(" leave", ""),
    )

    if (!leaveTypePolicy) {
      toast({
        title: "Error",
        description: "Leave type not found in policy.",
        variant: "destructive",
      })
      return
    }

    const currentBalance = leaveBalances.find(
      (balance) => balance.type.toLowerCase() === leaveTypePolicy.type.toLowerCase(),
    )

    if (!currentBalance || currentBalance.balance < leaveDuration) {
      toast({
        title: "Error",
        description: "Insufficient leave balance.",
        variant: "destructive",
      })
      return
    }

    // Update leave balance
    setLeaveBalances((prevBalances) =>
      prevBalances.map((balance) =>
        balance.type.toLowerCase() === leaveTypePolicy.type.toLowerCase()
          ? { ...balance, balance: balance.balance - leaveDuration }
          : balance,
      ),
    )

    // Update request status instead of removing
    setPendingRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id ? { ...request, status: "approved", selected: false, statusComment: comment } : request,
      ),
    )

    // Close the approval dialog
    setApprovalDialogs((prev) => ({ ...prev, [id]: false }))

    // Send email notification
    await sendEmail(
      requestToApprove.email,
      "Leave Request Approved",
      `Your ${requestToApprove.type} request from ${requestToApprove.startDate} to ${requestToApprove.endDate} has been approved.${comment ? ` Comment: ${comment}` : ""}`,
    )

    // Show toast notification
    toast({
      title: "Leave Request Approved",
      description: `The leave request for ${requestToApprove.employeeName} has been approved.`,
      variant: "default",
    })
  }

  // Update the handleReject function to fix any issues
  const handleReject = async (id: string, comment?: string) => {
    const rejectedRequest = pendingRequests.find((request) => request.id === id)
    if (!rejectedRequest) return

    // Update request status instead of removing
    setPendingRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id ? { ...request, status: "rejected", selected: false, statusComment: comment } : request,
      ),
    )

    // Close the rejection dialog
    setRejectionDialogs((prev) => ({ ...prev, [id]: false }))

    // Send email notification
    await sendEmail(
      rejectedRequest.email,
      "Leave Request Rejected",
      `Your ${rejectedRequest.type} request from ${rejectedRequest.startDate} to ${rejectedRequest.endDate} has been rejected.${comment ? ` Reason: ${comment}` : ""}`,
    )

    // Show toast notification
    toast({
      title: "Leave Request Rejected",
      description: `The leave request for ${rejectedRequest.employeeName} has been rejected.`,
      variant: "destructive",
    })
  }

  const handleRequestInfo = async (id: string, info: string) => {
    if (!info || info.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter additional information before submitting.",
        variant: "destructive",
      })
      return
    }

    // Update the request with additional information
    setPendingRequests((prevRequests) =>
      prevRequests.map((request) => (request.id === id ? { ...request, additionalInfo: info } : request)),
    )

    // Clear the input state
    setAdditionalInfoInputs((prev) => ({ ...prev, [id]: "" }))

    // Close the dialog
    setOpenDialogs((prev) => ({ ...prev, [`info-${id}`]: false }))

    const request = pendingRequests.find((req) => req.id === id)
    if (request) {
      // Send email notification
      await sendEmail(
        request.email,
        "Additional Information Requested",
        `Additional information has been requested for your ${request.type} request from ${request.startDate} to ${request.endDate}: ${info}`,
      )

      // Show toast notification
      toast({
        title: "Information Request Sent",
        description: `Additional information request sent to ${request.employeeName}.`,
        variant: "default",
      })
    }
  }

  // Add functions for bulk actions
  const handleBulkApprove = async () => {
    const selectedRequests = pendingRequests.filter((request) => request.selected && request.status === "pending")

    if (selectedRequests.length === 0) {
      toast({
        title: "No Requests Selected",
        description: "Please select at least one pending request to approve.",
        variant: "destructive",
      })
      return
    }

    // Process each selected request
    for (const request of selectedRequests) {
      await handleApprove(request.id, "Bulk approved")
    }

    toast({
      title: "Bulk Approval Complete",
      description: `${selectedRequests.length} leave requests have been approved.`,
      variant: "default",
    })
  }

  const handleBulkReject = async () => {
    const selectedRequests = pendingRequests.filter((request) => request.selected && request.status === "pending")

    if (selectedRequests.length === 0) {
      toast({
        title: "No Requests Selected",
        description: "Please select at least one pending request to reject.",
        variant: "destructive",
      })
      return
    }

    // Process each selected request
    for (const request of selectedRequests) {
      await handleReject(request.id, "Bulk rejected")
    }

    toast({
      title: "Bulk Rejection Complete",
      description: `${selectedRequests.length} leave requests have been rejected.`,
      variant: "default",
    })
  }

  // Add function to handle selection
  const toggleSelectRequest = (id: string) => {
    setPendingRequests((prevRequests) =>
      prevRequests.map((request) => (request.id === id ? { ...request, selected: !request.selected } : request)),
    )
  }

  // Add function to handle select all
  const toggleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)

    setPendingRequests((prevRequests) =>
      prevRequests.map((request) => (request.status === "pending" ? { ...request, selected: newSelectAll } : request)),
    )
  }

  // Handle additional info input change
  const handleAdditionalInfoChange = (id: string, value: string) => {
    setAdditionalInfoInputs((prev) => ({ ...prev, [id]: value }))
  }

  // Toggle row expansion
  const toggleRowExpansion = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // View additional info
  const viewAdditionalInfo = (id: string) => {
    setInfoDialogs((prev) => ({ ...prev, [id]: true }))
  }

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

  // Desktop view with full table
  const renderDesktopTable = () => (
    <div className="hidden md:block border rounded-md">
      <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}>
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-muted/50">
                  <th className="p-2 text-left font-medium text-muted-foreground w-10">
                    <Checkbox checked={selectAll} onCheckedChange={toggleSelectAll} aria-label="Select all" />
                  </th>
                  <th className="p-2 text-left font-medium text-muted-foreground w-16">ID</th>
                  <th className="p-2 text-left font-medium text-muted-foreground w-28">Name</th>
                  <th className="p-2 text-left font-medium text-muted-foreground w-36 lg:w-40">Email</th>
                  <th className="p-2 text-left font-medium text-muted-foreground w-24">Type</th>
                  <th className="p-2 text-left font-medium text-muted-foreground w-20">Start</th>
                  <th className="p-2 text-left font-medium text-muted-foreground w-20">End</th>
                  <th className="p-2 text-left font-medium text-muted-foreground w-14">Days</th>
                  <th className="p-2 text-left font-medium text-muted-foreground w-24 lg:w-28">Reason</th>
                  <th className="p-2 text-left font-medium text-muted-foreground w-20">Status</th>
                  <th className="p-2 text-left font-medium text-muted-foreground w-16">Info</th>
                  <th className="p-2 text-left font-medium text-muted-foreground w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPendingRequests.map((request) => (
                  <tr
                    key={request.id}
                    className={
                      request.status === "approved" ? "bg-green-50" : request.status === "rejected" ? "bg-red-50" : ""
                    }
                  >
                    <td className="p-2 align-middle">
                      {request.status === "pending" && (
                        <Checkbox
                          checked={!!request.selected}
                          onCheckedChange={() => toggleSelectRequest(request.id)}
                          aria-label={`Select ${request.employeeName}'s request`}
                        />
                      )}
                    </td>
                    <td className="p-2 align-middle text-sm">{request.employeeId}</td>
                    <td className="p-2 align-middle text-sm font-medium">{request.employeeName}</td>
                    <td className="p-2 align-middle text-sm truncate max-w-[140px]">{request.email}</td>
                    <td className="p-2 align-middle text-sm">{request.type}</td>
                    <td className="p-2 align-middle text-sm whitespace-nowrap">
                      {format(new Date(request.startDate), "MM/dd/yy")}
                    </td>
                    <td className="p-2 align-middle text-sm whitespace-nowrap">
                      {format(new Date(request.endDate), "MM/dd/yy")}
                    </td>
                    <td className="p-2 align-middle text-sm">
                      {calculateLeaveDuration(request.startDate, request.endDate)}
                    </td>
                    <td className="p-2 align-middle text-sm truncate max-w-[100px]">{request.reason}</td>
                    <td className="p-2 align-middle text-sm whitespace-nowrap">
                      <span
                        className={
                          request.status === "approved"
                            ? "text-green-600 font-medium"
                            : request.status === "rejected"
                              ? "text-red-600 font-medium"
                              : "text-amber-600 font-medium"
                        }
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-2 align-middle">
                      {request.additionalInfo ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MessageSquare className="h-4 w-4 text-blue-500" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-4">
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">Additional Information</h4>
                              <p className="text-sm text-muted-foreground">{request.additionalInfo}</p>
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-2 align-middle">
                      {request.status === "pending" && (
                        <div className="flex items-center gap-1">
                          <Dialog
                            open={approvalDialogs[request.id]}
                            onOpenChange={(open) => setApprovalDialogs((prev) => ({ ...prev, [request.id]: open }))}
                          >
                            <DialogTrigger asChild>
                              <Button size="icon" className="h-7 w-7" title="Approve">
                                <Check className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Approve Leave Request</DialogTitle>
                                <DialogDescription>Add an optional comment for this approval.</DialogDescription>
                              </DialogHeader>
                              <Textarea
                                placeholder="Enter approval comments (optional)"
                                id={`approve-comment-${request.id}`}
                              />
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setApprovalDialogs((prev) => ({ ...prev, [request.id]: false }))}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => {
                                    const commentEl = document.getElementById(
                                      `approve-comment-${request.id}`,
                                    ) as HTMLTextAreaElement
                                    handleApprove(request.id, commentEl?.value || "Approved")
                                  }}
                                >
                                  Approve
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Dialog
                            open={rejectionDialogs[request.id]}
                            onOpenChange={(open) => setRejectionDialogs((prev) => ({ ...prev, [request.id]: open }))}
                          >
                            <DialogTrigger asChild>
                              <Button size="icon" variant="destructive" className="h-7 w-7" title="Reject">
                                <X className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Confirm Rejection</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to reject this leave request?
                                </DialogDescription>
                              </DialogHeader>
                              <Textarea
                                placeholder="Enter rejection reason (optional)"
                                id={`reject-comment-${request.id}`}
                              />
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setRejectionDialogs((prev) => ({ ...prev, [request.id]: false }))}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => {
                                    const commentEl = document.getElementById(
                                      `reject-comment-${request.id}`,
                                    ) as HTMLTextAreaElement
                                    handleReject(request.id, commentEl?.value || "Rejected")
                                  }}
                                >
                                  Reject
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Dialog
                            open={openDialogs[`info-${request.id}`]}
                            onOpenChange={(open) =>
                              setOpenDialogs((prev) => ({ ...prev, [`info-${request.id}`]: open }))
                            }
                          >
                            <DialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-7 w-7"
                                title="Request More Info"
                                onClick={() => {
                                  // Initialize the input state with the current value when opening
                                  setAdditionalInfoInputs((prev) => ({
                                    ...prev,
                                    [request.id]: request.additionalInfo || "",
                                  }))
                                  setOpenDialogs((prev) => ({ ...prev, [`info-${request.id}`]: true }))
                                }}
                              >
                                <Info className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Request More Information</DialogTitle>
                                <DialogDescription>
                                  Ask for additional details about this leave request.
                                </DialogDescription>
                              </DialogHeader>
                              <Textarea
                                placeholder="Enter your questions or comments here"
                                value={additionalInfoInputs[request.id] || ""}
                                onChange={(e) => handleAdditionalInfoChange(request.id, e.target.value)}
                              />
                              <DialogFooter>
                                <Button
                                  onClick={() => handleRequestInfo(request.id, additionalInfoInputs[request.id] || "")}
                                >
                                  Submit
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )

  // Mobile view with card-based layout
  const renderMobileView = () => (
    <div className="md:hidden space-y-4">
      {filteredPendingRequests.map((request) => (
        <Card
          key={request.id}
          className={request.status === "approved" ? "bg-green-50" : request.status === "rejected" ? "bg-red-50" : ""}
        >
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">{request.employeeName}</CardTitle>
                <CardDescription className="text-sm">{request.email}</CardDescription>
              </div>
              {request.status === "pending" && (
                <Checkbox
                  checked={!!request.selected}
                  onCheckedChange={() => toggleSelectRequest(request.id)}
                  aria-label={`Select ${request.employeeName}'s request`}
                />
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <p className="text-xs text-muted-foreground">ID</p>
                <p className="text-sm">{request.employeeId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="text-sm">{request.type}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Start</p>
                <p className="text-sm">{format(new Date(request.startDate), "MM/dd/yy")}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">End</p>
                <p className="text-sm">{format(new Date(request.endDate), "MM/dd/yy")}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Days</p>
                <p className="text-sm">{calculateLeaveDuration(request.startDate, request.endDate)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p
                  className={
                    request.status === "approved"
                      ? "text-sm text-green-600 font-medium"
                      : request.status === "rejected"
                        ? "text-sm text-red-600 font-medium"
                        : "text-sm text-amber-600 font-medium"
                  }
                >
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </p>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs text-muted-foreground">Reason</p>
              <p className="text-sm">{request.reason || "-"}</p>
            </div>

            {request.additionalInfo && (
              <div className="mb-3 p-2 bg-blue-50 rounded-md border border-blue-100">
                <p className="text-xs text-blue-700 font-medium">Additional Information</p>
                <p className="text-sm">{request.additionalInfo}</p>
              </div>
            )}

            <Collapsible open={expandedRows[request.id]} onOpenChange={() => toggleRowExpansion(request.id)}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full flex justify-between items-center p-2 h-8">
                  <span>Details</span>
                  {expandedRows[request.id] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {request.statusComment && (
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground">Status Comments</p>
                    <p className="text-sm">{request.statusComment}</p>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>

            {request.status === "pending" && (
              <div className="flex gap-2 mt-3">
                <Dialog
                  open={approvalDialogs[request.id]}
                  onOpenChange={(open) => setApprovalDialogs((prev) => ({ ...prev, [request.id]: open }))}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" className="flex-1">
                      Approve
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Approve Leave Request</DialogTitle>
                      <DialogDescription>Add an optional comment for this approval.</DialogDescription>
                    </DialogHeader>
                    <Textarea
                      placeholder="Enter approval comments (optional)"
                      id={`approve-comment-mobile-${request.id}`}
                    />
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setApprovalDialogs((prev) => ({ ...prev, [request.id]: false }))}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          const commentEl = document.getElementById(
                            `approve-comment-mobile-${request.id}`,
                          ) as HTMLTextAreaElement
                          handleApprove(request.id, commentEl?.value || "Approved")
                        }}
                      >
                        Approve
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog
                  open={rejectionDialogs[request.id]}
                  onOpenChange={(open) => setRejectionDialogs((prev) => ({ ...prev, [request.id]: open }))}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" variant="destructive" className="flex-1">
                      Reject
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Rejection</DialogTitle>
                      <DialogDescription>Are you sure you want to reject this leave request?</DialogDescription>
                    </DialogHeader>
                    <Textarea
                      placeholder="Enter rejection reason (optional)"
                      id={`reject-comment-mobile-${request.id}`}
                    />
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setRejectionDialogs((prev) => ({ ...prev, [request.id]: false }))}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          const commentEl = document.getElementById(
                            `reject-comment-mobile-${request.id}`,
                          ) as HTMLTextAreaElement
                          handleReject(request.id, commentEl?.value || "Rejected")
                        }}
                      >
                        Reject
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog
                  open={openDialogs[`info-${request.id}`]}
                  onOpenChange={(open) => setOpenDialogs((prev) => ({ ...prev, [`info-${request.id}`]: open }))}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-10 flex-shrink-0"
                      title="More Info"
                      onClick={() => {
                        setAdditionalInfoInputs((prev) => ({
                          ...prev,
                          [request.id]: request.additionalInfo || "",
                        }))
                        setOpenDialogs((prev) => ({ ...prev, [`info-${request.id}`]: true }))
                      }}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Request More Information</DialogTitle>
                      <DialogDescription>Ask for additional details about this leave request.</DialogDescription>
                    </DialogHeader>
                    <Textarea
                      placeholder="Enter your questions or comments here"
                      value={additionalInfoInputs[request.id] || ""}
                      onChange={(e) => handleAdditionalInfoChange(request.id, e.target.value)}
                    />
                    <DialogFooter>
                      <Button onClick={() => handleRequestInfo(request.id, additionalInfoInputs[request.id] || "")}>
                        Submit
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="container mx-auto py-4 px-2 sm:px-4 sm:py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Leave Approvals</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pending Leave Requests</CardTitle>
          <CardDescription>Manage leave requests for your team</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="w-full sm:w-auto">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by employee or leave type"
                  className="pl-8 w-full sm:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex space-x-2 mt-2 sm:mt-0">
              <Button onClick={handleBulkApprove} variant="default" size="sm">
                Approve Selected
              </Button>
              <Button onClick={handleBulkReject} variant="destructive" size="sm">
                Reject Selected
              </Button>
            </div>
          </div>

          <div className="md:block hidden text-xs text-muted-foreground mb-2">
            {/* <span>Scroll horizontally if needed to see all columns →</span> */}
          </div>

          {renderDesktopTable()}
          {renderMobileView()}
        </CardContent>
      </Card>
    </div>
  )
}

