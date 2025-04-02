"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

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

interface DeleteConfirmationDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: (id: string) => void
  selectedEmployees: Employee[]
}

export default function DeleteConfirmationDialog({
  open,
  onClose,
  onConfirm,
  selectedEmployees = [],
}: DeleteConfirmationDialogProps) {

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-destructive">
            <Trash2 className="mr-2 h-5 w-5" />
            Confirm Deletion
          </DialogTitle>
          <DialogDescription>
            {selectedEmployees.length === 1
              ? `Are you sure you want to delete ${selectedEmployees[0]?.firstName} ${selectedEmployees[0]?.lastName}?`
              : `Are you sure you want to delete ${selectedEmployees.length} selected employees?`}
          </DialogDescription>
        </DialogHeader>

        {selectedEmployees.length > 1 && (
          <div className="max-h-[200px] overflow-y-auto border rounded-md p-2">
            <ul className="space-y-1">
              {selectedEmployees.map((employee) => (
                <li key={employee.id} className="text-sm">
                  {employee.name} ({employee.employeeId})
                </li>
              ))}
            </ul>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="destructive" onClick={() => selectedEmployees.map((emp) => onConfirm(emp.id))}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

