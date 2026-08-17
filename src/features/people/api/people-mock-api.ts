import { COMPANY_DOCUMENTS, DOCUMENT_TEMPLATES } from '../data/company-documents'
import { DEPARTMENTS } from '../data/departments'
import { EMPLOYEES, getEmployeeSeed, type EmployeeSeed } from '../data/employees'
import { LEAVE_POLICIES, LEAVE_TYPES } from '../data/leave-catalog'
import { ONBOARDING_TEMPLATES } from '../data/onboarding-templates'
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
import { deriveOnboardingRow } from '../lib/onboarding-derived'
import type {
  CompanyDocument,
  Department,
  DocumentTemplate,
  EmployeeDetail,
  EmployeeDocumentRow,
  EmployeeLeaveBalanceRow,
  EmployeeOnboardingRow,
  EmployeeSummary,
  LeavePolicy,
  LeaveRequestWithEmployee,
  LeaveType,
  OnboardingTemplate,
  Team,
} from '../types/people-types'

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

  async getLeaveTypes(): Promise<LeaveType[]> {
    await delay(300)
    return LEAVE_TYPES
  },

  async getLeavePolicies(): Promise<LeavePolicy[]> {
    await delay(300)
    return LEAVE_POLICIES
  },

  async getLeaveRequests(): Promise<LeaveRequestWithEmployee[]> {
    await delay(400)
    return EMPLOYEES.flatMap((seed) =>
      deriveLeaveRequests(seed).map((request) => ({
        ...request,
        employeeId: seed.id,
        employeeName: seed.fullName,
        avatarInitials: seed.avatarInitials,
      })),
    ).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
  },

  async getLeaveBalances(): Promise<EmployeeLeaveBalanceRow[]> {
    await delay(400)
    return EMPLOYEES.map((seed) => ({
      employeeId: seed.id,
      employeeName: seed.fullName,
      avatarInitials: seed.avatarInitials,
      balances: deriveLeaveBalance(seed),
    }))
  },

  async getCompanyDocuments(): Promise<CompanyDocument[]> {
    await delay(300)
    return COMPANY_DOCUMENTS
  },

  async getDocumentTemplates(): Promise<DocumentTemplate[]> {
    await delay(300)
    return DOCUMENT_TEMPLATES
  },

  async getEmployeeDocuments(): Promise<EmployeeDocumentRow[]> {
    await delay(400)
    return EMPLOYEES.flatMap((seed) =>
      deriveDocuments(seed).map((document) => ({
        ...document,
        employeeId: seed.id,
        employeeName: seed.fullName,
        avatarInitials: seed.avatarInitials,
      })),
    )
  },

  async getOnboardingTemplates(): Promise<OnboardingTemplate[]> {
    await delay(300)
    return ONBOARDING_TEMPLATES
  },

  async getEmployeeOnboarding(): Promise<EmployeeOnboardingRow[]> {
    await delay(400)
    return EMPLOYEES.filter(
      (seed) => seed.employmentStatus === 'onboarding' || seed.employmentStatus === 'pending_invitation',
    ).map(deriveOnboardingRow)
  },
}
