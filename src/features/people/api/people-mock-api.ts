import { DEPARTMENTS } from '../data/departments'
import { EMPLOYEES, getEmployeeSeed, type EmployeeSeed } from '../data/employees'
import { TEAMS } from '../data/teams'
import {
  deriveActivity,
  deriveDocuments,
  deriveExpenses,
  deriveLeaveBalance,
  deriveLeaveRequests,
  derivePayslips,
  deriveSalaryAdvances,
} from '../lib/employee-derived'
import type { Department, EmployeeDetail, EmployeeSummary, Team } from '../types/people-types'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function toSummary(seed: EmployeeSeed): EmployeeSummary {
  return {
    id: seed.id,
    fullName: seed.fullName,
    email: seed.email,
    avatarInitials: seed.avatarInitials,
    jobTitle: seed.jobTitle,
    departmentId: seed.departmentId,
    managerId: seed.managerId,
    employmentType: seed.employmentType,
    employmentStatus: seed.employmentStatus,
    startDate: seed.startDate,
  }
}

function toDetail(seed: EmployeeSeed): EmployeeDetail {
  return {
    ...toSummary(seed),
    workLocation: seed.workLocation,
    personalInfo: seed.personalInfo,
    compensation: seed.compensation,
    leaveBalance: deriveLeaveBalance(seed),
    leaveRequests: deriveLeaveRequests(seed),
    documents: deriveDocuments(seed),
    payslips: derivePayslips(seed),
    expenses: deriveExpenses(seed),
    salaryAdvances: deriveSalaryAdvances(seed),
    activity: deriveActivity(seed),
  }
}

export const mockPeopleApi = {
  async getEmployees(): Promise<EmployeeSummary[]> {
    await delay(400)
    return EMPLOYEES.map(toSummary)
  },

  async getEmployee(id: string): Promise<EmployeeDetail | null> {
    await delay(400)
    const seed = getEmployeeSeed(id)
    return seed ? toDetail(seed) : null
  },

  async getDepartments(): Promise<Department[]> {
    await delay(300)
    return DEPARTMENTS
  },

  async getTeams(): Promise<Team[]> {
    await delay(300)
    return TEAMS
  },
}
