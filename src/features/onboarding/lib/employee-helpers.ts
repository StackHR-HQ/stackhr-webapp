import { currencySymbol } from '../constants/onboarding-options'
import type { EmployeeDraft } from '../types/onboarding-types'

export function getManagerLabel(employee: EmployeeDraft, allEmployees: EmployeeDraft[]): string {
  if (employee.managerId) {
    return allEmployees.find((candidate) => candidate.id === employee.managerId)?.fullName ?? '—'
  }
  return employee.managerName?.trim() || '—'
}

export function formatSalary(salary: number, currencyCode: string): string {
  return `${currencySymbol(currencyCode)}${salary.toLocaleString()}`
}

const SAMPLE_CSV_ROWS = [
  ['fullName', 'email', 'department', 'jobTitle', 'employmentType', 'salary', 'startDate', 'manager'],
  ['Ada Obi', 'ada.obi@example.com', 'Engineering', 'Software Engineer', 'Full-time', '450000', '2026-01-15', ''],
  ['Chuka Eze', 'chuka.eze@example.com', 'Sales', 'Sales Manager', 'Full-time', '600000', '2026-02-01', 'Ada Obi'],
]

export function buildSampleEmployeeCsv(): string {
  return SAMPLE_CSV_ROWS.map((row) => row.map((cell) => (cell.includes(',') ? `"${cell}"` : cell)).join(',')).join(
    '\n',
  )
}
