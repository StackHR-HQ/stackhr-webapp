import { ClockCounterClockwiseIcon } from '@phosphor-icons/react'
import { Card, CardHeader } from '../../../../components/ui/card'
import { formatDate } from '../../lib/format'
import type { EmployeeDetail } from '../../types/people-types'

export function ActivityTab({ employee }: { employee: EmployeeDetail }) {
  return (
    <Card>
      <CardHeader title="Activity" description="Everything logged against this employee" />
      {employee.activity.length > 0 ? (
        <ul className="space-y-4">
          {employee.activity.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-2">
                <ClockCounterClockwiseIcon className="h-3.5 w-3.5 text-ink" />
              </span>
              <div>
                <p className="text-sm text-ink">{item.description}</p>
                <p className="mt-0.5 text-xs text-muted">{formatDate(item.timestamp)}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">No activity yet.</p>
      )}
    </Card>
  )
}
