"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Check, Trash2, X, MessageSquare, Award, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
  subscribeToNotifications,
  type Notification,
  type NotificationType,
} from "./notification-service"
import { Badge } from "@/components/ui/badge"

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("all")

  useEffect(() => {
    // Get initial notifications
    setNotifications(getNotifications())

    // Subscribe to notification changes
    const unsubscribe = subscribeToNotifications((updatedNotifications) => {
      setNotifications(updatedNotifications)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const filteredNotifications = activeTab === "all" ? notifications : notifications.filter((n) => n.type === activeTab)

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id)
  }

  const handleDismissNotification = (id: string) => {
    deleteNotification(id)
  }

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead()
  }

  const handleClearAllNotifications = () => {
    clearAllNotifications()
  }

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "achievement":
        return <Award className="h-4 w-4 text-yellow-500" />
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "system":
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const getNotificationBgColor = (notification: Notification) => {
    if (notification.read) return "bg-gray-100"

    switch (notification.type) {
      case "achievement":
        if (notification.data?.type === "level") return "bg-purple-50"
        if (notification.data?.type === "badge") return "bg-yellow-50"
        return "bg-green-50"
      case "message":
        return "bg-blue-50"
      case "alert":
        return "bg-red-50"
      case "system":
      default:
        return "bg-gray-50"
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                <Check className="h-4 w-4 mr-1" /> Mark all read
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClearAllNotifications}>
                <Trash2 className="h-4 w-4 mr-1" /> Clear all
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="achievement">Rewards</TabsTrigger>
                <TabsTrigger value="message">Messages</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[300px] p-4">
                {filteredNotifications.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No notifications</p>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn("mb-4 p-3 rounded-lg transition-colors", getNotificationBgColor(notification))}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                          <div>
                            <h4 className="text-sm font-medium">{notification.title}</h4>
                            <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.timestamp.toLocaleString()}</p>

                            {notification.type === "achievement" && notification.data && (
                              <Badge
                                className={cn(
                                  "mt-2",
                                  notification.data.type === "level"
                                    ? "bg-purple-500"
                                    : notification.data.type === "badge"
                                      ? "bg-yellow-500"
                                      : "bg-green-500",
                                )}
                              >
                                {notification.data.type === "points"
                                  ? `+${notification.data.value} points`
                                  : notification.data.type}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {!notification.read && (
                            <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification.id)}>
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleDismissNotification(notification.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </ScrollArea>
            </Tabs>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}

