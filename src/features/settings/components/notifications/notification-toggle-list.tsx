import { Card, CardHeader } from '../../../../components/ui/card'
import { Switch } from '../../../../components/ui/switch'
import { useUpdateNotificationSettings } from '../../hooks/use-update-notification-settings'
import type { NotificationChannel, NotificationToggle } from '../../types/settings-types'

const CHANNEL_COPY: Record<NotificationChannel, { title: string; description: string }> = {
  email: { title: 'Email Notifications', description: 'Choose which events send an email to you.' },
  inApp: { title: 'In-app Notifications', description: 'Choose which events show up in your notification bell.' },
  payroll: { title: 'Payroll Notifications', description: 'Notifications tied to payroll run activity.' },
  approvals: { title: 'Approval Notifications', description: 'Notifications tied to approval requests and decisions.' },
}

export function NotificationToggleList({ channel, toggles }: { channel: NotificationChannel; toggles: NotificationToggle[] }) {
  const updateNotificationSettings = useUpdateNotificationSettings()
  const copy = CHANNEL_COPY[channel]

  function handleToggle(key: string, enabled: boolean) {
    const next = toggles.map((toggle) => (toggle.key === key ? { ...toggle, enabled } : toggle))
    updateNotificationSettings.mutate({ [channel]: next })
  }

  return (
    <Card>
      <CardHeader title={copy.title} description={copy.description} />
      <div className="divide-y divide-line">
        {toggles.map((toggle) => (
          <div key={toggle.key} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <div>
              <p className="text-sm font-medium text-ink">{toggle.label}</p>
              <p className="mt-0.5 text-xs text-muted">{toggle.description}</p>
            </div>
            <Switch checked={toggle.enabled} onChange={(enabled) => handleToggle(toggle.key, enabled)} label={toggle.label} />
          </div>
        ))}
      </div>
    </Card>
  )
}
