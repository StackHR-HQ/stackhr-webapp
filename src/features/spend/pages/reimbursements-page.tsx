import { useMemo, useState } from 'react'
import { Button } from '../../../components/ui/button'
import { Modal } from '../../../components/ui/modal'
import { getApiErrorMessage } from '../../../lib/http'
import { notify } from '../../../lib/toast'
import { useAuthStore } from '../../auth/store/auth-store'
import { ReimbursementStatusTabs } from '../components/reimbursements/reimbursement-status-tabs'
import { ReimbursementSummaryTiles } from '../components/reimbursements/reimbursement-summary-tiles'
import { ReimbursementsTable } from '../components/reimbursements/reimbursements-table'
import { useMarkReimbursementPaid, useReimbursements } from '../hooks/use-reimbursements'
import { formatAmount } from '../lib/format'
import type { Reimbursement, ReimbursementStatus, ReimbursementSummary } from '../types/spend-types'

export function ReimbursementsPage() {
  const { data: reimbursements, isPending, isError, refetch } = useReimbursements()
  const markPaid = useMarkReimbursementPaid()
  const canPay = useAuthStore((state) => state.user?.role === 'admin')
  const [statusFilter, setStatusFilter] = useState<ReimbursementStatus>('pending')
  const [paying, setPaying] = useState<Reimbursement | null>(null)

  const counts = useMemo(() => {
    const base: Record<ReimbursementStatus, number> = {
      pending: 0,
      approved: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      rejected: 0,
      cancelled: 0,
    }
    for (const reimbursement of reimbursements ?? []) {
      base[reimbursement.status] += 1
    }
    return base
  }, [reimbursements])

  const summary = useMemo<ReimbursementSummary | undefined>(() => {
    if (!reimbursements) return undefined
    const totals = (statuses: ReimbursementStatus[]) => {
      const matching = reimbursements.filter((reimbursement) => statuses.includes(reimbursement.status))
      const byCurrency = new Map<string, number>()
      for (const reimbursement of matching) {
        const currency = reimbursement.currency || 'NGN'
        byCurrency.set(currency, (byCurrency.get(currency) ?? 0) + reimbursement.amount)
      }
      return {
        count: matching.length,
        amounts: [...byCurrency].map(([currency, amount]) => ({ currency, amount })),
      }
    }
    return { pending: totals(['pending']), approved: totals(['approved', 'processing']), paid: totals(['completed']) }
  }, [reimbursements])

  const filteredReimbursements = useMemo(
    () => (reimbursements ?? []).filter((reimbursement) => reimbursement.status === statusFilter),
    [reimbursements, statusFilter],
  )

  const confirmPay = async () => {
    if (!paying) return
    try {
      await markPaid.mutateAsync(paying.id)
      notify.success(`Reimbursement paid to ${paying.employeeName}`)
      setPaying(null)
    } catch (err) {
      notify.error("Couldn't pay the reimbursement", getApiErrorMessage(err))
    }
  }

  return (
    <div className="max-w-[1400px] space-y-5">
      <div>
        <h1 className="text-xl font-medium text-ink">Reimbursements</h1>
        <p className="mt-1 text-sm text-muted">Pay employees back for approved expenses and claims.</p>
      </div>

      {summary ? <ReimbursementSummaryTiles summary={summary} /> : null}

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
            <ReimbursementsTable reimbursements={filteredReimbursements} onMarkPaid={canPay ? setPaying : undefined} />
          )}
        </div>
      )}

      <Modal open={paying !== null} onClose={() => setPaying(null)} title="Pay reimbursement">
        {paying ? (
          <div className="space-y-5">
            <p className="text-sm text-muted">
              Pay <span className="font-medium text-ink">{formatAmount(paying.amount, paying.currency)}</span> to{' '}
              {paying.employeeName}? If your organization&apos;s deposit account is set up, the money is sent to their
              bank account straight away. This can&apos;t be undone.
            </p>
            <div className="flex gap-3">
              <Button type="button" variant="secondary" width="fit" className="px-6" onClick={() => setPaying(null)}>
                Cancel
              </Button>
              <Button type="button" width="fit" className="px-6" loading={markPaid.isPending} onClick={confirmPay}>
                Pay now
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
