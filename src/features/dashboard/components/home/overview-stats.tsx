import {
  CalendarCheckIcon,
  ClockCountdownIcon,
  UsersIcon,
  WarningCircleIcon,
  type Icon,
} from '@phosphor-icons/react'
import { Link } from 'react-router'
import { formatDayMonth } from '../../lib/format'
import type { DashboardOverview } from '../../types/dashboard-types'

function StatTile({
  icon: TileIcon,
  label,
  value,
  to,
}: {
  icon: Icon
  label: string
  value: string
  to?: string
}) {
  const content = (
    <>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2">
        <TileIcon className="h-4.5 w-4.5 text-ink" />
      </div>
      <div className="mt-3">
        <p className="text-xl font-medium text-ink">{value}</p>
        <p className="text-xs text-muted">{label}</p>
      </div>
    </>
  )

  if (to) {
    return (
      <Link
        to={to}
        className="rounded-panel border border-line bg-surface p-4 shadow-panel transition-colors hover:bg-surface-2"
      >
        {content}
      </Link>
    )
  }

  return <div className="rounded-panel border border-line bg-surface p-4 shadow-panel">{content}</div>
}

export function OverviewStats({ overview }: { overview: DashboardOverview }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatTile icon={UsersIcon} label="Active employees" value={overview.activeEmployees.toString()} to="/people/employees" />
      <StatTile
        icon={ClockCountdownIcon}
        label="Pending approvals"
        value={overview.pendingApprovalsCount.toString()}
        to="/approvals"
      />
      <StatTile
        icon={CalendarCheckIcon}
        label="Next pay date"
        value={formatDayMonth(overview.nextPayDate)}
        to="/payroll/overview"
      />
      <StatTile
        icon={WarningCircleIcon}
        label="Compliance alerts"
        value={overview.openComplianceAlertsCount.toString()}
        to="/compliance/statutory"
      />
    </div>
  )
}
