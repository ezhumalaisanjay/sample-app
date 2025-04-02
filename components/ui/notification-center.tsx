"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

type Notification = {
  id: string
  message: string
  read: boolean
  timestamp: Date
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // In a real application, you would fetch notifications from an API
    const fetchNotifications = async () => {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setNotifications([
        {
          id: "1",
          message: "Your leave request for Annual Leave has been approved.",
          read: false,
          timestamp: new Date(),
        },
        {
          id: "2",
          message: "Your leave request for Sick Leave is pending approval.",
          read: false,
          timestamp: new Date(Date.now() - 86400000), // 1 day ago
        },
      ])
    }

    fetchNotifications()
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prevNotifications) => prevNotifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prevNotifications) => prevNotifications.map((n) => ({ ...n, read: true })))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel className="flex justify-between">
          Notifications
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <DropdownMenuItem>No notifications</DropdownMenuItem>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex flex-col items-start">
              <div className="flex justify-between w-full">
                <span className={notification.read ? "text-muted-foreground" : "font-semibold"}>
                  {notification.message}
                </span>
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      markAsRead(notification.id)
                    }}
                  >
                    Mark as read
                  </Button>
                )}
              </div>
              <span className="text-xs text-muted-foreground">{notification.timestamp.toLocaleString()}</span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

