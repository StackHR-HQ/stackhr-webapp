import { Card } from '../../../../components/ui/card'
import type { LeavePolicy } from '../../types/people-types'

export function LeavePoliciesView({ policies }: { policies: LeavePolicy[] }) {
  return (
    <div className="space-y-3">
      {policies.map((policy) => (
        <Card key={policy.id}>
          <p className="text-sm font-medium text-ink">{policy.title}</p>
          <p className="mt-1 text-sm text-muted">{policy.description}</p>
        </Card>
      ))}
    </div>
  )
}
