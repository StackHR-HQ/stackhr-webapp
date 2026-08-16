import {
  CalendarBlankIcon,
  HandCoinsIcon,
  IdentificationCardIcon,
  MoneyIcon,
  ReceiptIcon,
  ShieldCheckIcon,
  ArrowUUpLeftIcon,
  type Icon,
} from '@phosphor-icons/react'
import { Card, CardHeader } from '../../../../components/ui/card'
import { formatRelativeTime } from '../../lib/format'
import type { ActivityItem, ActivityKind } from '../../types/dashboard-types'

const ACTIVITY_ICONS: Record<ActivityKind, Icon> = {
  payroll: MoneyIcon,
  leave: CalendarBlankIcon,
  expense: ReceiptIcon,
  reimbursement: ArrowUUpLeftIcon,
  'salary-advance': HandCoinsIcon,
  employee: IdentificationCardIcon,
  compliance: ShieldCheckIcon,
}

export function RecentActivityCard({ activity }: { activity: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader title="Recent activity" />

      <ul className="space-y-4">
        {activity.map((item) => {
          const ActivityIcon = ACTIVITY_ICONS[item.kind]
          return (
            <li key={item.id} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-2">
                <ActivityIcon className="h-3.5 w-3.5 text-ink" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-ink">
                  <span className="font-medium">{item.actor}</span> · {item.description}
                </p>
                <p className="mt-0.5 text-xs text-muted">{formatRelativeTime(item.timestamp)}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
