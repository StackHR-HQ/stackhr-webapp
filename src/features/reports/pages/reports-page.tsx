import {
  CalendarBlankIcon,
  ChartLineUpIcon,
  MoneyIcon,
  ReceiptIcon,
  ShieldCheckIcon,
  SparkleIcon,
  UsersIcon,
  type Icon,
} from '@phosphor-icons/react'
import { Card } from '../../../components/ui/card'

const REPORT_CATEGORIES: { icon: Icon; title: string; description: string }[] = [
  { icon: UsersIcon, title: 'People Reports', description: 'Headcount, org movement, and onboarding progress.' },
  { icon: MoneyIcon, title: 'Payroll Reports', description: 'Payroll cost trends, run history, and statutory breakdowns.' },
  { icon: ReceiptIcon, title: 'Expense Reports', description: 'Spend by category, employee, and approval turnaround.' },
  { icon: CalendarBlankIcon, title: 'Leave Reports', description: 'Leave utilization, balances, and time-off patterns.' },
  { icon: ShieldCheckIcon, title: 'Compliance Reports', description: 'Statutory filing history and outstanding warnings.' },
  { icon: ChartLineUpIcon, title: 'Cost Reports', description: 'Total cost to company, broken down over time.' },
]

export function ReportsPage() {
  return (
    <div className="max-w-[1400px] space-y-6">
      <div>
        <h1 className="text-xl font-medium text-ink">Reports</h1>
        <p className="mt-1 text-sm text-muted">
          Cross-functional reporting on People, Payroll, Spend, and Compliance data.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REPORT_CATEGORIES.map((category) => (
          <Card key={category.title} className="opacity-80">
            <div className="flex items-start justify-between gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2">
                <category.icon className="h-4.5 w-4.5 text-ink" />
              </div>
              <span className="rounded-pill bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-muted">Soon</span>
            </div>
            <p className="mt-3 text-sm font-medium text-ink">{category.title}</p>
            <p className="mt-1 text-xs text-muted">{category.description}</p>
          </Card>
        ))}
      </div>

      <div className="flex items-start gap-3 rounded-panel border border-dashed border-line bg-canvas p-4">
        <SparkleIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
        <p className="text-xs text-muted">
          Reporting is intentionally minimal for now. As each category comes online, an AI analytics layer will sit on
          top of this data to answer questions and surface trends directly, rather than just rendering static tables.
        </p>
      </div>
    </div>
  )
}
