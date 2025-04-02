export interface User {
  id: string
  name: string
  email: string
  role: string
  notificationPreferences?: NotificationPreference
}

export interface Event {
  type: string
  data: Record<string, any>
}

export interface Trigger {
  id: number
  name: string
  description: string
  event: string
  template: string
  recipients: string[]
  active: boolean
  icon: any // You might want to use a more specific type for icons
}

export interface NotificationTemplate {
  subject: string
  body: string
}

export interface NotificationPreference {
  notificationTypes: string[]
  frequency: "immediate" | "daily_digest" | "weekly_digest"
}

