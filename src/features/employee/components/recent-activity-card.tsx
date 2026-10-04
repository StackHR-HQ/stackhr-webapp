import { CalendarBlank, FileText, Money, Receipt, type Icon } from '@phosphor-icons/react'
import { useMyActivity } from '../hooks/use-my-activity'
import type { ActivityTone, MyActivityItem } from '../types/employee-types'

const ICONS: Record<MyActivityItem['kind'], Icon> = {
  leave: CalendarBlank,
  payslip: FileText,
  expense: Receipt,
  'salary-advance': Money,
}

const TONES: Record<ActivityTone, string> = {
  accent: 'text-accent',
  positive: 'text-positive',
  critical: 'text-critical',
  muted: 'text-muted',
}

function formatActivityDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function RecentActivityCard() {
  const { data: activity, isPending, isError } = useMyActivity()

  return (
    <section className="rounded-panel border border-line bg-surface p-6 shadow-panel">
      <h2 className="mb-2 text-lg font-medium text-ink">Recent activity</h2>

      {isPending ? (
        <div className="h-24 animate-pulse rounded-lg bg-canvas" />
      ) : isError ? (
        <p className="py-3 text-sm text-muted">Couldn't load your activity right now.</p>
      ) : activity.length === 0 ? (
        <p className="py-3 text-sm text-muted">No activity yet.</p>
      ) : (
        <div className="divide-y divide-line">
          {activity.map((item) => {
            const ItemIcon = ICONS[item.kind]
            return (
              <div key={item.id} className="flex items-center justify-between gap-4 py-3">
                <div className="flex items-center gap-3">
                  <ItemIcon size={19} weight="duotone" className={TONES[item.tone]} />
                  <span className="text-sm text-ink">{item.label}</span>
                </div>
                <span className="shrink-0 text-xs text-muted">{formatActivityDate(item.timestamp)}</span>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
