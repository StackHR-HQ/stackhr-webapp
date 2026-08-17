import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Card } from '../../../../components/ui/card'
import { buildMonthGrid, dateWithinRange, isSameDay } from '../../lib/calendar-grid'
import type { LeaveRequestWithEmployee } from '../../types/people-types'

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function LeaveCalendarView({ requests }: { requests: LeaveRequestWithEmployee[] }) {
  const today = useMemo(() => new Date(), [])
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))

  const grid = useMemo(() => buildMonthGrid(cursor.getFullYear(), cursor.getMonth()), [cursor])
  const approvedRequests = useMemo(() => requests.filter((request) => request.status !== 'rejected'), [requests])

  function shiftMonth(delta: number) {
    setCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1))
  }

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-ink">
          {cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            aria-label="Previous month"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-line text-muted hover:bg-canvas"
          >
            <CaretLeftIcon className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            aria-label="Next month"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-line text-muted hover:bg-canvas"
          >
            <CaretRightIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-line bg-line">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="bg-surface px-2 py-1.5 text-center text-[11px] font-medium uppercase text-muted">
            {label}
          </div>
        ))}

        {grid.map(({ date, inCurrentMonth }) => {
          const dayRequests = approvedRequests.filter((request) =>
            dateWithinRange(date, request.startDate, request.endDate),
          )
          const isToday = isSameDay(date, today)

          return (
            <div
              key={date.toISOString()}
              className={`min-h-[84px] bg-canvas p-1.5 ${inCurrentMonth ? '' : 'opacity-40'}`}
            >
              <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                  isToday ? 'bg-accent text-accent-ink' : 'text-muted'
                }`}
              >
                {date.getDate()}
              </span>
              <div className="mt-1 space-y-0.5">
                {dayRequests.slice(0, 2).map((request) => (
                  <p
                    key={request.id}
                    title={`${request.employeeName} · ${request.type}`}
                    className={`truncate rounded px-1 py-0.5 text-[10px] font-medium ${
                      request.status === 'pending' ? 'bg-surface-2 text-muted' : 'bg-accent/10 text-accent'
                    }`}
                  >
                    {request.employeeName.split(' ')[0]}
                  </p>
                ))}
                {dayRequests.length > 2 ? (
                  <p className="px-1 text-[10px] text-muted">+{dayRequests.length - 2} more</p>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
