import { useState } from 'react'
import { NotificationToggleList } from '../components/notifications/notification-toggle-list'
import { NotificationsTabs } from '../components/notifications/notifications-tabs'
import { useNotificationSettings } from '../hooks/use-notification-settings'
import type { NotificationChannel } from '../types/settings-types'

export function NotificationsPage() {
  const { data: settings, isPending } = useNotificationSettings()
  const [activeTab, setActiveTab] = useState<NotificationChannel>('email')

  return (
    <div className="max-w-[900px] space-y-5">
      <div>
        <h1 className="text-xl font-medium text-ink">Notifications</h1>
        <p className="mt-1 text-sm text-muted">Control which events notify you and your team, and how.</p>
      </div>

      <NotificationsTabs active={activeTab} onChange={setActiveTab} />

      {isPending || !settings ? (
        <div className="h-64 animate-pulse rounded-panel border border-line bg-surface" />
      ) : (
        <NotificationToggleList channel={activeTab} toggles={settings[activeTab]} />
      )}
    </div>
  )
}
