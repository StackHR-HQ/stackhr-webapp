import { http } from '../../../lib/http'
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

export type LeaveDecision = 'approved' | 'rejected'

export type DocumentUploadPayload = {
  file: File
  name: string
  category: string
  scope: 'company' | 'employee'
  employeeId?: string
}

// Real backend calls. Not wired up yet — the endpoints don't exist. Kept
// behind the same shape as people-mock-api.ts so people-service.ts can swap
// to this by flipping VITE_USE_MOCK_AUTH once the backend is live.
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

  async decideLeaveRequest(id: string, status: LeaveDecision): Promise<LeaveRequestWithEmployee> {
    const { data } = await http.patch<LeaveRequestWithEmployee>(`/people/leave/requests/${id}/decision`, { status })
    return data
  },

  async uploadDocument(payload: DocumentUploadPayload): Promise<{ scope: 'company' | 'employee'; document: CompanyDocument | EmployeeDocumentRow }> {
    const body = new FormData()
    body.append('file', payload.file)
    body.append('name', payload.name)
    body.append('category', payload.category)
    body.append('scope', payload.scope)
    if (payload.employeeId) body.append('employeeId', payload.employeeId)

    const { data } = await http.post<{ scope: 'company' | 'employee'; document: CompanyDocument | EmployeeDocumentRow }>('/people/documents', body)
    return data
  },

  async updateOnboardingChecklist(employeeId: string, itemId: string, completed: boolean): Promise<EmployeeOnboardingRow> {
    const { data } = await http.patch<EmployeeOnboardingRow>(
      `/people/onboarding/employees/${employeeId}/checklist/${itemId}`,
      { completed },
    )
    return data
  },
}
