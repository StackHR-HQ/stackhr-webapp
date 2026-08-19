import { UnderlineTabs } from '../../../../components/ui/underline-tabs'
import { NOTIFICATIONS_TABS } from '../../lib/notifications-tabs-data'
import type { NotificationChannel } from '../../types/settings-types'

export function NotificationsTabs({
  active,
  onChange,
}: {
  active: NotificationChannel
  onChange: (key: NotificationChannel) => void
}) {
  return <UnderlineTabs tabs={NOTIFICATIONS_TABS} active={active} onChange={onChange} />
}
