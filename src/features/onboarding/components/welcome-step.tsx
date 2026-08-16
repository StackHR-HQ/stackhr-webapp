import { Button } from '../../../components/ui/button'

const HIGHLIGHTS = [
  { title: 'People Ops', desc: 'Employees, leave, and approvals in one system of record.' },
  { title: 'Payroll Ops', desc: 'Compliant payroll runs, versioned against local tax rules.' },
  { title: 'Spend Ops', desc: 'Expenses, reimbursements, and salary advances with approvals.' },
]

export function WelcomeStep({
  userName,
  orgName,
  onNext,
}: {
  userName?: string
  orgName?: string
  onNext: () => void
}) {
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-ink">
            Welcome{userName ? `, ${userName}` : ''}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Let&apos;s get {orgName ?? 'your workspace'} set up on StackHR — it only takes a couple of minutes.
          </p>
        </div>
        <button type="button" onClick={onNext} className="shrink-0 text-sm text-muted hover:text-ink hover:underline">
          Skip intro
        </button>
      </div>

      <ul className="mt-8 space-y-4">
        {HIGHLIGHTS.map((item) => (
          <li key={item.title} className="rounded-panel border border-line bg-surface p-4">
            <p className="font-medium text-ink">{item.title}</p>
            <p className="mt-0.5 text-sm text-muted">{item.desc}</p>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-sm text-muted">
        Next, we&apos;ll grab a few details about your company and add your first employee — that&apos;s the fastest
        way to see payroll and people ops in action.
      </p>

      <Button type="button" onClick={onNext} className="mt-8">
        Get started
      </Button>
    </div>
  )
}
