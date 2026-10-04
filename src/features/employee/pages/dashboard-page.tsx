import { ArrowRight, CalendarBlank, CloudArrowUp, FileText, Money, Receipt } from '@phosphor-icons/react'
import { Link } from 'react-router'
import { useAuthStore } from '../../auth/store/auth-store'
import { greeting } from '../../dashboard/lib/format'
import { AttentionCard } from '../components/attention-card'
import { CurrentStatusCard } from '../components/current-status-card'
import { LeaveSummaryCard } from '../components/leave-summary-card'
import { PayrollSummaryCard } from '../components/payroll-summary-card'
import { RecentActivityCard } from '../components/recent-activity-card'
import { latestPayslip, payslipPeriod, useMyPayslips } from '../hooks/use-my-payslips'
import { initials } from '../lib/profile-format'

function todayLabel(): string {
  const today = new Date()
  const weekday = today.toLocaleDateString('en-GB', { weekday: 'long' })
  return `${weekday}, ${today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
}

export function EmployeeDashboardPage() {
  const user = useAuthStore((state) => state.user)
  const name = user?.name ?? ''
  const firstName = name.split(' ')[0]
  const { data: payslips } = useMyPayslips()
  const latest = payslips ? latestPayslip(payslips) : undefined

  const actions = [
    { label: 'Request leave', detail: 'Plan time away', href: '/me/leave', Icon: CalendarBlank },
    { label: 'Submit expense', detail: 'Get reimbursed', href: '/me/expenses', Icon: Receipt },
    { label: 'Salary advance', detail: 'Request an advance', href: '/me/salary-advance', Icon: Money },
    {
      label: 'View payslip',
      detail: latest ? `Latest: ${payslipPeriod(latest)}` : 'No payslips yet',
      href: '/me/payslips',
      Icon: FileText,
    },
    { label: 'Upload document', detail: 'Keep records current', href: '/me/documents', Icon: CloudArrowUp },
  ]

  return (
    <div className="mx-auto w-full max-w-6xl space-y-7 pb-8">
      <header className="flex flex-col justify-between gap-4 border-b border-line pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted">{todayLabel()}</p>
          <h1 className="text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            {greeting()}
            {firstName ? `, ${firstName}` : ''}
          </h1>
          <p className="mt-2 text-sm text-muted">Here’s what needs your attention today.</p>
        </div>
        <Link to="/me/profile" className="flex items-center gap-3 self-start rounded-full border border-line bg-surface px-3 py-2 sm:self-auto">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-medium text-canvas">
            {initials(name) || '?'}
          </span>
          <span>
            <span className="block text-sm font-medium text-ink">{name}</span>
            <span className="block text-xs text-muted">{user?.orgName}</span>
          </span>
        </Link>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <CurrentStatusCard />

        <AttentionCard />
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-medium text-ink">Quick actions</h2>
          <span className="text-xs text-muted">Most used</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {actions.map(
            ({ label, detail, href, Icon }) =>
              <Link key={label} to={href} className="group rounded-panel border border-line bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-accent/40">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-canvas text-accent"><Icon size={19} weight="duotone" />
                </span>
                <span className="mt-4 block text-sm font-medium text-ink">{label}</span>
                <span className="mt-1 block text-xs text-muted">{detail}</span>
                <ArrowRight size={15} className="mt-4 text-muted transition-transform group-hover:translate-x-1" />
              </Link>
            )}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <PayrollSummaryCard />
        <LeaveSummaryCard />
      </div>
      <RecentActivityCard />
    </div>
  )
}
