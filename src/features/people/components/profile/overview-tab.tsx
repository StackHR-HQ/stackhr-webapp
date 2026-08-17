import { Link } from 'react-router'
import { Card, CardHeader } from '../../../../components/ui/card'
import { tenureLabel } from '../../lib/dates'
import { formatAmount, formatDate } from '../../lib/format'
import type { Department, EmployeeDetail, EmployeeSummary } from '../../types/people-types'
import { FieldGrid } from './field-grid'

export function OverviewTab({
  employee,
  department,
  manager,
}: {
  employee: EmployeeDetail
  department?: Department
  manager?: EmployeeSummary
}) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <Card>
          <CardHeader title="Employment" />
          <FieldGrid
            fields={[
              { label: 'Department', value: department?.name ?? '—' },
              {
                label: 'Manager',
                value: manager ? (
                  <Link to={`/people/employees/${manager.id}`} className="text-accent hover:underline">
                    {manager.fullName}
                  </Link>
                ) : (
                  '—'
                ),
              },
              { label: 'Employment type', value: employee.employmentType },
              { label: 'Start date', value: formatDate(employee.startDate) },
              { label: 'Tenure', value: tenureLabel(employee.startDate) },
              { label: 'Work location', value: employee.workLocation },
            ]}
          />
        </Card>

        <Card>
          <CardHeader title="Leave balance" />
          <div className="space-y-4">
            {employee.leaveBalance.map((entry) => {
              const remaining = entry.totalDays - entry.usedDays
              const percentUsed = Math.round((entry.usedDays / entry.totalDays) * 100)
              return (
                <div key={entry.type}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink">{entry.type}</span>
                    <span className="text-muted">{remaining} days left</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-pill bg-surface-2">
                    <div className="h-full rounded-pill bg-accent" style={{ width: `${percentUsed}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <div className="space-y-5">
        <Card>
          <CardHeader title="Compensation" />
          <FieldGrid
            fields={[
              { label: 'Salary', value: `${formatAmount(employee.compensation.salary, employee.compensation.currency)}/yr` },
              { label: 'Pay frequency', value: employee.compensation.payFrequency },
              { label: 'Bank', value: `${employee.compensation.bankName} •••• ${employee.compensation.bankAccountLast4}` },
            ]}
          />
        </Card>

        <Card>
          <CardHeader title="Recent activity" />
          {employee.activity.length > 0 ? (
            <ul className="space-y-3">
              {employee.activity.slice(0, 5).map((item) => (
                <li key={item.id} className="text-sm">
                  <p className="text-ink">{item.description}</p>
                  <p className="text-xs text-muted">{formatDate(item.timestamp)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">No activity yet.</p>
          )}
        </Card>
      </div>
    </div>
  )
}
