import { FileText } from '@phosphor-icons/react'
import { Card } from '../../../components/ui/card'
import { formatAmount } from '../../dashboard/lib/format'
import { latestPayslip, payslipPeriod, useMyPayslips } from '../hooks/use-my-payslips'
import { useMyProfile } from '../hooks/use-my-profile'

export function MyPayslipsPage() {
  const payslips = useMyPayslips()
  const profile = useMyProfile()
  const currency = profile.data?.currency ?? 'NGN'

  const sorted = payslips.data
    ? [...payslips.data].sort((a, b) => b.periodYear - a.periodYear || b.periodMonth - a.periodMonth)
    : []
  const latest = payslips.data ? latestPayslip(payslips.data) : undefined

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-medium text-ink">My Payslips</h1>
        <p className="mt-1 text-sm text-muted">Your net pay for every payroll you&apos;ve been part of.</p>
      </div>

      {payslips.isPending ? (
        <div className="h-48 animate-pulse rounded-panel border border-line bg-surface" />
      ) : payslips.isError ? (
        <Card>
          <div className="py-4 text-center">
            <p className="text-sm text-muted">Couldn&apos;t load your payslips right now.</p>
            <button
              type="button"
              onClick={() => payslips.refetch()}
              className="mt-2 text-sm font-medium text-accent hover:underline"
            >
              Try again
            </button>
          </div>
        </Card>
      ) : sorted.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <FileText size={28} weight="duotone" className="text-muted" />
            <p className="text-sm text-muted">No payslips yet. They&apos;ll appear here after your first payroll.</p>
          </div>
        </Card>
      ) : (
        <>
          {latest ? (
            <Card>
              <p className="text-xs text-muted">Latest net pay · {payslipPeriod(latest)}</p>
              <p className="mt-1 text-2xl font-medium text-ink">{formatAmount(latest.netSalary / 100, currency)}</p>
            </Card>
          ) : null}

          <Card>
            <ul className="divide-y divide-line">
              {sorted.map((payslip) => (
                <li key={payslip.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="flex min-w-0 items-center gap-3">
                    <FileText size={19} weight="duotone" className="shrink-0 text-accent" />
                    <span className="text-sm font-medium text-ink">{payslipPeriod(payslip)}</span>
                  </div>
                  {/* Amounts are in kobo. */}
                  <span className="shrink-0 text-sm text-ink">{formatAmount(payslip.netSalary / 100, currency)}</span>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}
    </div>
  )
}
