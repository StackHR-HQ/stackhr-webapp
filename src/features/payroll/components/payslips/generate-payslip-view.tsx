import { FileTextIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Avatar } from '../../../../components/ui/avatar'
import { Card, CardHeader } from '../../../../components/ui/card'
import { formatAmount, formatDate } from '../../lib/format'
import type { PayslipRecord } from '../../types/payroll-types'

export function GeneratePayslipView({ pendingPayslips }: { pendingPayslips: PayslipRecord[] }) {
  const [generatedIds, setGeneratedIds] = useState<Set<string>>(new Set())

  const awaitingGeneration = pendingPayslips.filter((payslip) => !generatedIds.has(payslip.id))
  const generatedThisSession = pendingPayslips.filter((payslip) => generatedIds.has(payslip.id))

  function generate(id: string) {
    setGeneratedIds((prev) => new Set(prev).add(id))
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <Card>
        <CardHeader title="Awaiting generation" description="Payslips from calculated runs that haven't been generated yet" />
        {awaitingGeneration.length > 0 ? (
          <ul className="divide-y divide-line">
            {awaitingGeneration.map((payslip) => (
              <li key={payslip.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-2.5">
                  <Avatar initials={payslip.avatarInitials} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{payslip.employeeName}</p>
                    <p className="truncate text-xs text-muted">
                      {payslip.periodLabel} · {formatAmount(payslip.netPay, payslip.currency)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => generate(payslip.id)}
                  className="shrink-0 rounded-lg bg-accent px-2.5 py-1.5 text-xs font-medium text-accent-ink hover:opacity-90"
                >
                  Generate
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">Nothing waiting on generation.</p>
        )}
      </Card>

      <Card>
        <CardHeader title="Generated this session" />
        {generatedThisSession.length > 0 ? (
          <ul className="divide-y divide-line">
            {generatedThisSession.map((payslip) => (
              <li key={payslip.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2">
                  <FileTextIcon className="h-4 w-4 text-ink" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{payslip.employeeName}</p>
                  <p className="text-xs text-muted">
                    {payslip.periodLabel} · {formatDate(payslip.payDate)} · {formatAmount(payslip.netPay, payslip.currency)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">Nothing generated yet.</p>
        )}
      </Card>
    </div>
  )
}
