import { useMemo, useState } from 'react'
import { USE_MOCK_SPEND } from '../../../lib/env'
import { getApiErrorMessage } from '../../../lib/http'
import { notify } from '../../../lib/toast'
import { useDecideApproval } from '../../approvals/hooks/use-decide-approval'
import { AdvanceStatusTabs, type AdvanceStatusFilter } from '../components/advances/advance-status-tabs'
import { AdvancesTable } from '../components/advances/advances-table'
import { useSalaryAdvances } from '../hooks/use-salary-advances'
import type { SalaryAdvanceStatusEntry } from '../types/payroll-types'

export function SalaryAdvancesPage() {
  const { data, isPending, isError, refetch } = useSalaryAdvances()
  const [statusFilter, setStatusFilter] = useState<AdvanceStatusFilter>('all')
  // Mock data has no approval records, so decisions there only change local state.
  const [overrides, setOverrides] = useState<Partial<Record<string, SalaryAdvanceStatusEntry['status']>>>({})
  const decideApproval = useDecideApproval()

  const advances = useMemo(
    () => (data ?? []).map((advance) => ({ ...advance, status: overrides[advance.id] ?? advance.status })),
    [data, overrides],
  )

  const counts = useMemo(() => {
    const base: Record<AdvanceStatusFilter, number> = { all: advances.length, pending: 0, approved: 0, rejected: 0, disbursed: 0 }
    for (const advance of advances) {
      if (advance.status in base) {
        base[advance.status as AdvanceStatusFilter] += 1
      }
    }
    return base
  }, [advances])

  const filteredAdvances = statusFilter === 'all' ? advances : advances.filter((advance) => advance.status === statusFilter)

  function setStatus(id: string, status: SalaryAdvanceStatusEntry['status']) {
    setOverrides((prev) => ({ ...prev, [id]: status }))
  }

  async function decide(id: string, status: 'approved' | 'rejected') {
    const approvalId = advances.find((advance) => advance.id === id)?.approvalId
    if (!approvalId) {
      setStatus(id, status)
      return
    }
    try {
      await decideApproval.mutateAsync({ id: approvalId, status: status === 'approved' ? 'APPROVED' : 'REJECTED' })
      notify.success(status === 'approved' ? 'Salary advance approved' : 'Salary advance rejected')
    } catch (err) {
      notify.error("Couldn't record the decision", getApiErrorMessage(err))
    }
  }

  return (
    <div className="max-w-[1400px] space-y-5">
      <div>
        <h1 className="text-xl font-medium text-ink">Salary Advances</h1>
        <p className="mt-1 text-sm text-muted">Review, approve, and track salary advance requests.</p>
      </div>

      {isError ? (
        <div className="rounded-panel border border-line bg-surface p-6 text-center shadow-panel">
          <p className="text-sm font-medium text-ink">Couldn't load salary advances</p>
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
          <AdvanceStatusTabs active={statusFilter} counts={counts} onChange={setStatusFilter} />

          {isPending ? (
            <div className="h-64 animate-pulse rounded-panel border border-line bg-surface" />
          ) : (
            <AdvancesTable
              advances={filteredAdvances}
              onApprove={(id) => decide(id, 'approved')}
              onReject={(id) => decide(id, 'rejected')}
              // The backend has no disbursement endpoint yet.
              onDisburse={USE_MOCK_SPEND ? (id) => setStatus(id, 'disbursed') : undefined}
              deciding={decideApproval.isPending}
            />
          )}
        </div>
      )}
    </div>
  )
}
