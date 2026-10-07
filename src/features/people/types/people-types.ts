export type EmploymentStatus = 'active' | 'pending_invitation' | 'onboarding' | 'offboarding'
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Intern'

export interface Department {
  id: string
  name: string
  headEmployeeId: string | null
}

export interface Team {
  id: string
  name: string
  description: string
  leadEmployeeId: string | null
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

// GET /people/employees returns a flat array by default, and switches to this
// paginated shape once page/pageSize query params are supplied (confirmed live).
export interface EmployeeDirectoryParams {
  page: number
  pageSize: number
  search?: string
  employmentStatus?: EmploymentStatus
}

export interface PaginatedEmployees {
  items: EmployeeSummary[]
  page: number
  pageSize: number
  total: number
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
  bankName: string | null
  bankAccountLast4: string | null
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
  status: 'pending' | 'approved' | 'rejected' | 'disbursed' | 'repaid'
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

export interface EmployeeRef {
  employeeId: string
  employeeName: string
  avatarInitials: string
}

export type LeaveTypeTone = 'accent' | 'positive' | 'warning' | 'critical' | 'neutral'

export interface LeaveType {
  id: string
  name: string
  defaultDays: number
  paid: boolean
  tone: LeaveTypeTone
  description: string
}

export interface LeavePolicy {
  id: string
  title: string
  description: string
}

export interface LeaveRequestWithEmployee extends LeaveRequestEntry, EmployeeRef {}

export interface EmployeeLeaveBalanceRow extends EmployeeRef {
  balances: LeaveBalanceEntry[]
}

export interface CompanyDocument {
  id: string
  name: string
  category: string
  uploadedAt: string
  fileSize: string
  visibility: string
}

export interface DocumentTemplate {
  id: string
  name: string
  category: string
  description: string
}

export interface EmployeeDocumentRow extends DocumentEntry, EmployeeRef {}

export interface ChecklistItem {
  id: string
  label: string
  stage: string
}

export interface OnboardingTemplate {
  id: string
  name: string
  departmentIds: string[]
  checklist: ChecklistItem[]
}

export interface EmployeeOnboardingRow extends EmployeeRef {
  jobTitle: string
  startDate: string
  templateId: string
  completedItemIds: string[]
}

// Matches the confirmed-live POST /people/employees contract: a nested
// personal/employment/compensation body, salary in minor currency units.
export interface CreateEmployeePayload {
  firstName: string
  lastName: string
  workEmail: string
  phone?: string
  jobTitle: string
  departmentId?: string
  managerId?: string
  employmentType: EmploymentType
  startDate: string
  workLocation?: string
  annualSalaryMinor: number
  currency: string
  payFrequency: string
  sendInvitation: boolean
}

// Department, employment type, start date and status can't be changed through this endpoint.
// Enum fields (employmentType, status) go over the wire in API casing, e.g. FULL_TIME.
export interface UpdateEmployeePayload {
  jobTitle?: string
  departmentId?: string | null
  managerId?: string | null
  employmentType?: string
  startDate?: string
  status?: string
  workLocation?: string | null
}

// Departments and teams own their membership atomically: this list replaces
// the full member set and head/lead on every write, matching the confirmed
// backend contract.
export interface DepartmentInput {
  name: string
  headEmployeeId: string | null
  memberIds: string[]
}

export interface TeamInput {
  name: string
  description: string
  leadEmployeeId: string | null
  memberIds: string[]
}

export type LeaveDecision = 'approved' | 'rejected'

export interface DecideLeaveRequestPayload {
  id: string
  status: LeaveDecision
}

export interface UploadDocumentPayload {
  file: File
  name: string
  category: string
  scope: 'company' | 'employee'
  employeeId?: string
}

export interface UploadDocumentResult {
  scope: 'company' | 'employee'
  document: CompanyDocument | EmployeeDocumentRow
}

export interface AssignOnboardingTemplatePayload {
  employeeId: string
  templateId: string
}
