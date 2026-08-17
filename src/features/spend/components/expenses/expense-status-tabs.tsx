import type { ExpenseStatus } from '../../types/spend-types'

export type ExpenseFilter = 'all' | 'mine' | ExpenseStatus

const TABS: { key: ExpenseFilter; label: string }[] = [
  { key: 'all', label: 'All Expenses' },
  { key: 'mine', label: 'My Expenses' },
  { key: 'pending', label: 'Pending Approval' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'reimbursed', label: 'Reimbursed' },
]

export function ExpenseStatusTabs({
  active,
  counts,
  onChange,
}: {
  active: ExpenseFilter
  counts: Record<ExpenseFilter, number>
  onChange: (key: ExpenseFilter) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 border-b border-line pb-3">
      {TABS.map((tab) => {
        const isActive = tab.key === active
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors ${
              isActive ? 'bg-surface-2 text-ink' : 'text-muted hover:bg-surface-2 hover:text-ink'
            }`}
          >
            {tab.label}
            <span className={`rounded-pill px-1.5 py-0.5 text-[10px] ${isActive ? 'bg-canvas' : 'bg-surface-2'}`}>
              {counts[tab.key]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
