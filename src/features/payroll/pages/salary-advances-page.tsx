import { useMemo, useState } from 'react'
import { AdvanceStatusTabs, type AdvanceStatusFilter } from '../components/advances/advance-status-tabs'
import { AdvancesTable } from '../components/advances/advances-table'
import { useSalaryAdvances } from '../hooks/use-salary-advances'
import type { SalaryAdvanceStatusEntry } from '../types/payroll-types'

export function SalaryAdvancesPage() {
  const { data, isPending, isError, refetch } = useSalaryAdvances()
  const [statusFilter, setStatusFilter] = useState<AdvanceStatusFilter>('all')
  const [overrides, setOverrides] = useState<Partial<Record<string, SalaryAdvanceStatusEntry['status']>>>({})

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
              onApprove={(id) => setStatus(id, 'approved')}
              onReject={(id) => setStatus(id, 'rejected')}
              onDisburse={(id) => setStatus(id, 'disbursed')}
            />
          )}
        </div>
      )}
    </div>
  )
}
