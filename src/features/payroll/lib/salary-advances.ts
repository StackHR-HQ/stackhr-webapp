import { EMPLOYEES } from '../../people/data/employees'
import { deriveSalaryAdvances } from '../../people/lib/employee-derived'
import type { SalaryAdvanceStatusEntry } from '../types/payroll-types'

export function getSalaryAdvances(): SalaryAdvanceStatusEntry[] {
  return EMPLOYEES.flatMap((employee) =>
    deriveSalaryAdvances(employee).map((advance) => ({
      id: advance.id,
      employeeId: employee.id,
      employeeName: employee.fullName,
      avatarInitials: employee.avatarInitials,
      requestedAt: advance.requestedAt,
      amount: advance.amount,
      currency: advance.currency,
      repaymentMonths: advance.repaymentMonths,
      status: advance.status,
    })),
  ).sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())
}
