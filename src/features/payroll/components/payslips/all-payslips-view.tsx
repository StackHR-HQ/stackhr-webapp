import { Link } from 'react-router'
import { Avatar } from '../../../../components/ui/avatar'
import { Badge } from '../../../../components/ui/badge'
import { formatAmount, formatDate } from '../../lib/format'
import type { PayslipRecord } from '../../types/payroll-types'

export function AllPayslipsView({ payslips }: { payslips: PayslipRecord[] }) {
  if (payslips.length === 0) {
    return (
      <p className="rounded-panel border border-dashed border-line p-8 text-center text-sm text-muted">
        No payslips generated yet.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-panel border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Employee</th>
            <th className="px-4 py-3 font-medium">Period</th>
            <th className="px-4 py-3 font-medium">Pay date</th>
            <th className="px-4 py-3 font-medium">Net pay</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {payslips.map((payslip) => (
            <tr key={payslip.id} className="bg-canvas">
              <td className="px-4 py-3">
                <Link to={`/people/employees/${payslip.employeeId}`} className="flex items-center gap-2.5 hover:underline">
                  <Avatar initials={payslip.avatarInitials} size="sm" />
                  <span className="font-medium text-ink">{payslip.employeeName}</span>
                </Link>
              </td>
              <td className="px-4 py-3 text-muted">
                <Link to={`/payroll/runs/${payslip.runId}`} className="hover:underline">
                  {payslip.periodLabel}
                </Link>
              </td>
              <td className="px-4 py-3 text-muted">{formatDate(payslip.payDate)}</td>
              <td className="px-4 py-3 text-ink">{formatAmount(payslip.netPay, payslip.currency)}</td>
              <td className="px-4 py-3">
                <Badge tone={payslip.status === 'generated' ? 'positive' : 'neutral'}>
                  {payslip.status === 'generated' ? 'Generated' : 'Pending'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
