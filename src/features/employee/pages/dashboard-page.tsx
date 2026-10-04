import { ArrowRight, CalendarBlank, CheckCircle, CloudArrowUp, FileText, Money, Receipt, TrendUp } from '@phosphor-icons/react'
import { Link } from 'react-router'
import { useAuthStore } from '../../auth/store/auth-store'
import { greeting } from '../../dashboard/lib/format'
import { CurrentStatusCard } from '../components/current-status-card'
import { LeaveSummaryCard } from '../components/leave-summary-card'

const actions = [
  ['Request leave', 'Plan time away', '/me/leave', CalendarBlank], ['Submit expense', 'Get reimbursed', '/me/expenses', Receipt],
  ['Salary advance', 'Request an advance', '/me/salary-advance', Money], ['View payslip', 'Latest: July 2026', '/me/payslips', FileText], ['Upload document', 'Keep records current', '/me/documents', CloudArrowUp],
] as const

const activity = [
  ['Payslip generated', '18 Jul 2026', FileText, 'text-accent'], ['Leave approved', '14 Jul 2026', CheckCircle, 'text-positive'], ['Expense reimbursed', '08 Jul 2026', Receipt, 'text-positive'], ['Document uploaded', '02 Jul 2026', CloudArrowUp, 'text-muted']
] as const

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

function todayLabel(): string {
  const today = new Date()
  const weekday = today.toLocaleDateString('en-GB', { weekday: 'long' })
  return `${weekday}, ${today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
}

export function EmployeeDashboardPage() {
  const user = useAuthStore((state) => state.user)
  const name = user?.name ?? ''
  const firstName = name.split(' ')[0]

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

        <div className="rounded-panel border border-accent/25 bg-accent/10 p-6 shadow-panel sm:p-7">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.14em] text-accent">Needs your attention</p>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-sm font-medium text-white">2</span>
          </div>
          <h2 className="mt-3 text-xl font-medium text-ink">Complete your profile</h2>
          <p className="mt-1 text-sm text-muted">Add your emergency contact and bank details to finish setup.</p>
          <Link to="/me/profile" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent">Continue <ArrowRight size={16} /></Link>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-medium text-ink">Quick actions</h2>
          <span className="text-xs text-muted">Most used</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {actions.map(
            ([label, detail, href, Icon]) => 
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
        <section className="rounded-panel border border-line bg-surface p-6 shadow-panel">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-medium text-ink">Payroll summary</h2>
            <Link to="/me/payslips" className="text-xs font-medium text-accent">All payslips</Link>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <p className="text-xs text-muted">Current salary</p>
              <p className="mt-1 text-xl font-medium text-ink">¥7,200,000 <span className="text-xs font-normal text-muted">/ year</span></p>
            </div>
            <div>
              <p className="text-xs text-muted">Latest net pay</p>
              <p className="mt-1 text-xl font-medium text-ink">¥468,240</p>
            </div>
            <div>
              <p className="text-xs text-muted">Last payslip</p>
              <p className="mt-1 text-sm font-medium text-ink">18 Jul 2026 <span className="text-xs font-normal text-positive">Available</span></p>
            </div>
            <div>
              <p className="text-xs text-muted">Salary changes</p>
              <p className="mt-1 flex items-center gap-1 text-sm font-medium text-positive">
                <TrendUp size={16} /> +4.5% this year
              </p>
            </div>
          </div>
        </section>
        <LeaveSummaryCard />
      </div>
      <section className="rounded-panel border border-line bg-surface p-6 shadow-panel">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-medium text-ink">Recent activity</h2>
          <Link to="/me/notifications" className="text-xs font-medium text-accent">View all</Link>
        </div>
        <div className="divide-y divide-line">
          {activity.map(
            ([label, date, Icon, tone]) => 
            <div key={label} className="flex items-center justify-between gap-4 py-3">
              <div className="flex items-center gap-3">
                <Icon size={19} weight="duotone" className={tone} />
                <span className="text-sm text-ink">{label}</span>
              </div>
              <span className="text-xs text-muted">{date}</span>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
