import { ArrowRight } from '@phosphor-icons/react'
import { formatAmount } from '../../dashboard/lib/format'
import { useMyCompensationHistory } from '../hooks/use-my-compensation-history'
import { formatLongDate } from '../lib/profile-format'

interface Entry {
  id: string
  effectiveDate: string
  previous?: number
  amount: number
}

function percentChange(previous: number, next: number): string | null {
  if (!previous) return null
  const change = ((next - previous) / previous) * 100
  return `${change > 0 ? '+' : ''}${change.toFixed(1).replace(/\.0$/, '')}%`
}

export function CompensationHistory({ currency }: { currency: string }) {
  const { data, isPending, isError, refetch } = useMyCompensationHistory()

  if (isPending) return <div className="h-32 animate-pulse rounded-lg bg-canvas" />

  if (isError) {
    return (
      <div className="py-4 text-center">
        <p className="text-sm text-muted">Couldn&apos;t load your compensation history right now.</p>
        <button type="button" onClick={() => refetch()} className="mt-2 text-sm font-medium text-accent hover:underline">
          Try again
        </button>
      </div>
    )
  }

  // Salary changes tell the fuller story; before the first change, the baseline
  // records are all there is.
  const entries: Entry[] = (
    data.history.length > 0
      ? data.history.map((change) => ({
          id: change.id,
          effectiveDate: change.effectiveDate,
          previous: change.previousSalary,
          amount: change.newSalary,
        }))
      : data.records.map((record) => ({ id: record.id, effectiveDate: record.effectiveDate, amount: record.baseSalary }))
  ).sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate))

  if (entries.length === 0) {
    return <p className="py-4 text-center text-sm text-muted">No compensation records yet.</p>
  }

  return (
    <ol className="divide-y divide-line">
      {entries.map((entry) => {
        const change = entry.previous !== undefined ? percentChange(entry.previous, entry.amount) : null
        return (
          <li key={entry.id} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-ink">
                {entry.previous !== undefined ? (
                  <>
                    <span className="font-normal text-muted">{formatAmount(entry.previous, currency)}</span>
                    <ArrowRight size={12} className="text-muted" />
                  </>
                ) : null}
                {formatAmount(entry.amount, currency)}
              </p>
              <p className="mt-0.5 text-xs text-muted">Effective {formatLongDate(entry.effectiveDate)}</p>
            </div>
            {change ? (
              <span className={`shrink-0 text-xs font-medium ${change.startsWith('-') ? 'text-critical' : 'text-positive'}`}>
                {change}
              </span>
            ) : (
              <span className="shrink-0 text-xs text-muted">{entry.previous === undefined ? 'Starting salary' : ''}</span>
            )}
          </li>
        )
      })}
    </ol>
  )
}
