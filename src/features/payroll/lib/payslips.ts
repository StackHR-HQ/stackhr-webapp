import { PAYROLL_RUNS } from '../data/payroll-runs'
import { getEmployeesAsOf } from './employees-as-of'
import { calculateRunLines } from './payroll-calculation'
import { getStatutoryContributions } from './statutory-contributions'
import type { PayrollRunStatus, PayslipRecord } from '../types/payroll-types'

const PAYSLIP_ELIGIBLE_STATUSES: PayrollRunStatus[] = ['processing', 'pending_approval', 'approved', 'completed']

export function getPayslips(): PayslipRecord[] {
  return PAYROLL_RUNS.filter((run) => PAYSLIP_ELIGIBLE_STATUSES.includes(run.status))
    .flatMap((run) => {
      const employees = getEmployeesAsOf(run.payDate)
      const statutoryContributions = getStatutoryContributions(employees.length)
      const lines = calculateRunLines(employees, run.taxRuleSetId, statutoryContributions)

      return lines.map((line) => ({
        id: `${run.id}-${line.employeeId}`,
        runId: run.id,
        employeeId: line.employeeId,
        employeeName: line.employeeName,
        avatarInitials: line.avatarInitials,
        periodLabel: run.periodLabel,
        payDate: run.payDate,
        netPay: line.netPay,
        currency: 'NGN',
        status: run.status === 'completed' ? ('generated' as const) : ('pending' as const),
      }))
    })
    .sort((a, b) => new Date(b.payDate).getTime() - new Date(a.payDate).getTime())
}
