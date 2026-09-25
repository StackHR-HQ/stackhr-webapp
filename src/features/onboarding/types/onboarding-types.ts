export interface CompanyInfo {
  name: string
  logoDataUrl?: string
  industry: string
  companySize: string
  taxId?: string
  currency: string
  payrollFrequency: string
}

export interface EmployeeDraft {
  id: string
  fullName: string
  email: string
  department: string
  jobTitle: string
  employmentType: string
  salary: number
  startDate: string
  managerId?: string
  managerName?: string
  source: 'manual' | 'csv'
}

export type NewEmployeeDraft = Omit<EmployeeDraft, 'id'>

export interface CompleteOnboardingPayload {
  companyInfo: CompanyInfo
  employees: EmployeeDraft[]
}

export interface CompleteOnboardingResult {
  failedInvitations: string[]
}

export class OnboardingError extends Error {}
