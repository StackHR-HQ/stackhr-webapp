import { Link } from 'react-router'
import { Badge } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import { formatAmount, formatDate } from '../../lib/format'
import { REQUEST_STATUS_META } from '../../lib/status-meta'
import type { EmployeeDetail } from '../../types/people-types'

export function PayrollTab({ employee }: { employee: EmployeeDetail }) {
  return (
    <Card>
      <CardHeader
        title="Payslip history"
        action={
          <Link to="/payroll/payslips" className="text-xs font-medium text-accent hover:underline">
            View all payslips →
          </Link>
        }
      />
      {employee.payslips.length > 0 ? (
        <div className="overflow-x-auto rounded-panel border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Period</th>
                <th className="px-4 py-3 font-medium">Pay date</th>
                <th className="px-4 py-3 font-medium">Net pay</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {employee.payslips.map((payslip) => {
                const statusMeta = REQUEST_STATUS_META[payslip.status]
                return (
                  <tr key={payslip.id}>
                    <td className="px-4 py-3 text-ink">{payslip.periodLabel}</td>
                    <td className="px-4 py-3 text-muted">{formatDate(payslip.payDate)}</td>
                    <td className="px-4 py-3 text-ink">{formatAmount(payslip.netPay, payslip.currency)}</td>
                    <td className="px-4 py-3">
                      <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-muted">No payslips generated yet.</p>
      )}
    </Card>
  )
}
