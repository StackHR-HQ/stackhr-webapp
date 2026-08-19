import { Badge, type BadgeTone } from '../../../../components/ui/badge'
import { Button } from '../../../../components/ui/button'
import { Card, CardHeader } from '../../../../components/ui/card'
import { Switch } from '../../../../components/ui/switch'
import { formatDate } from '../../../dashboard/lib/format'
import { useUpdateSubscription } from '../../hooks/use-update-subscription'
import type { Subscription, SubscriptionPlanStatus } from '../../types/settings-types'

const STATUS_META: Record<SubscriptionPlanStatus, { label: string; tone: BadgeTone }> = {
  trial: { label: 'Trial', tone: 'accent' },
  active: { label: 'Active', tone: 'positive' },
  past_due: { label: 'Past due', tone: 'critical' },
  canceled: { label: 'Canceled', tone: 'neutral' },
}

export function SubscriptionView({ subscription }: { subscription: Subscription }) {
  const updateSubscription = useUpdateSubscription()
  const statusMeta = STATUS_META[subscription.status]
  const seatsPercent = Math.min(100, Math.round((subscription.seatsUsed / subscription.seatsLimit) * 100))

  return (
    <Card>
      <CardHeader title="Subscription" description="The current billing period, seat usage, and renewal settings." />
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-line p-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-ink">Status</p>
              <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
            </div>
            <p className="mt-1 text-xs text-muted">
              Current period: {formatDate(subscription.currentPeriodStart)} – {formatDate(subscription.currentPeriodEnd)}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-line p-4">
          <div className="flex items-center justify-between text-sm">
            <p className="font-medium text-ink">Seats used</p>
            <p className="text-muted">
              {subscription.seatsUsed} / {subscription.seatsLimit}
            </p>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-pill bg-surface-2">
            <div className="h-full rounded-pill bg-accent transition-[width]" style={{ width: `${seatsPercent}%` }} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-line p-4">
          <div>
            <p className="text-sm font-medium text-ink">Auto-renew</p>
            <p className="mt-0.5 text-xs text-muted">Automatically renew this subscription at the end of each billing period.</p>
          </div>
          <Switch
            checked={subscription.autoRenew}
            onChange={(autoRenew) => updateSubscription.mutate({ autoRenew })}
            label="Auto-renew"
          />
        </div>

        <div className="flex justify-end gap-3">
          {subscription.status === 'canceled' ? (
            <Button
              type="button"
              className="w-auto px-6"
              loading={updateSubscription.isPending}
              onClick={() => updateSubscription.mutate({ status: 'active' })}
            >
              Reactivate subscription
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              className="w-auto px-6"
              loading={updateSubscription.isPending}
              onClick={() => updateSubscription.mutate({ status: 'canceled', autoRenew: false })}
            >
              Cancel subscription
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
