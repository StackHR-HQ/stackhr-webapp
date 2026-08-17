import type { EmploymentStatus } from '../../types/people-types'

export type EmployeeStatusFilter = 'all' | EmploymentStatus

const TABS: { key: EmployeeStatusFilter; label: string }[] = [
  { key: 'all', label: 'All employees' },
  { key: 'active', label: 'Active' },
  { key: 'pending_invitation', label: 'Pending invitations' },
  { key: 'onboarding', label: 'Onboarding' },
]

export function EmployeeStatusTabs({
  active,
  counts,
  onChange,
}: {
  active: EmployeeStatusFilter
  counts: Record<EmployeeStatusFilter, number>
  onChange: (key: EmployeeStatusFilter) => void
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

      <span
        title="Offboarding tracking is coming soon"
        className="ml-auto flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted opacity-60"
      >
        Offboarding
        <span className="rounded-pill bg-surface-2 px-1.5 py-0.5 text-[10px]">Soon</span>
      </span>
    </div>
  )
}
