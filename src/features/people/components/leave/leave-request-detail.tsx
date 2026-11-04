import { useQuery } from '@tanstack/react-query'
import { getApiErrorMessage } from '../../../../lib/http'
import { peopleApi } from '../../api/people-api'
import { formatDate } from '../../lib/format'

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink">{value}</dd>
    </div>
  )
}

// The employee's reason and the request's timeline, which the list doesn't carry.
export function LeaveRequestDetailView({ id }: { id: string }) {
  const request = useQuery({ queryKey: ['people', 'leave-requests', id], queryFn: () => peopleApi.getLeaveRequest(id) })

  if (request.isPending) return <div className="h-48 animate-pulse rounded-lg bg-canvas" />
  if (request.isError) {
    return <p className="text-sm text-muted">Couldn&apos;t load this request: {getApiErrorMessage(request.error)}</p>
  }

  const detail = request.data
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-line bg-canvas px-3 py-2.5">
        <p className="text-xs text-muted">Reason</p>
        <p className="mt-0.5 whitespace-pre-line text-sm text-ink">{detail.reason ?? 'No reason given.'}</p>
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
        <Field
          label="Leave type"
          value={detail.paid == null ? detail.leaveType : `${detail.leaveType} (${detail.paid ? 'paid' : 'unpaid'})`}
        />
        <Field label="Days" value={String(detail.days)} />
        <Field label="From" value={formatDate(detail.startDate)} />
        <Field label="To" value={formatDate(detail.endDate)} />
        <Field label="Requested" value={formatDate(detail.submittedAt)} />
        <Field label="Decided" value={detail.decidedAt ? formatDate(detail.decidedAt) : 'Not yet'} />
      </dl>
    </div>
  )
}
