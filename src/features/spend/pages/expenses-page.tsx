import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { CURRENT_EMPLOYEE_ID } from '../data/expenses'
import { ExpenseStatusTabs, type ExpenseFilter } from '../components/expenses/expense-status-tabs'
import { ExpensesTable } from '../components/expenses/expenses-table'
import { useExpenses } from '../hooks/use-expenses'

export function ExpensesPage() {
  const { data: expenses, isPending, isError, refetch } = useExpenses()
  const [filter, setFilter] = useState<ExpenseFilter>('all')
  const [search, setSearch] = useState('')

  const counts = useMemo(() => {
    const base: Record<ExpenseFilter, number> = {
      all: expenses?.length ?? 0,
      mine: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      reimbursed: 0,
    }
    for (const expense of expenses ?? []) {
      base[expense.status] += 1
      if (expense.employeeId === CURRENT_EMPLOYEE_ID) base.mine += 1
    }
    return base
  }, [expenses])

  const filteredExpenses = useMemo(() => {
    const query = search.trim().toLowerCase()
    return (expenses ?? []).filter((expense) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'mine' ? expense.employeeId === CURRENT_EMPLOYEE_ID : expense.status === filter)
      const matchesSearch =
        !query ||
        expense.employeeName.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query) ||
        expense.description.toLowerCase().includes(query)
      return matchesFilter && matchesSearch
    })
  }, [expenses, filter, search])

  return (
    <div className="max-w-[1400px] space-y-5">
      <div>
        <h1 className="text-xl font-medium text-ink">Expenses</h1>
        <p className="mt-1 text-sm text-muted">Track expense claims from submission through reimbursement.</p>
      </div>

      {isError ? (
        <div className="rounded-panel border border-line bg-surface p-6 text-center shadow-panel">
          <p className="text-sm font-medium text-ink">Couldn't load expenses</p>
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
          <ExpenseStatusTabs active={filter} counts={counts} onChange={setFilter} />

          <div className="relative max-w-sm">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by employee, category, or description"
              className="w-full rounded-lg border border-line bg-canvas py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>

          {isPending ? (
            <div className="h-64 animate-pulse rounded-panel border border-line bg-surface" />
          ) : (
            <ExpensesTable expenses={filteredExpenses} />
          )}
        </div>
      )}
    </div>
  )
}
