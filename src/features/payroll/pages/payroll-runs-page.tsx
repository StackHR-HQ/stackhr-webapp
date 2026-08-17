import { useMemo, useState } from 'react'
import { RunStatusTabs, type RunStatusFilter } from '../components/runs/run-status-tabs'
import { RunsTable } from '../components/runs/runs-table'
import { usePayrollRuns } from '../hooks/use-payroll-runs'

export function PayrollRunsPage() {
  const { data: runs, isPending, isError, refetch } = usePayrollRuns()
  const [statusFilter, setStatusFilter] = useState<RunStatusFilter>('all')

  const counts = useMemo(() => {
    const base: Record<RunStatusFilter, number> = {
      all: runs?.length ?? 0,
      draft: 0,
      processing: 0,
      pending_approval: 0,
      approved: 0,
      completed: 0,
      failed: 0,
    }
    for (const run of runs ?? []) {
      base[run.status] += 1
    }
    return base
  }, [runs])

  const filteredRuns = useMemo(() => {
    if (!runs) return []
    if (statusFilter === 'all') return runs
    return runs.filter((run) => run.status === statusFilter)
  }, [runs, statusFilter])

  return (
    <div className="max-w-[1400px] space-y-5">
      <div>
        <h1 className="text-xl font-medium text-ink">Payroll Runs</h1>
        <p className="mt-1 text-sm text-muted">Every payroll run, from draft through disbursement.</p>
      </div>

      {isError ? (
        <div className="rounded-panel border border-line bg-surface p-6 text-center shadow-panel">
          <p className="text-sm font-medium text-ink">Couldn't load payroll runs</p>
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
          <RunStatusTabs active={statusFilter} counts={counts} onChange={setStatusFilter} />

          {isPending ? (
            <div className="h-64 animate-pulse rounded-panel border border-line bg-surface" />
          ) : (
            <RunsTable runs={filteredRuns} />
          )}
        </div>
      )}
    </div>
  )
}
