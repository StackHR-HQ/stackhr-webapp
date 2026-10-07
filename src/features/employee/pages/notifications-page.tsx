import { BellSimple, CalendarBlank, FileText, Money, Receipt, UserCircle, type Icon } from '@phosphor-icons/react'
import { Card } from '../../../components/ui/card'
import { useMyNotifications } from '../hooks/use-my-notifications'
import { humanizeEnum } from '../lib/profile-format'
import type { ActivityTone, MyAuditEvent } from '../types/employee-types'

// Known audit actions; anything else falls back to a humanized action name.
const LABELS: Record<string, string> = {
  PROFILE_UPDATED: 'Your profile was updated',
  LEAVE_APPROVED: 'Your leave request was approved',
  LEAVE_REJECTED: 'Your leave request was declined',
  EXPENSE_APPROVED: 'Your expense claim was approved',
  EXPENSE_REJECTED: 'Your expense claim was declined',
}

// Actions are SUBJECT_VERB, so the prefix picks the icon.
const ICONS: Record<string, Icon> = {
  PROFILE: UserCircle,
  LEAVE: CalendarBlank,
  EXPENSE: Receipt,
  SALARY: Money,
  ADVANCE: Money,
  PAYSLIP: FileText,
}

const TONES: Record<ActivityTone, string> = {
  accent: 'text-accent',
  positive: 'text-positive',
  critical: 'text-critical',
  muted: 'text-muted',
}

function describe(event: MyAuditEvent): { label: string; icon: Icon; tone: ActivityTone } {
  const action = event.action
  const tone: ActivityTone = /APPROVED|PAID|DISBURSED/.test(action)
    ? 'positive'
    : /REJECTED|CANCELLED/.test(action)
      ? 'critical'
      : 'accent'
  return {
    label: LABELS[action] ?? humanizeEnum(action).replace(/-/g, ' '),
    icon: ICONS[action.split('_')[0]] ?? BellSimple,
    tone,
  }
}

function dayLabel(iso: string): string {
  const date = new Date(iso)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function groupByDay(events: MyAuditEvent[]): [day: string, events: MyAuditEvent[]][] {
  const groups = new Map<string, MyAuditEvent[]>()
  for (const event of events) {
    const day = dayLabel(event.createdAt)
    groups.set(day, [...(groups.get(day) ?? []), event])
  }
  return [...groups.entries()]
}

export function EmployeeNotificationsPage() {
  const { data: notifications, isPending, isError, refetch } = useMyNotifications()

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-medium text-ink">Notifications</h1>
        <p className="mt-1 text-sm text-muted">Updates on your requests and your record.</p>
      </div>

      {isPending ? (
        <div className="h-48 animate-pulse rounded-panel border border-line bg-surface" />
      ) : isError ? (
        <Card>
          <div className="py-4 text-center">
            <p className="text-sm text-muted">Couldn&apos;t load your notifications right now.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-2 text-sm font-medium text-accent hover:underline"
            >
              Try again
            </button>
          </div>
        </Card>
      ) : notifications.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <BellSimple size={28} weight="duotone" className="text-muted" />
            <p className="text-sm text-muted">You&apos;re all caught up. New updates will show here.</p>
          </div>
        </Card>
      ) : (
        groupByDay(notifications).map(([day, events]) => (
          <section key={day} className="space-y-3">
            <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted">{day}</h2>
            <Card>
              <ul className="divide-y divide-line">
                {events.map((event) => {
                  const { label, icon: ItemIcon, tone } = describe(event)
                  return (
                    <li key={event.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                      <div className="flex min-w-0 items-center gap-3">
                        <ItemIcon size={19} weight="duotone" className={`shrink-0 ${TONES[tone]}`} />
                        <span className="text-sm text-ink">{label}</span>
                      </div>
                      <time dateTime={event.createdAt} className="shrink-0 text-xs text-muted">
                        {new Date(event.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </time>
                    </li>
                  )
                })}
              </ul>
            </Card>
          </section>
        ))
      )}
    </div>
  )
}
