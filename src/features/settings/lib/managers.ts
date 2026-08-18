import { EMPLOYEES } from '../../people/data/employees'
import { TEAM_MEMBERS } from '../data/team-members'
import type { ManagerInfo } from '../types/team-access-types'

export function getManagers(): ManagerInfo[] {
  const reportCounts = new Map<string, number>()
  for (const employee of EMPLOYEES) {
    if (!employee.managerId) continue
    reportCounts.set(employee.managerId, (reportCounts.get(employee.managerId) ?? 0) + 1)
  }

  return EMPLOYEES.filter((employee) => reportCounts.has(employee.id))
    .map((employee) => {
      const teamMember = TEAM_MEMBERS.find((member) => member.employeeId === employee.id)
      return {
        employeeId: employee.id,
        fullName: employee.fullName,
        avatarInitials: employee.avatarInitials,
        jobTitle: employee.jobTitle,
        directReportCount: reportCounts.get(employee.id) ?? 0,
        hasAccess: Boolean(teamMember),
        role: teamMember?.role,
      }
    })
    .sort((a, b) => b.directReportCount - a.directReportCount)
}
