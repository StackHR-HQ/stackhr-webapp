export interface CompanyInfo {
  name: string
  logoDataUrl?: string
  industry: string
  companySize: string
  taxId?: string
  currency: string
  payrollFrequency: string
  registrationNumber?: string
  businessType?: string
  website?: string
  foundedYear?: number
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  primaryColor?: string
  accentColor?: string
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
