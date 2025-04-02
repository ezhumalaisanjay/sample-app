import type { User, Event, Trigger, NotificationTemplate, NotificationPreference } from "@/types"
import { showNotification } from "./notifications"

// Define notification types
export type NotificationType = "message" | "system" | "achievement" | "alert"

// Define notification interface
export interface Notification {
  id: string
  title: string
  message: string
  timestamp: Date
  type: NotificationType
  data?: any
  read: boolean
}

// In-memory store for notifications
let notifications: Notification[] = []

// Event listeners
const listeners: ((notifications: Notification[]) => void)[] = []

// Add a notification to the center
export function addNotificationToCenter(notification: Notification): void {
  notifications = [notification, ...notifications]

  // Notify all listeners
  listeners.forEach((listener) => listener(notifications))
}

// Get all notifications
export function getNotifications(): Notification[] {
  return notifications
}

// Mark a notification as read
export function markNotificationAsRead(id: string): void {
  notifications = notifications.map((notification) =>
    notification.id === id ? { ...notification, read: true } : notification,
  )

  // Notify all listeners
  listeners.forEach((listener) => listener(notifications))
}

// Mark all notifications as read
export function markAllNotificationsAsRead(): void {
  notifications = notifications.map((notification) => ({ ...notification, read: true }))

  // Notify all listeners
  listeners.forEach((listener) => listener(notifications))
}

// Delete a notification
export function deleteNotification(id: string): void {
  notifications = notifications.filter((notification) => notification.id !== id)

  // Notify all listeners
  listeners.forEach((listener) => listener(notifications))
}

// Clear all notifications
export function clearAllNotifications(): void {
  notifications = []

  // Notify all listeners
  listeners.forEach((listener) => listener(notifications))
}

// Subscribe to notification changes
export function subscribeToNotifications(listener: (notifications: Notification[]) => void): () => void {
  listeners.push(listener)

  // Return unsubscribe function
  return () => {
    const index = listeners.indexOf(listener)
    if (index !== -1) {
      listeners.splice(index, 1)
    }
  }
}

// Initialize with some sample notifications
export function initializeNotifications(): void {
  addNotificationToCenter({
    id: "welcome",
    title: "Welcome to the App",
    message: "Thanks for joining! We're excited to have you here.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    type: "system",
    read: false,
  })

  addNotificationToCenter({
    id: "new_message",
    title: "New Message",
    message: "You have a new message from John Doe",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    type: "message",
    read: false,
  })
}

// Call initialize on module load
initializeNotifications()

// Simulated email sending function
async function sendEmail(to: string, subject: string, body: string): Promise<boolean> {
  console.log(`Sending email to ${to}`)
  console.log(`Subject: ${subject}`)
  console.log(`Body: ${body}`)
  // In a real implementation, this would use an email service like SendGrid, AWS SES, etc.
  return true
}

// Updated function to get users based on roles and preferences
async function getUsersByRoleAndPreferences(role: string, eventType: string): Promise<User[]> {
  // This would typically query a database. For now, we'll use mock data.
  const mockUsers: User[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "employee",
      notificationPreferences: {
        notificationTypes: ["leave_requests", "performance_reviews"],
        frequency: "immediate",
      },
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "manager",
      notificationPreferences: {
        notificationTypes: ["leave_requests", "performance_reviews", "team_announcements"],
        frequency: "daily_digest",
      },
    },
    {
      id: "3",
      name: "HR Team",
      email: "hr@example.com",
      role: "hr",
      notificationPreferences: {
        notificationTypes: ["leave_requests", "performance_reviews", "system_updates"],
        frequency: "immediate",
      },
    },
    {
      id: "4",
      name: "IT Support",
      email: "it@example.com",
      role: "it",
      notificationPreferences: {
        notificationTypes: ["system_updates"],
        frequency: "weekly_digest",
      },
    },
  ]

  return mockUsers.filter(
    (user) => user.role === role && user.notificationPreferences?.notificationTypes.includes(eventType),
  )
}

