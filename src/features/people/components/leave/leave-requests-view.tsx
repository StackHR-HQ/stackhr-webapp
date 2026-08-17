import { CheckIcon, XIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link } from 'react-router'
import { Avatar } from '../../../../components/ui/avatar'
import { Badge } from '../../../../components/ui/badge'
import { Card } from '../../../../components/ui/card'
import { formatDate } from '../../lib/format'
import { REQUEST_STATUS_META } from '../../lib/status-meta'
import type { LeaveRequestWithEmployee } from '../../types/people-types'

export function LeaveRequestsView({ requests }: { requests: LeaveRequestWithEmployee[] }) {
  const [resolvedIds, setResolvedIds] = useState<Partial<Record<string, 'approved' | 'rejected'>>>({})

  const visible = requests.map((request) => ({
    ...request,
    status: resolvedIds[request.id] ?? request.status,
  }))

  function resolve(id: string, status: 'approved' | 'rejected') {
    setResolvedIds((prev) => ({ ...prev, [id]: status }))
  }

  if (visible.length === 0) {
    return (
      <Card>
        <p className="text-sm text-muted">No leave requests on record.</p>
      </Card>
    )
  }

  return (
    <div className="overflow-x-auto rounded-panel border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Employee</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Dates</th>
            <th className="px-4 py-3 font-medium">Days</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {visible.map((request) => {
            const statusMeta = REQUEST_STATUS_META[request.status]
            const isPending = request.status === 'pending'
            return (
              <tr key={request.id} className="bg-canvas">
                <td className="px-4 py-3">
                  <Link to={`/people/employees/${request.employeeId}`} className="flex items-center gap-2.5 hover:underline">
                    <Avatar initials={request.avatarInitials} size="sm" />
                    <span className="font-medium text-ink">{request.employeeName}</span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink">{request.type}</td>
                <td className="px-4 py-3 text-muted">
                  {formatDate(request.startDate)} – {formatDate(request.endDate)}
                </td>
                <td className="px-4 py-3 text-ink">{request.days}</td>
                <td className="px-4 py-3">
                  <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
                </td>
                <td className="px-4 py-3">
                  {isPending ? (
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => resolve(request.id, 'rejected')}
                        aria-label={`Reject leave request from ${request.employeeName}`}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-critical hover:text-critical"
                      >
                        <XIcon className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => resolve(request.id, 'approved')}
                        aria-label={`Approve leave request from ${request.employeeName}`}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-ink transition-opacity hover:opacity-90"
                      >
                        <CheckIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : null}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
