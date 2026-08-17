import { getRunMeta } from '../data/payroll-runs'
import { getEmployeesAsOf } from './employees-as-of'
import type { BonusPayout } from '../types/payroll-types'

const BONUS_RUN_ID = 'run-2026-08-bonus'

function hashOf(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 1000
  }
  return hash
}

export function getBonusPayouts(): BonusPayout[] {
  const meta = getRunMeta(BONUS_RUN_ID)
  if (!meta) return []

  const employees = getEmployeesAsOf(meta.payDate)

  return employees.map((employee) => {
    const hash = hashOf(employee.id)
    const monthlySalary = employee.compensation.salary / 12
    const bonusPercent = 0.1 + (hash % 21) / 100

    return {
      employeeId: employee.id,
      employeeName: employee.fullName,
      avatarInitials: employee.avatarInitials,
      amount: Math.round(monthlySalary * bonusPercent),
      currency: employee.compensation.currency,
      periodLabel: meta.periodLabel,
      payDate: meta.payDate,
      status: meta.status,
    }
  })
}
