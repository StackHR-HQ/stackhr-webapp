import { Receipt } from '@phosphor-icons/react'
import { useState } from 'react'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { Card } from '../../../components/ui/card'
import { Modal } from '../../../components/ui/modal'
import { notify } from '../../../lib/toast'
import { formatAmount, formatDate } from '../../dashboard/lib/format'
import { ExpenseClaimForm } from '../components/expense-claim-form'
import { useMyProfile } from '../hooks/use-my-profile'
import { useMyExpenses } from '../hooks/use-my-spend'
import { requestStatusMeta } from '../lib/request-status'

export function MyExpensesPage() {
  const [submitting, setSubmitting] = useState(false)
  const expenses = useMyExpenses()
  const profile = useMyProfile()
  const currency = profile.data?.currency ?? 'NGN'

  const sorted = expenses.data ? expenses.data.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt)) : []

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium text-ink">My Expenses</h1>
          <p className="mt-1 text-sm text-muted">Claim back money you&apos;ve spent on work.</p>
        </div>
        <div className="shrink-0">
          <Button type="button" onClick={() => setSubmitting(true)} className="w-auto px-4">
            New claim
          </Button>
        </div>
      </div>

      <Modal open={submitting} onClose={() => setSubmitting(false)} title="New expense claim">
        {submitting ? (
          <ExpenseClaimForm
            currency={currency}
            onDone={() => {
              notify.success('Expense claim submitted')
              setSubmitting(false)
            }}
            onCancel={() => setSubmitting(false)}
          />
        ) : null}
      </Modal>

      {expenses.isPending ? (
        <div className="h-48 animate-pulse rounded-panel border border-line bg-surface" />
      ) : expenses.isError ? (
        <Card>
          <div className="py-4 text-center">
            <p className="text-sm text-muted">Couldn&apos;t load your expense claims right now.</p>
            <button
              type="button"
              onClick={() => expenses.refetch()}
              className="mt-2 text-sm font-medium text-accent hover:underline"
            >
              Try again
            </button>
          </div>
        </Card>
      ) : sorted.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <Receipt size={28} weight="duotone" className="text-muted" />
            <p className="text-sm text-muted">You haven&apos;t submitted any expense claims yet.</p>
          </div>
        </Card>
      ) : (
        <Card>
          <ul className="divide-y divide-line">
            {sorted.map((expense) => {
              const status = requestStatusMeta(expense.status)
              return (
                <li key={expense.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">{expense.category}</p>
                    <p className="truncate text-xs text-muted">
                      {[formatDate(expense.createdAt), expense.description].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm text-ink">{formatAmount(expense.amount, expense.currency ?? currency)}</span>
                    <Badge tone={status.tone}>{status.label}</Badge>
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>
      )}
    </div>
  )
}
