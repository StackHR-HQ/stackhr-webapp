import { toApiEnum } from '../../../lib/api-enum'
import { http } from '../../../lib/http'
import type {
  AssignOnboardingTemplatePayload,
  CompanyDocument,
  CreateEmployeePayload,
  DecideLeaveRequestPayload,
  Department,
  DepartmentInput,
  DocumentTemplate,
  EmployeeDetail,
  EmployeeDirectoryParams,
  EmployeeDocumentRow,
  EmployeeLeaveBalanceRow,
  EmployeeOnboardingRow,
  EmployeeSummary,
  LeavePolicy,
  LeaveRequestWithEmployee,
  LeaveType,
  OnboardingTemplate,
  PaginatedEmployees,
  Team,
  TeamInput,
  UpdateEmployeePayload,
  UploadDocumentPayload,
  UploadDocumentResult,
} from '../types/people-types'

export const peopleApi = {
  async getEmployees(): Promise<EmployeeSummary[]> {
    const { data } = await http.get<EmployeeSummary[]>('/people/employees')
    return data
  },

  // Same endpoint, but passing page/pageSize switches the response to this
  // paginated shape (confirmed live).
  async getEmployeeDirectory(params: EmployeeDirectoryParams): Promise<PaginatedEmployees> {
    const { data } = await http.get<PaginatedEmployees>('/people/employees', {
      params: {
        page: params.page,
        pageSize: params.pageSize,
        search: params.search?.trim() || undefined,
        employmentStatus: params.employmentStatus,
      },
    })
    return data
  },

  async getEmployee(id: string): Promise<EmployeeDetail | null> {
    const { data } = await http.get<EmployeeDetail>(`/people/employees/${id}`)
    return data
  },

  async getDepartments(): Promise<Department[]> {
    const { data } = await http.get<Department[]>('/people/departments')
    return data
  },

  async getTeams(): Promise<Team[]> {
    const { data } = await http.get<Team[]>('/people/teams')
    return data
  },

  async createTeam(payload: TeamInput): Promise<Team> {
    const { data } = await http.post<Team>('/people/teams', payload)
    return data
  },

  async updateTeam(id: string, payload: TeamInput): Promise<Team> {
    const { data } = await http.patch<Team>(`/people/teams/${id}`, payload)
    return data
  },

  async deleteTeam(id: string): Promise<void> {
    await http.delete(`/people/teams/${id}`)
  },

  async getLeaveTypes(): Promise<LeaveType[]> {
    const { data } = await http.get<LeaveType[]>('/people/leave/types')
    return data
  },

  async getLeavePolicies(): Promise<LeavePolicy[]> {
    const { data } = await http.get<LeavePolicy[]>('/people/leave/policies')
    return data
  },

  async getLeaveRequests(): Promise<LeaveRequestWithEmployee[]> {
    const { data } = await http.get<LeaveRequestWithEmployee[]>('/people/leave/requests')
    return data
  },

  async getLeaveBalances(): Promise<EmployeeLeaveBalanceRow[]> {
    const { data } = await http.get<EmployeeLeaveBalanceRow[]>('/people/leave/balances')
    return data
  },

  async getCompanyDocuments(): Promise<CompanyDocument[]> {
    const { data } = await http.get<CompanyDocument[]>('/people/documents/company')
    return data
  },

  async getDocumentTemplates(): Promise<DocumentTemplate[]> {
    const { data } = await http.get<DocumentTemplate[]>('/people/documents/templates')
    return data
  },

  async getEmployeeDocuments(): Promise<EmployeeDocumentRow[]> {
    const { data } = await http.get<EmployeeDocumentRow[]>('/people/documents/employees')
    return data
  },

  async getOnboardingTemplates(): Promise<OnboardingTemplate[]> {
    const { data } = await http.get<OnboardingTemplate[]>('/people/onboarding/templates')
    return data
  },

  async getEmployeeOnboarding(): Promise<EmployeeOnboardingRow[]> {
    const { data } = await http.get<EmployeeOnboardingRow[]>('/people/onboarding/employees')
    return data
  },

  // Confirmed live: a nested personal/employment/compensation body.
  async createEmployee(payload: CreateEmployeePayload): Promise<EmployeeSummary> {
    const { data } = await http.post<EmployeeSummary>('/people/employees', {
      personal: { firstName: payload.firstName, lastName: payload.lastName, workEmail: payload.workEmail, phone: payload.phone },
      employment: {
        jobTitle: payload.jobTitle,
        departmentId: payload.departmentId || undefined,
        managerId: payload.managerId || undefined,
        employmentType: toApiEnum(payload.employmentType),
        startDate: payload.startDate,
        workLocation: payload.workLocation,
      },
      compensation: {
        annualSalaryMinor: payload.annualSalaryMinor,
        currency: payload.currency,
        payFrequency: payload.payFrequency,
      },
      sendInvitation: payload.sendInvitation,
    })
    return data
  },

  async updateEmployee(id: string, { jobTitle, employmentStatus }: UpdateEmployeePayload): Promise<void> {
    await http.patch(`/people/employees/${id}`, {
      jobTitle,
      status: employmentStatus ? toApiEnum(employmentStatus) : undefined,
    })
  },

  async resendEmployeeInvitation(employeeId: string): Promise<void> {
    await http.post(`/people/employees/${employeeId}/invitations`)
  },

  // Departments own their membership atomically: every write replaces the
  // full member set and head.
  async createDepartment(payload: DepartmentInput): Promise<Department> {
    const { data } = await http.post<Department>('/people/departments', payload)
    return data
  },

  async updateDepartment(id: string, payload: DepartmentInput): Promise<Department> {
    const { data } = await http.patch<Department>(`/people/departments/${id}`, payload)
    return data
  },

  async deleteDepartment(id: string): Promise<void> {
    await http.delete(`/people/departments/${id}`)
  },

  async decideLeaveRequest({ id, status }: DecideLeaveRequestPayload): Promise<LeaveRequestWithEmployee> {
    const { data } = await http.patch<LeaveRequestWithEmployee>(`/people/leave/requests/${id}/decision`, {
      status: toApiEnum(status),
    })
    return data
  },

  async uploadDocument({ file, name, category, scope, employeeId }: UploadDocumentPayload): Promise<UploadDocumentResult> {
    const form = new FormData()
    form.append('file', file)
    form.append('name', name)
    form.append('category', category)
    form.append('scope', scope)
    if (employeeId) form.append('employeeId', employeeId)
    const { data } = await http.post<UploadDocumentResult>('/people/documents', form)
    return data
  },

  async assignOnboardingTemplate(payload: AssignOnboardingTemplatePayload): Promise<void> {
    await http.post('/people/onboarding/employees', payload)
  },

  async updateOnboardingChecklist(employeeId: string, itemId: string, completed: boolean): Promise<EmployeeOnboardingRow> {
    const { data } = await http.patch<EmployeeOnboardingRow>(
      `/people/onboarding/employees/${employeeId}/checklist/${itemId}`,
      { completed },
    )
    return data
  },
}
