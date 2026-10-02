import { Clock } from '@phosphor-icons/react'
import { Link } from 'react-router'
import { useLeaveSummary } from '../hooks/use-leave-summary'
import type { UpcomingLeave } from '../types/employee-types'

function formatLeaveRange({ startDate, endDate }: UpcomingLeave): string {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const month = (date: Date) => date.toLocaleDateString('en-GB', { month: 'short' })
  if (start.toDateString() === end.toDateString()) return `${start.getDate()} ${month(start)}`
  if (start.getMonth() === end.getMonth()) return `${start.getDate()}–${end.getDate()} ${month(end)}`
  return `${start.getDate()} ${month(start)} – ${end.getDate()} ${month(end)}`
}

const plural = (count: number, word: string) => `${word}${count === 1 ? '' : 's'}`

export function LeaveSummaryCard() {
  const { data: summary, isPending, isError } = useLeaveSummary()

  return (
    <section className="rounded-panel border border-line bg-surface p-6 shadow-panel">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-medium text-ink">Leave summary</h2>
        <Link to="/me/leave" className="text-xs font-medium text-accent">Manage leave</Link>
      </div>

      {isPending ? (
        <div className="h-24 animate-pulse rounded-lg bg-canvas" />
      ) : isError ? (
        <p className="text-sm text-muted">Couldn't load your leave right now.</p>
      ) : (
        <>
          <div className="flex items-end gap-6">
            {summary.hasBalances ? (
              <>
                <div>
                  <p className="text-xs text-muted">Available balance</p>
                  <p className="mt-1 text-3xl font-medium text-ink">
                    {summary.availableDays} <span className="text-sm font-normal text-muted">{plural(summary.availableDays, 'day')}</span>
                  </p>
                </div>
                <div className="h-12 w-px bg-line" />
                <div>
                  <p className="text-xs text-muted">Used this year</p>
                  <p className="mt-1 text-xl font-medium text-ink">
                    {summary.usedDays} <span className="text-sm font-normal text-muted">{plural(summary.usedDays, 'day')}</span>
                  </p>
                </div>
              </>
            ) : (
              <p className="flex-1 text-sm text-muted">Your leave allowance hasn't been set up yet.</p>
            )}
            <div>
              <p className="text-xs text-muted">Pending</p>
              <p className="mt-1 text-xl font-medium text-ink">
                {summary.pendingRequests}{' '}
                <span className="text-sm font-normal text-muted">{plural(summary.pendingRequests, 'request')}</span>
              </p>
            </div>
          </div>

          {summary.upcoming ? (
            <div className="mt-6 flex items-center gap-2 rounded-lg bg-canvas px-3 py-3 text-sm text-ink">
              <Clock size={17} className="text-accent" />
              <span>
                <strong className="font-medium">Upcoming:</strong> {formatLeaveRange(summary.upcoming)}
                {summary.upcoming.typeName ? ` · ${summary.upcoming.typeName}` : ''}
              </span>
            </div>
          ) : null}
        </>
      )}
    </section>
  )
}
