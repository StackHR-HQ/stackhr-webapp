import { InfoIcon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Badge } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import { SelectField } from '../../../../components/ui/select-field'
import { formatAmount, formatDate } from '../../lib/format'
import type { PayslipRecord } from '../../types/payroll-types'

export function EmployeePayslipsView({ payslips }: { payslips: PayslipRecord[] }) {
  const employees = useMemo(() => {
    const seen = new Map<string, string>()
    for (const payslip of payslips) seen.set(payslip.employeeId, payslip.employeeName)
    return Array.from(seen, ([employeeId, employeeName]) => ({ employeeId, employeeName }))
  }, [payslips])

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(employees[0]?.employeeId ?? '')
  const employeePayslips = payslips.filter((payslip) => payslip.employeeId === selectedEmployeeId)

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2.5 rounded-lg border border-line bg-canvas p-3 text-xs text-muted">
        <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          This view is admin-facing today. Employees will get direct access to their own payslip history from their
          account once employee self-service ships — the data here is already scoped per employee so that flow can
          reuse it directly.
        </p>
      </div>

      {employees.length === 0 ? (
        <p className="rounded-panel border border-dashed border-line p-8 text-center text-sm text-muted">
          No payslips generated yet.
        </p>
      ) : (
        <Card>
          <div className="max-w-xs">
            <SelectField
              label="Employee"
              value={selectedEmployeeId}
              onChange={(event) => setSelectedEmployeeId(event.target.value)}
              options={employees.map((employee) => ({ value: employee.employeeId, label: employee.employeeName }))}
            />
          </div>

          <div className="mt-5">
            <CardHeader title="Payslip history" />
            <ul className="divide-y divide-line">
              {employeePayslips.map((payslip) => (
                <li key={payslip.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-ink">{payslip.periodLabel}</p>
                    <p className="text-xs text-muted">{formatDate(payslip.payDate)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-ink">{formatAmount(payslip.netPay, payslip.currency)}</span>
                    <Badge tone={payslip.status === 'generated' ? 'positive' : 'neutral'}>
                      {payslip.status === 'generated' ? 'Generated' : 'Pending'}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}
    </div>
  )
}
