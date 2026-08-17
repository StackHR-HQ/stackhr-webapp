import { Link, useParams } from 'react-router'
import { ExpenseClaimCard } from '../components/expenses/expense-claim-card'
import { ExpenseDecisionCard } from '../components/expenses/expense-decision-card'
import { ExpenseDetailHeader } from '../components/expenses/expense-detail-header'
import { ExpenseReimbursementCard } from '../components/expenses/expense-reimbursement-card'
import { useExpense } from '../hooks/use-expense'

export function ExpenseDetailPage() {
  const { expenseId } = useParams<{ expenseId: string }>()
  const { data: expense, isPending, isError, refetch } = useExpense(expenseId)

  if (isPending) {
    return (
      <div className="max-w-[1400px] space-y-5">
        <div className="h-28 animate-pulse rounded-panel border border-line bg-surface" />
        <div className="h-64 animate-pulse rounded-panel border border-line bg-surface" />
      </div>
    )
  }

  if (isError || !expense) {
    return (
      <div className="max-w-md rounded-panel border border-line bg-surface p-6 text-center shadow-panel">
        <p className="text-sm font-medium text-ink">Couldn't load this expense</p>
        <p className="mt-1 text-sm text-muted">It may not exist, or something went wrong.</p>
        <div className="mt-4 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-ink hover:opacity-90"
          >
            Try again
          </button>
          <Link
            to="/spend/expenses"
            className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-surface"
          >
            Back to expenses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] space-y-5">
      <Link to="/spend/expenses" className="text-xs font-medium text-muted hover:text-ink">
        ← Back to expenses
      </Link>

      <ExpenseDetailHeader expense={expense} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <ExpenseClaimCard expense={expense} />
          {expense.status !== 'pending' ? <ExpenseDecisionCard expense={expense} /> : null}
        </div>

        <div className="space-y-5">
          {expense.status === 'pending' ? <ExpenseDecisionCard expense={expense} /> : null}
          {expense.reimbursement ? <ExpenseReimbursementCard reimbursement={expense.reimbursement} /> : null}
        </div>
      </div>
    </div>
  )
}
