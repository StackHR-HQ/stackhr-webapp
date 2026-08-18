import { useMemo, useState } from 'react'
import { Pagination } from '../../../components/ui/pagination'
import { useAuthStore } from '../../auth/store/auth-store'
import { ApprovalDomainTabs, type ApprovalTabKey } from '../components/approval-domain-tabs'
import { ApprovalHistoryTable } from '../components/approval-history-table'
import { ApprovalsQueueTable } from '../components/approvals-queue-table'
import { useGlobalApprovals } from '../hooks/use-global-approvals'
import type { GlobalApprovalItem, GlobalApprovalStatus } from '../types/approval-types'

const HISTORY_PAGE_SIZE = 20

export function GlobalApprovalsPage() {
  const { data: approvals, isPending, isError, refetch } = useGlobalApprovals()
  const [activeTab, setActiveTab] = useState<ApprovalTabKey>('all')
  const [historyPage, setHistoryPage] = useState(1)
  const [decisions, setDecisions] = useState<Partial<Record<string, GlobalApprovalStatus>>>({})
  const approverName = useAuthStore((state) => state.user?.name) ?? 'You'

  function changeTab(tab: ApprovalTabKey) {
    setActiveTab(tab)
    setHistoryPage(1)
  }

  const items = useMemo(() => {
    return approvals.map((item) => {
      const decision = decisions[`${item.domain}-${item.id}`]
      if (!decision) return item
      return { ...item, status: decision, decidedBy: approverName, decidedAt: new Date().toISOString() }
    })
  }, [approvals, decisions, approverName])

  function decide(item: GlobalApprovalItem, status: 'approved' | 'rejected') {
    setDecisions((prev) => ({ ...prev, [`${item.domain}-${item.id}`]: status }))
  }

  const counts = useMemo(() => {
    const base: Record<ApprovalTabKey, number> = {
      all: 0,
      leave: 0,
      expenses: 0,
      reimbursements: 0,
      'salary-advances': 0,
      payroll: 0,
      history: 0,
    }
    for (const item of items) {
      if (item.status === 'pending') {
        base.all += 1
        base[item.domain] += 1
      } else {
        base.history += 1
      }
    }
    return base
  }, [items])

  const visibleItems = useMemo(() => {
    const pending = items.filter((item) => item.status === 'pending')
    if (activeTab === 'all' || activeTab === 'history') return pending
    return pending.filter((item) => item.domain === activeTab)
  }, [items, activeTab])

  const historyItems = useMemo(() => {
    return items
      .filter((item) => item.status !== 'pending')
      .sort((a, b) => new Date(b.decidedAt ?? b.submittedAt).getTime() - new Date(a.decidedAt ?? a.submittedAt).getTime())
  }, [items])

  const totalHistoryPages = Math.max(1, Math.ceil(historyItems.length / HISTORY_PAGE_SIZE))
  const clampedHistoryPage = Math.min(historyPage, totalHistoryPages)
  const paginatedHistoryItems = useMemo(() => {
    const start = (clampedHistoryPage - 1) * HISTORY_PAGE_SIZE
    return historyItems.slice(start, start + HISTORY_PAGE_SIZE)
  }, [historyItems, clampedHistoryPage])

  return (
    <div className="max-w-[1400px] space-y-5">
      <div>
        <h1 className="text-xl font-medium text-ink">Approvals</h1>
        <p className="mt-1 text-sm text-muted">
          Every request waiting on you — leave, expenses, reimbursements, salary advances, and payroll — in one place.
        </p>
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
          <ApprovalDomainTabs active={activeTab} counts={counts} onChange={changeTab} />

          {isPending ? (
            <div className="h-64 animate-pulse rounded-panel border border-line bg-surface" />
          ) : activeTab === 'history' ? (
            <div className="space-y-3">
              <ApprovalHistoryTable items={paginatedHistoryItems} />
              <Pagination
                page={clampedHistoryPage}
                pageSize={HISTORY_PAGE_SIZE}
                totalItems={historyItems.length}
                onChange={setHistoryPage}
              />
            </div>
          ) : (
            <ApprovalsQueueTable
              items={visibleItems}
              showDomain={activeTab === 'all'}
              onApprove={(item) => decide(item, 'approved')}
              onReject={(item) => decide(item, 'rejected')}
            />
          )}
        </div>
      )}
    </div>
  )
}
