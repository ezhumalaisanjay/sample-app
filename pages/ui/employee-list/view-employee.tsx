"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, MapPin, Calendar, Briefcase, User, Building } from "lucide-react"

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

interface ViewEmployeeDialogProps {
  employee: Employee | null
  open: boolean
  onClose: () => void
}

export default function ViewEmployeeDialog({ employee, open, onClose }: ViewEmployeeDialogProps) {
  if (!employee) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Employee Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
              {employee.firstName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h2 className="text-xl font-bold">{employee.firstName} {employee.lastName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={
                    employee.status === "Active"
                      ? "default"
                      : employee.status === "Inactive"
                        ? "secondary"
                        : employee.status === "On Leave"
                          ? "outline"
                          : "outline"
                  }
                >
                  {employee.status}
                </Badge>
                <span className="text-sm text-muted-foreground">ID: {employee.employeeId}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Job Title</p>
                  <p>{employee.jobTitle}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Department</p>
                  <p>{employee.department}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Manager</p>
                  <p>{employee.manager || "None"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p>{employee.mailId}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p>{employee.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Start Date</p>
                  <p>{employee.startDate}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Status Indicators</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div
                className={`p-3 rounded-md ${employee.leaveRequestPending ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-500"}`}
              >
                <p className="text-sm font-medium">Leave Request</p>
                <p>{employee.leaveRequestPending ? "Pending" : "None"}</p>
              </div>
              <div
                className={`p-3 rounded-md ${employee.performanceReviewDue ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-500"}`}
              >
                <p className="text-sm font-medium">Performance Review</p>
                <p>{employee.performanceReviewDue ? "Due" : "Up to date"}</p>
              </div>
              <div
                className={`p-3 rounded-md ${employee.trainingOverdue ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-500"}`}
              >
                <p className="text-sm font-medium">Training</p>
                <p>{employee.trainingOverdue ? "Overdue" : "Up to date"}</p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

