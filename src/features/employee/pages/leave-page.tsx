import { useState } from 'react'
import { Badge, type BadgeTone } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { Card } from '../../../components/ui/card'
import { Modal } from '../../../components/ui/modal'
import { getApiErrorMessage } from '../../../lib/http'
import { notify } from '../../../lib/toast'
import { formatDate } from '../../dashboard/lib/format'
import { RequestLeaveForm } from '../components/request-leave-form'
import { useCancelLeaveRequest, useLeaveTypeOptions, useMyLeaveBalances, useMyLeaveRequests } from '../hooks/use-my-leave'
import type { MyLeaveRequest } from '../types/employee-types'

const STATUS_META: Record<string, { label: string; tone: BadgeTone }> = {
  PENDING: { label: 'Pending', tone: 'warning' },
  APPROVED: { label: 'Approved', tone: 'positive' },
  REJECTED: { label: 'Rejected', tone: 'critical' },
  CANCELLED: { label: 'Cancelled', tone: 'neutral' },
}

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`

export function MyLeavePage() {
  const [requesting, setRequesting] = useState(false)
  const [cancelling, setCancelling] = useState<MyLeaveRequest | null>(null)
  const cancelLeave = useCancelLeaveRequest()

  const confirmCancel = async () => {
    if (!cancelling) return
    try {
      await cancelLeave.mutateAsync(cancelling.id)
      notify.success('Leave request cancelled')
      setCancelling(null)
    } catch (err) {
      notify.error("Couldn't cancel the request", getApiErrorMessage(err))
    }
  }
  const balances = useMyLeaveBalances()
  const requests = useMyLeaveRequests()
  const leaveTypes = useLeaveTypeOptions()
  const noLeaveTypes = leaveTypes.isSuccess && leaveTypes.data.length === 0

  return (
    <div className="max-w-[1400px] space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium text-ink">My Leave</h1>
          <p className="mt-1 text-sm text-muted">Check your balance and request time off.</p>
        </div>
        <div className="shrink-0">
          <Button
            type="button"
            onClick={() => setRequesting(true)}
            disabled={!leaveTypes.isSuccess || noLeaveTypes}
            className="w-auto px-4"
          >
            Request leave
          </Button>
        </div>
      </div>

      {noLeaveTypes ? (
        <p className="rounded-lg border border-line bg-surface px-4 py-3 text-sm text-muted">
          Your organization hasn&apos;t set up any leave types yet, so you can&apos;t request leave. Ask your administrator.
        </p>
      ) : null}

      <Modal open={requesting} onClose={() => setRequesting(false)} title="Request leave">
        <RequestLeaveForm
          leaveTypes={leaveTypes.data ?? []}
          onDone={() => setRequesting(false)}
          onCancel={() => setRequesting(false)}
        />
      </Modal>

      <Modal open={cancelling !== null} onClose={() => setCancelling(null)} title="Cancel leave request">
        {cancelling ? (
          <div className="space-y-5">
            <p className="text-sm text-muted">
              Cancel your {cancelling.leaveType?.name ?? 'leave'} request for {formatDate(cancelling.startDate)} –{' '}
              {formatDate(cancelling.endDate)}? You can submit a new request later.
            </p>
            <div className="flex gap-3">
              <Button type="button" variant="secondary" width="fit" className="px-6" onClick={() => setCancelling(null)}>
                Keep request
              </Button>
              <Button type="button" width="fit" className="px-6" loading={cancelLeave.isPending} onClick={confirmCancel}>
                Cancel request
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-ink">Balances</h2>
        {balances.isPending ? (
          <div className="h-28 animate-pulse rounded-panel border border-line bg-surface" />
        ) : balances.isError ? (
          <p className="text-sm text-muted">Couldn&apos;t load your balances right now.</p>
        ) : balances.data.length === 0 ? (
          <Card>
            <p className="py-4 text-center text-sm text-muted">No leave allowance has been set up for you yet.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {balances.data.map((balance, index) => (
              <Card key={balance.leaveType?.id ?? index}>
                <p className="text-sm font-medium text-ink">{balance.leaveType?.name ?? 'Leave'}</p>
                <p className="mt-2 text-2xl font-medium text-ink">
                  {balance.remainingDays}
                  <span className="text-sm font-normal text-muted"> of {balance.allocatedDays} days left</span>
                </p>
                <p className="mt-1 text-xs text-muted">
                  {plural(balance.usedDays, 'day')} used
                  {balance.upcomingDays ? ` · ${plural(balance.upcomingDays, 'day')} upcoming` : ''}
                  {balance.pendingDays ? ` · ${plural(balance.pendingDays, 'day')} pending` : ''}
                </p>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-ink">My requests</h2>
        {requests.isPending ? (
          <div className="h-40 animate-pulse rounded-panel border border-line bg-surface" />
        ) : requests.isError ? (
          <p className="text-sm text-muted">Couldn&apos;t load your requests right now.</p>
        ) : requests.data.length === 0 ? (
          <Card>
            <p className="py-4 text-center text-sm text-muted">You haven&apos;t requested any leave yet.</p>
          </Card>
        ) : (
          <Card>
            <ul className="divide-y divide-line">
              {requests.data.map((request) => {
                const status = STATUS_META[request.status] ?? { label: request.status, tone: 'neutral' as const }
                return (
                  <li key={request.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">{request.leaveType?.name ?? 'Leave'}</p>
                      <p className="text-xs text-muted">
                        {formatDate(request.startDate)} – {formatDate(request.endDate)} · {plural(request.totalDays, 'day')}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      {request.status === 'PENDING' ? (
                        <button
                          type="button"
                          onClick={() => setCancelling(request)}
                          className="text-xs font-medium text-muted hover:text-critical"
                        >
                          Cancel
                        </button>
                      ) : null}
                      <Badge tone={status.tone}>{status.label}</Badge>
                    </div>
                  </li>
                )
              })}
            </ul>
          </Card>
        )}
      </section>
    </div>
  )
}
