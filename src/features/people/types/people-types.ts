export type EmploymentStatus = 'active' | 'pending_invitation' | 'onboarding' | 'offboarding'
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Intern'

export interface Department {
  id: string
  name: string
  headEmployeeId: string
}

export interface Team {
  id: string
  name: string
  description: string
  leadEmployeeId: string
  memberIds: string[]
}

export interface EmployeeSummary {
  id: string
  fullName: string
  email: string
  avatarInitials: string
  jobTitle: string
  departmentId: string
  managerId: string | null
  employmentType: EmploymentType
  employmentStatus: EmploymentStatus
  startDate: string
}

export interface PersonalInfo {
  dateOfBirth: string
  gender: string
  maritalStatus: string
  nationality: string
  phone: string
  address: string
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelationship: string
}

export interface CompensationInfo {
  salary: number
  currency: string
  payFrequency: string
  bankName: string
  bankAccountLast4: string
}

export interface LeaveBalanceEntry {
  type: string
  totalDays: number
  usedDays: number
}

export interface LeaveRequestEntry {
  id: string
  type: string
  startDate: string
  endDate: string
  days: number
  status: 'pending' | 'approved' | 'rejected'
}

export interface DocumentEntry {
  id: string
  name: string
  category: string
  uploadedAt: string
  fileSize: string
}

export interface PayslipEntry {
  id: string
  periodLabel: string
  payDate: string
  netPay: number
  currency: string
  status: 'paid' | 'processing'
}

export interface ExpenseEntry {
  id: string
  date: string
  category: string
  description: string
  amount: number
  currency: string
  status: 'pending' | 'approved' | 'rejected'
}

export interface SalaryAdvanceEntry {
  id: string
  requestedAt: string
  amount: number
  currency: string
  repaymentMonths: number
  status: 'pending' | 'approved' | 'rejected' | 'repaid'
}

export interface ActivityEntry {
  id: string
  description: string
  timestamp: string
}

export interface EmployeeDetail extends EmployeeSummary {
  workLocation: string
  personalInfo: PersonalInfo
  compensation: CompensationInfo
  leaveBalance: LeaveBalanceEntry[]
  leaveRequests: LeaveRequestEntry[]
  documents: DocumentEntry[]
  payslips: PayslipEntry[]
  expenses: ExpenseEntry[]
  salaryAdvances: SalaryAdvanceEntry[]
  activity: ActivityEntry[]
}
