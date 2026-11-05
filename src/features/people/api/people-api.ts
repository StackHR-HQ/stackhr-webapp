import { isAxiosError } from 'axios'
import { toApiEnum } from '../../../lib/api-enum'
import type { LeaveTypeFormValues } from '../schemas/leave-type-schema'
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
  EmployeeImportResult,
  LeaveRequestDetail,
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
  UpdateEmployeePayload,
  UploadDocumentPayload,
  UploadDocumentResult,
} from '../types/people-types'

// Departments without a head come back with headEmployeeId "", which the
// backend rejects if sent back on update; only a UUID or null is accepted.
const toDepartment = (department: Department): Department => ({
  ...department,
  headEmployeeId: department.headEmployeeId || null,
})

// Reads the file name from e.g. `attachment; filename="Offer Letter.pdf"`,
// preferring the RFC 5987 filename* form when it's there.
function fileNameFromDisposition(header: unknown): string | undefined {
  if (typeof header !== 'string') return undefined
  const encoded = /filename\*=UTF-8''([^;]+)/i.exec(header)?.[1]
  if (encoded) {
    try {
      return decodeURIComponent(encoded.trim())
    } catch {
      // fall through to the plain filename
    }
  }
  // Anchored to a parameter start so a malformed filename*= isn't read as filename=.
  return /(?:^|;)\s*filename="?([^";]+)"?/i.exec(header)?.[1]?.trim() || undefined
}

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
    return data.map(toDepartment)
  },

  async getLeaveTypes(): Promise<LeaveType[]> {
    const { data } = await http.get<LeaveType[]>('/people/leave/types')
    return data
  },

  async getLeavePolicies(): Promise<LeavePolicy[]> {
    const { data } = await http.get<LeavePolicy[]>('/people/leave/policies')
    return data
  },

  async createLeaveType(payload: LeaveTypeFormValues): Promise<void> {
    await http.post('/leave/types', { ...payload, description: payload.description || undefined })
  },

  async updateLeaveType(id: string, payload: LeaveTypeFormValues): Promise<void> {
    await http.patch(`/leave/types/${id}`, { ...payload, description: payload.description || undefined })
  },

  async deleteLeaveType(id: string): Promise<void> {
    await http.delete(`/leave/types/${id}`)
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

  // Confirmed live: fields go under a nested `employment` object, like createEmployee.
  async updateEmployee(id: string, employment: UpdateEmployeePayload): Promise<void> {
    await http.patch(`/people/employees/${id}`, { employment })
  },

  async resendEmployeeInvitation(employeeId: string): Promise<void> {
    await http.post(`/people/employees/${employeeId}/invitations`)
  },

  // Departments own their membership atomically: every write replaces the
  // full member set and head.
  async createDepartment(payload: DepartmentInput): Promise<Department> {
    const { data } = await http.post<Department>('/people/departments', payload)
    return toDepartment(data)
  },

  async updateDepartment(id: string, payload: DepartmentInput): Promise<Department> {
    const { data } = await http.patch<Department>(`/people/departments/${id}`, payload)
    return toDepartment(data)
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

  // Streams the file. Admins can download any document in the organization;
  // employees only their own and company-wide ones.
  async downloadDocument(id: string): Promise<{ blob: Blob; fileName?: string }> {
    try {
      const response = await http.get<Blob>(`/people/documents/${id}/download`, { responseType: 'blob' })
      return { blob: response.data, fileName: fileNameFromDisposition(response.headers['content-disposition']) }
    } catch (err) {
      // Error bodies arrive as a Blob too; parse them so the API's message reaches the user.
      if (isAxiosError(err) && err.response?.data instanceof Blob) {
        try {
          err.response.data = JSON.parse(await err.response.data.text())
        } catch {
          // not JSON; leave it for the generic message
        }
      }
      throw err
    }
  },

  async getLeaveRequest(id: string): Promise<LeaveRequestDetail> {
    const { data } = await http.get<{
      leaveRequest: {
        id: string
        startDate: string
        endDate: string
        totalDays?: number
        days?: number
        reason: string | null
        status: string
        createdAt: string
        decidedAt: string | null
        leaveType: { name: string; paid?: boolean } | null
      }
    }>(`/leave/requests/${id}`) // No /people/ equivalent on staging; admin access is unconfirmed.
    const request = data.leaveRequest
    return {
      leaveType: request.leaveType?.name ?? 'Leave',
      paid: request.leaveType?.paid ?? null,
      startDate: request.startDate,
      endDate: request.endDate,
      days: request.totalDays ?? request.days ?? 0,
      reason: request.reason || null,
      status: request.status.toLowerCase(),
      submittedAt: request.createdAt,
      decidedAt: request.decidedAt,
    }
  },

  // Bulk-creates employees from raw CSV text. The response isn't documented,
  // so whatever counts and errors it returns are read leniently.
  async importEmployees(csv: string): Promise<EmployeeImportResult> {
    const { data } = await http.post<Record<string, unknown>>('/onboarding/employees/import', { csv })
    const count = (...keys: string[]) => {
      for (const key of keys) {
        const value = data?.[key]
        if (typeof value === 'number') return value
        if (Array.isArray(value)) return value.length
      }
      return null
    }
    const errors = data?.errors ?? data?.failed ?? data?.failures
    return {
      imported: count('imported', 'importedCount', 'created', 'createdCount', 'employees', 'success'),
      errors: Array.isArray(errors)
        ? errors.map((error) => {
            if (typeof error === 'string') return error
            const line = [
              error?.row != null ? `Row ${error.row}` : error?.email,
              error?.message ?? error?.reason ?? error?.error,
            ]
              .filter(Boolean)
              .join(': ')
            // An unfamiliar shape is still shown rather than left as a blank bullet.
            return line || JSON.stringify(error) || 'A row was skipped for an unknown reason.'
          })
        : [],
    }
  },

  async assignOnboardingTemplate(payload: AssignOnboardingTemplatePayload): Promise<void> {
    await http.post('/people/onboarding/employees', payload)
  },

  // Checks every checklist task is done, then sets the employee to ACTIVE.
  async completeOnboarding(employeeId: string): Promise<void> {
    await http.post(`/people/onboarding/employees/${employeeId}/complete`)
  },

  async updateOnboardingChecklist(employeeId: string, itemId: string, completed: boolean): Promise<EmployeeOnboardingRow> {
    const { data } = await http.patch<EmployeeOnboardingRow>(
      `/people/onboarding/employees/${employeeId}/checklist/${itemId}`,
      { completed },
    )
    return data
  },
}
