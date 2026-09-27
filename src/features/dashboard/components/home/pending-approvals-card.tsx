import {
  CalendarBlankIcon,
  CheckIcon,
  HandCoinsIcon,
  IdentificationCardIcon,
  ListChecksIcon,
  ReceiptIcon,
  ArrowUUpLeftIcon,
  XIcon,
  type Icon,
} from '@phosphor-icons/react'
import { useState } from 'react'
import { Link } from 'react-router'
import { Card, CardHeader } from '../../../../components/ui/card'
import { getApiErrorMessage } from '../../../../lib/http'
import { useDecideApproval } from '../../../approvals/hooks/use-decide-approval'
import { useAuthStore } from '../../../auth/store/auth-store'
import { formatAmount, formatRelativeTime } from '../../lib/format'
import type { ApprovalCategory, ApprovalCategoryKey } from '../../types/dashboard-types'

const CATEGORY_ICONS: Record<ApprovalCategoryKey, Icon> = {
  'employee-changes': IdentificationCardIcon,
  leave: CalendarBlankIcon,
  expenses: ReceiptIcon,
  reimbursements: ArrowUUpLeftIcon,
  'salary-advances': HandCoinsIcon,
  other: ListChecksIcon,
}

export function PendingApprovalsCard({ categories }: { categories: ApprovalCategory[] }) {
  const [activeKey, setActiveKey] = useState<ApprovalCategoryKey | undefined>(categories[0]?.key)
  const decide = useDecideApproval()
  const currentUserId = useAuthStore((state) => state.user?.id)

  const activeCategory = categories.find((category) => category.key === activeKey) ?? categories[0]
  const decidingId = decide.isPending ? decide.variables.id : undefined

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

      {categories.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">Nothing is waiting on your review.</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-1.5 border-b border-line pb-3">
            {categories.map((category) => {
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

          {decide.isError ? (
            <p role="alert" className="pt-3 text-xs text-critical">
              {getApiErrorMessage(decide.error)}
            </p>
          ) : null}

          <ul className="divide-y divide-line">
            {activeCategory?.items.map((item) => {
              const isOwn = item.requesterId === currentUserId
              const disabled = isOwn || decidingId === item.id
              const lockedTitle = isOwn ? "You can't decide your own request" : undefined
              return (
                <li key={item.id} className="flex items-center justify-between gap-3 py-3 first:pt-3 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{item.title}</p>
                    <p className="truncate text-xs text-muted">{item.detail}</p>
                    <p className="mt-0.5 text-[11px] text-muted">
                      {isOwn ? 'Requested by you · ' : null}
                      {item.amount ? `${formatAmount(item.amount, item.currency ?? 'NGN')} · ` : null}
                      {formatRelativeTime(item.submittedAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      disabled={disabled}
                      title={lockedTitle}
                      onClick={() => decide.mutate({ id: item.id, status: 'REJECTED' })}
                      aria-label={`Reject ${item.title}`}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-critical hover:text-critical disabled:opacity-50 disabled:hover:border-line disabled:hover:text-muted"
                    >
                      <XIcon className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={disabled}
                      title={lockedTitle}
                      onClick={() => decide.mutate({ id: item.id, status: 'APPROVED' })}
                      aria-label={`Approve ${item.title}`}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-ink transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      <CheckIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </Card>
  )
}
