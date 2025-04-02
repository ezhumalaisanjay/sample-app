import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface NotificationDetailProps {
  notification: {
    id: number
    trigger: string
    template: string
    recipient: string
    subject: string
    status: string
    timestamp: string
    icon: React.ElementType
  } | null
  isOpen: boolean
  onClose: () => void
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  }).format(date)
}

function getStatusBadge(status: string) {
  switch (status) {
    case "delivered":
      return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
    case "failed":
      return <Badge variant="destructive">Failed</Badge>
    case "pending":
      return (
        <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
          Pending
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function NotificationDetail({ notification, isOpen, onClose }: NotificationDetailProps) {
  if (!notification) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Notification Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-primary/10">
              <notification.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">{notification.trigger}</h3>
          </div>
          <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2 text-sm">
            <span className="font-medium">Template:</span>
            <span>{notification.template}</span>

            <span className="font-medium">Recipient:</span>
            <span>{notification.recipient}</span>

            <span className="font-medium">Subject:</span>
            <span>{notification.subject}</span>

            <span className="font-medium">Status:</span>
            <span>{getStatusBadge(notification.status)}</span>

            <span className="font-medium">Timestamp:</span>
            <span>{formatDate(notification.timestamp)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

