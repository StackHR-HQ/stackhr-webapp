import { Avatar } from '../../../../components/ui/avatar'
import { formatDate } from '../../lib/format'
import type { EmployeeOnboardingRow, OnboardingTemplate } from '../../types/people-types'

export function EmployeeOnboardingView({
  rows,
  templates,
  onSelect,
}: {
  rows: EmployeeOnboardingRow[]
  templates: OnboardingTemplate[]
  onSelect: (employeeId: string) => void
}) {
  if (rows.length === 0) {
    return (
      <p className="rounded-panel border border-dashed border-line p-8 text-center text-sm text-muted">
        No one is currently onboarding.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-panel border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Employee</th>
            <th className="px-4 py-3 font-medium">Template</th>
            <th className="px-4 py-3 font-medium">Start date</th>
            <th className="px-4 py-3 font-medium">Progress</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => {
            const template = templates.find((item) => item.id === row.templateId)
            const total = template?.checklist.length ?? 0
            const percent = total > 0 ? Math.round((row.completedItemIds.length / total) * 100) : 0

            return (
              <tr
                key={row.employeeId}
                onClick={() => onSelect(row.employeeId)}
                className="cursor-pointer bg-canvas transition-colors hover:bg-surface"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar initials={row.avatarInitials} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink">{row.employeeName}</p>
                      <p className="truncate text-xs text-muted">{row.jobTitle}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">{template?.name ?? '—'}</td>
                <td className="px-4 py-3 text-muted">{formatDate(row.startDate)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-pill bg-surface-2">
                      <div className="h-full rounded-pill bg-accent" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="text-xs text-muted">{percent}%</span>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
