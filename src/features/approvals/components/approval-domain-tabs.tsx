import { ListChecksIcon, ClockCounterClockwiseIcon } from '@phosphor-icons/react'
import { APPROVAL_DOMAIN_META } from '../lib/status-meta'
import type { ApprovalDomain } from '../types/approval-types'

export type ApprovalTabKey = 'all' | ApprovalDomain | 'history'

const DOMAIN_ORDER: ApprovalDomain[] = ['leave', 'expenses', 'reimbursements', 'salary-advances', 'payroll']

export function ApprovalDomainTabs({
  active,
  counts,
  onChange,
}: {
  active: ApprovalTabKey
  counts: Record<ApprovalTabKey, number>
  onChange: (key: ApprovalTabKey) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 border-b border-line pb-3">
      <TabButton tabKey="all" label="All" icon={ListChecksIcon} isActive={active === 'all'} count={counts.all} onChange={onChange} />
      {DOMAIN_ORDER.map((domain) => {
        const meta = APPROVAL_DOMAIN_META[domain]
        return (
          <TabButton
            key={domain}
            tabKey={domain}
            label={meta.label}
            icon={meta.icon}
            isActive={active === domain}
            count={counts[domain]}
            onChange={onChange}
          />
        )
      })}
      <TabButton
        tabKey="history"
        label="Approval History"
        icon={ClockCounterClockwiseIcon}
        isActive={active === 'history'}
        count={counts.history}
        onChange={onChange}
      />
    </div>
  )
}

function TabButton({
  tabKey,
  label,
  icon: TabIcon,
  isActive,
  count,
  onChange,
}: {
  tabKey: ApprovalTabKey
  label: string
  icon: typeof ListChecksIcon
  isActive: boolean
  count: number
  onChange: (key: ApprovalTabKey) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(tabKey)}
      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors ${
        isActive ? 'bg-surface-2 text-ink' : 'text-muted hover:bg-surface-2 hover:text-ink'
      }`}
    >
      <TabIcon className="h-3.5 w-3.5" />
      {label}
      <span className={`rounded-pill px-1.5 py-0.5 text-[10px] ${isActive ? 'bg-canvas' : 'bg-surface-2'}`}>{count}</span>
    </button>
  )
}
