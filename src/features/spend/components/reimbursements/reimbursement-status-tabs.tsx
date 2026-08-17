import type { ReimbursementStatus } from '../../types/spend-types'

const TABS: { key: ReimbursementStatus; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'processing', label: 'Processing' },
  { key: 'completed', label: 'Completed' },
  { key: 'failed', label: 'Failed' },
]

export function ReimbursementStatusTabs({
  active,
  counts,
  onChange,
}: {
  active: ReimbursementStatus
  counts: Record<ReimbursementStatus, number>
  onChange: (key: ReimbursementStatus) => void
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
