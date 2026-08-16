import {
  CalendarBlankIcon,
  CheckIcon,
  HandCoinsIcon,
  IdentificationCardIcon,
  ReceiptIcon,
  ArrowUUpLeftIcon,
  XIcon,
  type Icon,
} from '@phosphor-icons/react'
import { useState } from 'react'
import { Link } from 'react-router'
import { Card, CardHeader } from '../../../../components/ui/card'
import { formatAmount, formatRelativeTime } from '../../lib/format'
import type { ApprovalCategory, ApprovalCategoryKey } from '../../types/dashboard-types'

const CATEGORY_ICONS: Record<ApprovalCategoryKey, Icon> = {
  'employee-changes': IdentificationCardIcon,
  leave: CalendarBlankIcon,
  expenses: ReceiptIcon,
  reimbursements: ArrowUUpLeftIcon,
  'salary-advances': HandCoinsIcon,
}

export function PendingApprovalsCard({ categories }: { categories: ApprovalCategory[] }) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())
  const [activeKey, setActiveKey] = useState<ApprovalCategoryKey>(categories[0]?.key ?? 'leave')

  const visibleCategories = categories.map((category) => ({
    ...category,
    items: category.items.filter((item) => !dismissedIds.has(item.id)),
  }))
  const activeCategory = visibleCategories.find((category) => category.key === activeKey) ?? visibleCategories[0]

  function dismiss(id: string) {
    setDismissedIds((prev) => new Set(prev).add(id))
  }

  return (
    <Card>
      <CardHeader
        title="Pending approvals"
        description="Requests waiting on your review"
        action={
          <Link to="/approvals" className="text-xs font-medium text-accent hover:underline">
            View all →
          </Link>
        }
      />

      <div className="flex flex-wrap gap-1.5 border-b border-line pb-3">
        {visibleCategories.map((category) => {
          const TabIcon = CATEGORY_ICONS[category.key]
          const isActive = category.key === activeCategory?.key
          return (
            <button
              key={category.key}
              type="button"
              onClick={() => setActiveKey(category.key)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                isActive ? 'bg-surface-2 text-ink' : 'text-muted hover:bg-surface-2 hover:text-ink'
              }`}
            >
              <TabIcon className="h-3.5 w-3.5" />
              {category.label}
              <span className={`rounded-pill px-1.5 py-0.5 text-[10px] ${isActive ? 'bg-canvas' : 'bg-surface-2'}`}>
                {category.items.length}
              </span>
            </button>
          )
        })}
      </div>

      {activeCategory && activeCategory.items.length > 0 ? (
        <ul className="divide-y divide-line">
          {activeCategory.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 py-3 first:pt-3 last:pb-0">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{item.employeeName}</p>
                <p className="truncate text-xs text-muted">{item.detail}</p>
                <p className="mt-0.5 text-[11px] text-muted">
                  {item.amount ? `${formatAmount(item.amount, item.currency ?? 'NGN')} · ` : null}
                  {formatRelativeTime(item.submittedAt)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => dismiss(item.id)}
                  aria-label={`Reject request from ${item.employeeName}`}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-critical hover:text-critical"
                >
                  <XIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => dismiss(item.id)}
                  aria-label={`Approve request from ${item.employeeName}`}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-ink transition-opacity hover:opacity-90"
                >
                  <CheckIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-6 text-center text-sm text-muted">Nothing pending in this category.</p>
      )}
    </Card>
  )
}
