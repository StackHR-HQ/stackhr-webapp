import { ClockCountdownIcon, EnvelopeSimpleIcon, UsersIcon, type Icon } from '@phosphor-icons/react'
import { Link } from 'react-router'
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
  to: string
}) {
  return (
    <Link
      to={to}
      className="rounded-panel border border-line bg-surface p-4 shadow-panel transition-colors hover:bg-surface-2"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2">
        <TileIcon className="h-4.5 w-4.5 text-ink" />
      </div>
      <div className="mt-3">
        <p className="text-xl font-medium text-ink">{value}</p>
        <p className="text-xs text-muted">{label}</p>
      </div>
    </Link>
  )
}

export function OverviewStats({ overview }: { overview: DashboardOverview }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <StatTile icon={UsersIcon} label="Active employees" value={overview.activeEmployees.toString()} to="/people/employees" />
      <StatTile
        icon={EnvelopeSimpleIcon}
        label="Pending invitations"
        value={overview.pendingInvitations.toString()}
        to="/people/employees"
      />
      <StatTile
        icon={ClockCountdownIcon}
        label="Pending approvals"
        value={overview.pendingApprovalsCount.toString()}
        to="/approvals"
      />
    </div>
  )
}
