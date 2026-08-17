import { getTemplateForDepartment } from '../data/onboarding-templates'
import type { EmployeeSeed } from '../data/employees'
import type { EmployeeOnboardingRow } from '../types/people-types'
import { hashOf } from './hash'

export function deriveOnboardingRow(seed: EmployeeSeed): EmployeeOnboardingRow {
  const template = getTemplateForDepartment(seed.departmentId)
  const hash = hashOf(seed.id)

  const completedItemIds =
    seed.employmentStatus === 'pending_invitation'
      ? []
      : template.checklist.filter((_, index) => (hash + index * 13) % 5 !== 0).map((item) => item.id)

  return {
    employeeId: seed.id,
    employeeName: seed.fullName,
    avatarInitials: seed.avatarInitials,
    jobTitle: seed.jobTitle,
    startDate: seed.startDate,
    templateId: template.id,
    completedItemIds,
  }
}
