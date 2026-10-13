import { useMemo, useState } from 'react'
import { getApiErrorMessage } from '../../../lib/http'
import { notify } from '../../../lib/toast'
import { useDecideApproval } from '../../approvals/hooks/use-decide-approval'
import { ApprovalStatusTabs, type ApprovalFilter } from '../components/approvals/approval-status-tabs'
import { ApprovalsTable } from '../components/approvals/approvals-table'
import { useSpendApprovals } from '../hooks/use-spend-approvals'
import type { SpendApprovalStatus } from '../types/spend-types'

// Spend-scoped approval queue — distinct from the global Approvals page in
// features/dashboard/.
export function SpendApprovalsPage() {
  const { data: approvals, isPending, isError, refetch } = useSpendApprovals()
  const [filter, setFilter] = useState<ApprovalFilter>('pending')
  const decideApproval = useDecideApproval()
  const requests = useMemo(() => approvals ?? [], [approvals])

  async function decide(id: string, status: Exclude<SpendApprovalStatus, 'pending'>) {
    try {
      await decideApproval.mutateAsync({ id, status: status === 'approved' ? 'APPROVED' : 'REJECTED' })
      notify.success(status === 'approved' ? 'Expense claim approved' : 'Expense claim rejected')
    } catch (err) {
      notify.error("Couldn't record the decision", getApiErrorMessage(err))
    }
  }

  const counts = useMemo(() => {
    const base: Record<ApprovalFilter, number> = { pending: 0, approved: 0, rejected: 0, history: 0 }
    for (const request of requests) {
      if (request.status === 'pending') base.pending += 1
      else {
        base[request.status] += 1
        base.history += 1
      }
    }
    return base
  }, [requests])

  const filteredRequests = useMemo(() => {
    if (filter === 'pending') return requests.filter((request) => request.status === 'pending')
    if (filter === 'history') {
      return requests
        .filter((request) => request.status !== 'pending')
        .sort((a, b) => new Date(b.decidedAt ?? 0).getTime() - new Date(a.decidedAt ?? 0).getTime())
    }
    return requests.filter((request) => request.status === filter)
  }, [requests, filter])

  return (
    <div className="max-w-[1400px] space-y-5">
      <div>
        <h1 className="text-xl font-medium text-ink">Spending Approvals</h1>
        <p className="mt-1 text-sm text-muted">Review and decide on expense claims awaiting approval.</p>
      </div>

      {isError ? (
        <div className="rounded-panel border border-line bg-surface p-6 text-center shadow-panel">
          <p className="text-sm font-medium text-ink">Couldn't load approvals</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-ink hover:opacity-90"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <ApprovalStatusTabs active={filter} counts={counts} onChange={setFilter} />

          {isPending ? (
            <div className="h-64 animate-pulse rounded-panel border border-line bg-surface" />
          ) : (
            <ApprovalsTable
              requests={filteredRequests}
              onApprove={filter === 'pending' ? (id) => decide(id, 'approved') : undefined}
              onReject={filter === 'pending' ? (id) => decide(id, 'rejected') : undefined}
              deciding={decideApproval.isPending}
            />
          )}
        </div>
      )}
    </div>
  )
}
