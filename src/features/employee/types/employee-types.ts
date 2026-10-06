export interface MyLeaveBalance {
  allocatedDays: number
  usedDays: number
  pendingDays?: number
  remainingDays: number
  leaveType?: { id: string; name: string }
}

export interface MyLeaveRequest {
  id: string
  startDate: string
  endDate: string
  totalDays: number
  status: string
  leaveType?: { id: string; name: string }
  createdAt: string
  updatedAt: string
  decidedAt: string | null
}

export interface LeaveTypeOption {
  id: string
  name: string
  daysPerYear?: number
}

export interface LeaveRequestPayload {
  leaveTypeId: string
  startDate: string
  endDate: string
  reason?: string
}

export interface UpcomingLeave {
  startDate: string
  endDate: string
  typeName?: string
}

export interface LeaveSummary {
  hasBalances: boolean
  availableDays: number
  usedDays: number
  pendingRequests: number
  upcoming?: UpcomingLeave
}

export interface MyProfile {
  id: string
  employeeNumber: string | null
  fullName: string
  jobTitle: string | null
  department: string | null
  employmentStatus: string
  workLocation: string | null
  startDate: string | null
  nextPayDate: string | null
  manager: { id: string; fullName: string; jobTitle?: string | null } | null
  annualSalaryMinor: number | null
  currency: string | null
  payFrequency: string | null
  bankName: string | null
  accountNumber: string | null
  emergencyContactName: string | null
  emergencyContactPhone: string | null
  emergencyContactRelationship: string | null
  tin: string | null
  email: string
  personalEmail: string | null
  phone: string | null
  dateOfBirth: string | null
  gender: string | null
  address: string | null
  employmentType: string | null
  accountName: string | null
  bankAccountLast4: string | null
  pensionProvider: string | null
  pensionRsaNumber: string | null
  firstName: string | null
  lastName: string | null
  maritalStatus: string | null
  nationality: string | null
}

// Fields an employee can change via PATCH /me/profile; null clears a value.
export type ProfileUpdate = Partial<
  Pick<
    MyProfile,
    | 'firstName'
    | 'lastName'
    | 'dateOfBirth'
    | 'gender'
    | 'maritalStatus'
    | 'nationality'
    | 'phone'
    | 'personalEmail'
    | 'address'
    | 'emergencyContactName'
    | 'emergencyContactRelationship'
    | 'emergencyContactPhone'
    | 'bankName'
    | 'accountNumber'
    | 'accountName'
    | 'tin'
    | 'pensionProvider'
    | 'pensionRsaNumber'
  >
>

// Amounts are in minor units (kobo).
export interface MyPayslip {
  id: string
  periodMonth: number
  periodYear: number
  netSalary: number
  createdAt?: string
}

export interface MySpendRequest {
  id: string
  status: string
  createdAt: string
  updatedAt?: string
}

export type ActivityTone = 'accent' | 'positive' | 'critical' | 'muted'

export interface MyActivityItem {
  id: string
  kind: 'leave' | 'payslip' | 'expense' | 'salary-advance'
  label: string
  timestamp: string
  tone: ActivityTone
}
