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
import type { DepartmentInput, DocumentUploadPayload, EmployeeDirectoryParams, LeaveDecision, PaginatedEmployees } from './people-api'

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

  async getEmployeeDirectory(params: EmployeeDirectoryParams): Promise<PaginatedEmployees> {
    await delay(400)
    const search = params.search?.trim().toLowerCase()
    const matching = EMPLOYEES.map(toSummary)
      .filter((employee) => !params.employmentStatus || employee.employmentStatus === params.employmentStatus)
      .filter(
        (employee) =>
          !search ||
          employee.fullName.toLowerCase().includes(search) ||
          employee.email.toLowerCase().includes(search) ||
          employee.jobTitle.toLowerCase().includes(search),
      )
      .sort((a, b) => a.fullName.localeCompare(b.fullName) || a.id.localeCompare(b.id))
    const start = (params.page - 1) * params.pageSize
    return { items: matching.slice(start, start + params.pageSize), page: params.page, pageSize: params.pageSize, total: matching.length }
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

  async createDepartment(payload: DepartmentInput): Promise<Department> {
    await delay(350)
    const name = payload.name.trim()
    if (!name) throw new Error('Department name is required.')
    if (DEPARTMENTS.some((department) => department.name.toLowerCase() === name.toLowerCase())) {
      throw new Error('A department with this name already exists.')
    }
    if (payload.headEmployeeId && !payload.memberIds.includes(payload.headEmployeeId)) {
      throw new Error('The department head must be a department member.')
    }
    const department = { id: `department_${Date.now()}`, name, headEmployeeId: payload.headEmployeeId }
    DEPARTMENTS.push(department)
    for (const employee of EMPLOYEES) {
      if (payload.memberIds.includes(employee.id)) employee.departmentId = department.id
    }
    return department
  },

  async updateDepartment(id: string, payload: DepartmentInput): Promise<Department> {
    await delay(350)
    const department = DEPARTMENTS.find((item) => item.id === id)
    if (!department) throw new Error('Department not found.')
    const name = payload.name.trim()
    if (!name) throw new Error('Department name is required.')
    if (DEPARTMENTS.some((item) => item.id !== id && item.name.toLowerCase() === name.toLowerCase())) {
      throw new Error('A department with this name already exists.')
    }
    if (payload.headEmployeeId && !payload.memberIds.includes(payload.headEmployeeId)) {
      throw new Error('The department head must be a department member.')
    }
    department.name = name
    department.headEmployeeId = payload.headEmployeeId
    for (const employee of EMPLOYEES) {
      if (employee.departmentId === id && !payload.memberIds.includes(employee.id)) employee.departmentId = ''
      if (payload.memberIds.includes(employee.id)) employee.departmentId = id
    }
    return department
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

  async decideLeaveRequest(id: string, status: LeaveDecision): Promise<LeaveRequestWithEmployee> {
    const request = (await this.getLeaveRequests()).find((item) => item.id === id)
    if (!request) throw new Error('Leave request not found.')
    return { ...request, status }
  },

  async uploadDocument(payload: DocumentUploadPayload): Promise<{ scope: 'company' | 'employee'; document: CompanyDocument | EmployeeDocumentRow }> {
    await delay(500)
    const document = {
      id: `document_${Date.now()}`,
      name: payload.name,
      category: payload.category,
      uploadedAt: new Date().toISOString(),
      fileSize: `${Math.ceil(payload.file.size / 1024)} KB`,
    }
    if (payload.scope === 'company') return { scope: 'company', document: { ...document, visibility: 'All employees' } }

    const employee = EMPLOYEES.find((item) => item.id === payload.employeeId)
    if (!employee) throw new Error('Employee not found.')
    return {
      scope: 'employee',
      document: { ...document, employeeId: employee.id, employeeName: employee.fullName, avatarInitials: employee.avatarInitials },
    }
  },

  async updateOnboardingChecklist(employeeId: string, itemId: string, completed: boolean): Promise<EmployeeOnboardingRow> {
    const row = (await this.getEmployeeOnboarding()).find((item) => item.employeeId === employeeId)
    if (!row) throw new Error('Onboarding employee not found.')
    const completedItemIds = new Set(row.completedItemIds)
    if (completed) completedItemIds.add(itemId)
    else completedItemIds.delete(itemId)
    return { ...row, completedItemIds: [...completedItemIds] }
  },
}
