import { Badge } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import { formatRelativeTime } from '../../../dashboard/lib/format'
import type { SecurityActivityEntry } from '../../types/settings-types'

export function SecurityActivityView({ activity }: { activity: SecurityActivityEntry[] }) {
  return (
    <Card>
      <CardHeader title="Security Activity" description="Recent sign-ins and account security events." />
      <div className="divide-y divide-line">
        {activity.map((entry) => (
          <div key={entry.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-ink">{entry.event}</p>
                <Badge tone={entry.status === 'success' ? 'positive' : 'critical'}>
                  {entry.status === 'success' ? 'Success' : 'Failed'}
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-muted">{entry.description}</p>
              <p className="mt-0.5 text-xs text-muted">
                {entry.device} · {entry.ipAddress} · {formatRelativeTime(entry.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