// Function to determine if a notification should be sent immediately
function shouldSendImmediately(preferences: NotificationPreference): boolean {
  return preferences.frequency === "immediate"
}

// Function to get users based on roles
function getUsersByRole(role: string): User[] {
  // This would typically query a database. For now, we'll use mock data.
  const mockUsers: User[] = [
    { id: "1", name: "John Doe", email: "john@example.com", role: "employee"},
    { id: "2", name: "Jane Smith", email: "jane@example.com", role: "manager" },
    { id: "3", name: "HR Team", email: "hr@example.com", role: "hr" },
    { id: "4", name: "IT Support", email: "it@example.com", role: "it" },
  ]

  return mockUsers.filter((user) => user.role === role)
}

// Function to get the appropriate template based on the event
function getTemplate(event: Event): NotificationTemplate {
  // This would typically fetch the template from a database or file system
  // For now, we'll use a simple switch statement
  switch (event.type) {
    case "leave_request.created":
      return {
        subject: "New Leave Request",
        body: "A new leave request has been submitted by {{employee_name}} for {{start_date}} to {{end_date}}.",
      }
    case "performance_review.scheduled":
      return {
        subject: "Performance Review Scheduled",
        body: "Your performance review has been scheduled for {{review_date}}.",
      }
    // Add more cases for different event types
    default:
      return {
        subject: "Notification",
        body: "You have a new notification.",
      }
  }
}

// Function to replace template variables with actual values
function populateTemplate(template: NotificationTemplate, event: Event): NotificationTemplate {
  let populatedSubject = template.subject
  let populatedBody = template.body

  // Replace variables in the subject and body
  Object.entries(event.data).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, "g")
    populatedSubject = populatedSubject.replace(regex, value.toString())
    populatedBody = populatedBody.replace(regex, value.toString())
  })

  return {
    subject: populatedSubject,
    body: populatedBody,
  }
}

// Updated main function to process an event and send notifications
export async function processEventAndNotify(event: Event, trigger: Trigger): Promise<void> {
  const template = getTemplate(event)
  const populatedTemplate = populateTemplate(template, event)

  const recipients: User[] = []
  for (const recipientRole of trigger.recipients) {
    const users = await getUsersByRoleAndPreferences(recipientRole, event.type)
    recipients.push(...users)
  }

  // Send immediate notifications
  const immediateRecipients = recipients.filter((user) => { if(user.notificationPreferences) { shouldSendImmediately(user.notificationPreferences)}})
  for (const recipient of immediateRecipients) {
    await sendEmail(recipient.email, populatedTemplate.subject, populatedTemplate.body)
    showNotification(`New notification: ${populatedTemplate.subject}`, "info")
    addNotificationToCenter({
      id: crypto.randomUUID(),
      title: populatedTemplate.subject,
      message: populatedTemplate.body,
      timestamp: new Date(),
      type: "system", // Assuming system notification for now
      read: false,
    })
  }

  // Queue digest notifications
  const digestRecipients = recipients.filter((user) =>{ if(user.notificationPreferences) { !shouldSendImmediately(user.notificationPreferences)}})
  for (const recipient of digestRecipients) {
    await queueDigestNotification(recipient, event, populatedTemplate)
  }

  console.log(`Notifications processed for event: ${event.type}`)
  showNotification(`Event processed: ${event.type}`, "success")
}

// Function to add a notification to the notification center
// function addToNotificationCenter(userId: string, title: string, message: string) {
//   // In a real application, this would interact with a state management solution or backend
//   console.log(`Adding notification to center for user ${userId}: ${title}`)
//   // You could emit an event here that the NotificationCenter component listens for
//   // to update its state in real-time
// }

// Function to queue digest notifications (to be implemented)
async function queueDigestNotification(user: User, event: Event, template: NotificationTemplate): Promise<void> {
  // In a real implementation, this would add the notification to a queue
  // for later processing and sending as part of a digest
  console.log(`Queued digest notification for ${user.email}: ${event.type}`)
}

