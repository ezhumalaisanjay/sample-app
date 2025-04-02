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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import * as React from "react"


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

interface SendMessageDialogProps {
  open: boolean
  onClose: () => void
  selectedEmployees: Employee[]
  onMessageSent?: () => void // Add this optional callback
}

export default function SendMessageDialog({
  open,
  onClose,
  selectedEmployees = [],
  onMessageSent,
}: SendMessageDialogProps) {
  const [message, setMessage] = React.useState("")
  const { toast } = useToast()

  const handleSendMessage = () => {
    // Simulate sending the message
    console.log("Sending message:", message, "to", selectedEmployees)
    toast({
      title: "Message Sent",
      description: `Message sent to ${selectedEmployees.length} employees.`,
    })

    // Call the onMessageSent callback if provided
    if (onMessageSent) {
      onMessageSent()
    }

    onClose() // This will also reset the row selection because we modified the onClose handler
    setMessage("")
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Message</DialogTitle>
          <DialogDescription>Send a message to the selected employees.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your message here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          {selectedEmployees.length > 0 && (
            <div>
              <p className="text-sm font-medium">Recipients:</p>
              <ul className="list-disc pl-5 text-sm">
                {selectedEmployees.map((employee) => (
                  <li key={employee.id}>
                    {employee.firstName} {employee.lastName} ({employee.mailId})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSendMessage}>
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

