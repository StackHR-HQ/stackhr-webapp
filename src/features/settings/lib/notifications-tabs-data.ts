import type { NotificationChannel } from '../types/settings-types'

export const NOTIFICATIONS_TABS: { key: NotificationChannel; label: string }[] = [
  { key: 'email', label: 'Email Notifications' },
  { key: 'inApp', label: 'In-app Notifications' },
  { key: 'payroll', label: 'Payroll Notifications' },
  { key: 'approvals', label: 'Approval Notifications' },
]
