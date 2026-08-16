import { Link } from 'react-router'
import { Badge } from '../../../../components/ui/badge'
import { Card } from '../../../../components/ui/card'
import { daysUntil } from '../../lib/format'
import type { SubscriptionStatus } from '../../types/dashboard-types'

const TRIAL_LENGTH_DAYS = 14

const STATUS_META: Record<SubscriptionStatus['status'], { label: string; tone: 'accent' | 'positive' | 'critical' }> = {
  trial: { label: 'Trial', tone: 'accent' },
  active: { label: 'Active', tone: 'positive' },
  past_due: { label: 'Past due', tone: 'critical' },
}

export function SubscriptionStatusCard({ subscription }: { subscription: SubscriptionStatus }) {
  const statusMeta = STATUS_META[subscription.status]
  const daysRemaining = subscription.trialEndsAt ? Math.max(0, daysUntil(subscription.trialEndsAt)) : null
  const trialProgress =
    daysRemaining !== null ? Math.round(((TRIAL_LENGTH_DAYS - daysRemaining) / TRIAL_LENGTH_DAYS) * 100) : null

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-ink">{subscription.planName}</p>
          <p className="mt-0.5 text-xs text-muted">
            {subscription.seatsUsed} / {subscription.seatsLimit} seats used
          </p>
        </div>
        <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
      </div>

      {daysRemaining !== null ? (
        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-pill bg-surface-2">
            <div
              className="h-full rounded-pill bg-accent transition-[width]"
              style={{ width: `${trialProgress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted">
            {daysRemaining > 0 ? `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} left in trial` : 'Trial ends today'}
          </p>
        </div>
      ) : null}

      <Link
        to="/settings/billing"
        className="mt-4 flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90"
      >
        Manage billing
      </Link>
    </Card>
  )
}
