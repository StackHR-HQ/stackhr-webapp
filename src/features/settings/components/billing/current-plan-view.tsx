import { CheckCircleIcon } from '@phosphor-icons/react'
import { Card, CardHeader } from '../../../../components/ui/card'
import type { CurrentPlan } from '../../types/settings-types'

export function CurrentPlanView({ currentPlan }: { currentPlan: CurrentPlan }) {
  return (
    <Card>
      <CardHeader title="Current Plan" description="The plan your organization is subscribed to." />
      <div className="rounded-lg border border-line p-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-lg font-medium text-ink">{currentPlan.name}</p>
          <p className="text-sm text-muted">{currentPlan.priceLabel}</p>
        </div>
        <p className="mt-1 text-xs text-muted">
          Billed {currentPlan.billingCycle} · {currentPlan.seatsIncluded} seats included
        </p>

        <ul className="mt-4 space-y-2">
          {currentPlan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm text-ink">
              <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-positive" weight="fill" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
