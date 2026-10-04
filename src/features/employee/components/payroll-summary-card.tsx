import { Link } from 'react-router'
import { formatAmount } from '../../dashboard/lib/format'
import { latestPayslip, payslipPeriod, useMyPayslips } from '../hooks/use-my-payslips'
import { useMyProfile } from '../hooks/use-my-profile'

export function PayrollSummaryCard() {
  const profile = useMyProfile()
  const payslips = useMyPayslips()

  const isPending = profile.isPending || payslips.isPending
  const isError = profile.isError || payslips.isError
  const latest = payslips.data ? latestPayslip(payslips.data) : undefined
  const currency = profile.data?.currency ?? 'NGN'

  return (
    <section className="rounded-panel border border-line bg-surface p-6 shadow-panel">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-medium text-ink">Payroll summary</h2>
        <Link to="/me/payslips" className="text-xs font-medium text-accent">All payslips</Link>
      </div>

      {isPending ? (
        <div className="h-24 animate-pulse rounded-lg bg-canvas" />
      ) : isError ? (
        <p className="text-sm text-muted">Couldn't load your payroll details right now.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          <div>
            <p className="text-xs text-muted">Current salary</p>
            <p className="mt-1 text-xl font-medium text-ink">
              {profile.data?.annualSalaryMinor ? (
                <>
                  {formatAmount(profile.data.annualSalaryMinor / 100, currency)}{' '}
                  <span className="text-xs font-normal text-muted">/ year</span>
                </>
              ) : (
                <span className="text-sm text-muted">Not set</span>
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">Latest net pay</p>
            <p className="mt-1 text-xl font-medium text-ink">
              {latest ? formatAmount(latest.netSalary / 100, currency) : <span className="text-sm text-muted">No payslips yet</span>}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">Latest payslip</p>
            <p className="mt-1 text-sm font-medium text-ink">
              {latest ? (
                <>
                  {payslipPeriod(latest)} <span className="text-xs font-normal text-positive">Available</span>
                </>
              ) : (
                <span className="text-muted">None yet</span>
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">Salary changes</p>
            {/* No salary history is available to employees yet. */}
            <p className="mt-1 text-sm font-medium text-muted">—</p>
          </div>
        </div>
      )}
    </section>
  )
}
