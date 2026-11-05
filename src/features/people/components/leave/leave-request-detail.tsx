import { useQuery } from '@tanstack/react-query'
import { Badge } from '../../../../components/ui/badge'
import { getApiErrorMessage } from '../../../../lib/http'
import { peopleApi } from '../../api/people-api'
import { formatDate } from '../../lib/format'
import { REQUEST_STATUS_META } from '../../lib/status-meta'
import type { LeaveRequestWithEmployee } from '../../types/people-types'

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink">{value}</dd>
    </div>
  )
}

// The list row's details plus what only GET /leave/requests/:id carries: the
// employee's reason and the request's timeline. If that read is refused, the
// list's details still show.
export function LeaveRequestDetailView({ request }: { request: LeaveRequestWithEmployee }) {
  // Under the list's key, so a decision (which refreshes the list) refreshes this too.
  const detail = useQuery({
    queryKey: ['people', 'leave', 'requests', request.id],
    queryFn: () => peopleApi.getLeaveRequest(request.id),
    retry: false,
  })

  if (detail.isPending) return <div className="h-48 animate-pulse rounded-lg bg-canvas" />

  const data = detail.data
  const status = REQUEST_STATUS_META[data?.status ?? request.status] ?? {
    label: data?.status ?? request.status,
    tone: 'neutral' as const,
  }
  const leaveType = data?.leaveType ?? request.type

  return (
    <div className="space-y-4">
      <Badge tone={status.tone}>{status.label}</Badge>
      <div className="rounded-lg border border-line bg-canvas px-3 py-2.5">
        <p className="text-xs text-muted">Reason</p>
        {data ? (
          <p className="mt-0.5 whitespace-pre-line text-sm text-ink">{data.reason ?? 'No reason given.'}</p>
        ) : (
          <p className="mt-0.5 text-sm text-muted">
            Couldn&apos;t load the reason: {getApiErrorMessage(detail.error)}{' '}
            <button type="button" onClick={() => detail.refetch()} className="font-medium text-accent hover:underline">
              Try again
            </button>
          </p>
        )}
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
        <Field
          label="Leave type"
          value={data?.paid == null ? leaveType : `${leaveType} (${data.paid ? 'paid' : 'unpaid'})`}
        />
        <Field label="Days" value={String(data?.days ?? request.days)} />
        <Field label="From" value={formatDate(data?.startDate ?? request.startDate)} />
        <Field label="To" value={formatDate(data?.endDate ?? request.endDate)} />
        {data ? (
          <>
            <Field label="Requested" value={formatDate(data.submittedAt)} />
            <Field label="Decided" value={data.decidedAt ? formatDate(data.decidedAt) : 'Not yet'} />
          </>
        ) : null}
      </dl>
    </div>
  )
}
