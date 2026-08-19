import { Badge } from '../../../../components/ui/badge'
import { Button } from '../../../../components/ui/button'
import { Card, CardHeader } from '../../../../components/ui/card'
import { daysUntil } from '../../../dashboard/lib/format'
import { useUpdateSubscription } from '../../hooks/use-update-subscription'
import type { Subscription } from '../../types/settings-types'

const TRIAL_LENGTH_DAYS = 14

export function TrialStatusView({ subscription }: { subscription: Subscription }) {
  const updateSubscription = useUpdateSubscription()

  if (subscription.status !== 'trial' || !subscription.trialEndsAt) {
    return (
      <Card>
        <CardHeader title="Trial Status" description="Whether your organization is currently on a free trial." />
        <p className="text-sm text-muted">Your organization isn't currently on a trial.</p>
      </Card>
    )
  }

  const daysRemaining = Math.max(0, daysUntil(subscription.trialEndsAt))
  const progress = Math.round(((TRIAL_LENGTH_DAYS - daysRemaining) / TRIAL_LENGTH_DAYS) * 100)

  return (
    <Card>
      <CardHeader title="Trial Status" description="Your organization is currently on a free trial." />
      <div className="rounded-lg border border-line p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-ink">
            {daysRemaining > 0 ? `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} left` : 'Trial ends today'}
          </p>
          <Badge tone="accent">Trial</Badge>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-pill bg-surface-2">
          <div className="h-full rounded-pill bg-accent transition-[width]" style={{ width: `${Math.min(100, progress)}%` }} />
        </div>
        <p className="mt-3 text-xs text-muted">
          Upgrade to a paid plan any time to keep full access after your trial ends, with no interruption to payroll or approvals.
        </p>
        <Button
          type="button"
          className="mt-4 w-auto px-6"
          loading={updateSubscription.isPending}
          onClick={() => updateSubscription.mutate({ status: 'active', trialEndsAt: undefined })}
        >
          Upgrade now
        </Button>
      </div>
    </Card>
  )
}
