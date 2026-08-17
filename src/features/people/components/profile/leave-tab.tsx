import { Badge } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import { formatDate } from '../../lib/format'
import { REQUEST_STATUS_META } from '../../lib/status-meta'
import type { EmployeeDetail } from '../../types/people-types'

export function LeaveTab({ employee }: { employee: EmployeeDetail }) {
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader title="Leave balance" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {employee.leaveBalance.map((entry) => {
            const remaining = entry.totalDays - entry.usedDays
            const percentUsed = Math.round((entry.usedDays / entry.totalDays) * 100)
            return (
              <div key={entry.type} className="rounded-lg border border-line bg-canvas p-3">
                <p className="text-sm font-medium text-ink">{entry.type}</p>
                <p className="mt-1 text-xl font-medium text-ink">
                  {remaining}
                  <span className="text-sm font-normal text-muted"> / {entry.totalDays} days left</span>
                </p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-pill bg-surface-2">
                  <div className="h-full rounded-pill bg-accent" style={{ width: `${percentUsed}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <Card>
        <CardHeader title="Leave requests" />
        {employee.leaveRequests.length > 0 ? (
          <div className="overflow-x-auto rounded-panel border border-line">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Dates</th>
                  <th className="px-4 py-3 font-medium">Days</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {employee.leaveRequests.map((request) => {
                  const statusMeta = REQUEST_STATUS_META[request.status]
                  return (
                    <tr key={request.id}>
                      <td className="px-4 py-3 text-ink">{request.type}</td>
                      <td className="px-4 py-3 text-muted">
                        {formatDate(request.startDate)} – {formatDate(request.endDate)}
                      </td>
                      <td className="px-4 py-3 text-ink">{request.days}</td>
                      <td className="px-4 py-3">
                        <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted">No leave requests on record.</p>
        )}
      </Card>
    </div>
  )
}
