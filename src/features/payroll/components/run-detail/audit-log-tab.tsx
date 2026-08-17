import { ClockCounterClockwiseIcon } from '@phosphor-icons/react'
import { Card } from '../../../../components/ui/card'
import { formatDateTime } from '../../lib/format'
import type { AuditLogEntry } from '../../types/payroll-types'

export function AuditLogTab({ entries }: { entries: AuditLogEntry[] }) {
  return (
    <Card>
      <ul className="space-y-4">
        {entries.map((entry) => (
          <li key={entry.id} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-2">
              <ClockCounterClockwiseIcon className="h-3.5 w-3.5 text-ink" />
            </span>
            <div>
              <p className="text-sm text-ink">
                <span className="font-medium">{entry.actor}</span> · {entry.action}
              </p>
              <p className="mt-0.5 text-xs text-muted">{formatDateTime(entry.timestamp)}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
