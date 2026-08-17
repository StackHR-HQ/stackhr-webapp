import { useMemo, useState } from 'react'
import { ReimbursementStatusTabs } from '../components/reimbursements/reimbursement-status-tabs'
import { ReimbursementsTable } from '../components/reimbursements/reimbursements-table'
import { useReimbursements } from '../hooks/use-reimbursements'
import type { ReimbursementStatus } from '../types/spend-types'

export function ReimbursementsPage() {
  const { data: reimbursements, isPending, isError, refetch } = useReimbursements()
  const [statusFilter, setStatusFilter] = useState<ReimbursementStatus>('pending')

  const counts = useMemo(() => {
    const base: Record<ReimbursementStatus, number> = {
      pending: 0,
      approved: 0,
      processing: 0,
      completed: 0,
      failed: 0,
    }
    for (const reimbursement of reimbursements ?? []) {
      base[reimbursement.status] += 1
    }
    return base
  }, [reimbursements])

  const filteredReimbursements = useMemo(
    () => (reimbursements ?? []).filter((reimbursement) => reimbursement.status === statusFilter),
    [reimbursements, statusFilter],
  )

  return (
    <div className="max-w-[1400px] space-y-5">
      <div>
        <h1 className="text-xl font-medium text-ink">Reimbursements</h1>
        <p className="mt-1 text-sm text-muted">Track payouts for approved expense claims through to completion.</p>
      </div>

      {isError ? (
        <div className="rounded-panel border border-line bg-surface p-6 text-center shadow-panel">
          <p className="text-sm font-medium text-ink">Couldn't load reimbursements</p>
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
          <ReimbursementStatusTabs active={statusFilter} counts={counts} onChange={setStatusFilter} />

          {isPending ? (
            <div className="h-64 animate-pulse rounded-panel border border-line bg-surface" />
          ) : (
            <ReimbursementsTable reimbursements={filteredReimbursements} />
          )}
        </div>
      )}
    </div>
  )
}
