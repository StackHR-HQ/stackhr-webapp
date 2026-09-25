import { toApiEnum } from '../../../lib/api-enum'
import { http } from '../../../lib/http'
import type {
  AssignOnboardingTemplatePayload,
  CompanyDocument,
  CreateDepartmentPayload,
  CreateEmployeePayload,
  DecideLeaveRequestPayload,
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
  UpdateChecklistItemPayload,
  UpdateDepartmentPayload,
  UpdateEmployeePayload,
  UploadDocumentPayload,
} from '../types/people-types'


export const peopleApi = {
  async getEmployees(): Promise<EmployeeSummary[]> {
    const { data } = await http.get<EmployeeSummary[]>('/people/employees')
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

  async createEmployee({ firstName, lastName, employmentType, ...rest }: CreateEmployeePayload): Promise<void> {
    await http.post('/people/employees', {
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`.trim(),
      employmentType: toApiEnum(employmentType),
      ...rest,
    })
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

  async createDepartment(payload: CreateDepartmentPayload): Promise<void> {
    await http.post('/people/departments', payload)
  },

  async updateDepartment(id: string, payload: UpdateDepartmentPayload): Promise<void> {
    await http.patch(`/people/departments/${id}`, payload)
  },

  async deleteDepartment(id: string): Promise<void> {
    await http.delete(`/people/departments/${id}`)
  },

  async decideLeaveRequest({ requestId, decision, notes }: DecideLeaveRequestPayload): Promise<void> {
    await http.patch(`/people/leave/requests/${requestId}/decision`, { status: toApiEnum(decision), notes })
  },

  async uploadDocument({ file, name, category, scope }: UploadDocumentPayload): Promise<void> {
    const form = new FormData()
    form.append('file', file)
    form.append('name', name)
    form.append('category', category)
    form.append('scope', scope)
    await http.post('/people/documents', form)
  },

  async assignOnboardingTemplate(payload: AssignOnboardingTemplatePayload): Promise<void> {
    await http.post('/people/onboarding/employees', payload)
  },

  async updateChecklistItem({ employeeId, itemId, completed }: UpdateChecklistItemPayload): Promise<void> {
    await http.patch(`/people/onboarding/employees/${employeeId}/checklist/${itemId}`, { completed })
  },
}
