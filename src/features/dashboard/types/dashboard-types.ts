export interface PayrollStatusSummary {
  id: string
  title: string
  periodLabel: string
  status: string
  totalGross: number
  totalNet: number
  currency: string
  employeesIncluded: number
  employeesTotal: number
}

export interface UpcomingPayrollRun {
  id: string
  title: string
  periodLabel: string
  payDate?: string
  status: string
}

export type ApprovalCategoryKey = 'employee-changes' | 'leave' | 'expenses' | 'reimbursements' | 'salary-advances' | 'other'

export interface ApprovalItem {
  id: string
  requesterId: string
  title: string
  detail: string
  submittedAt: string
  amount?: number
  currency?: string
}

export interface ApprovalCategory {
  key: ApprovalCategoryKey
  label: string
  items: ApprovalItem[]
  viewAllPath: string
}

export type ActivityKind =
  | 'payroll'
  | 'leave'
  | 'expense'
  | 'reimbursement'
  | 'salary-advance'
  | 'employee'
  | 'compliance'
  | 'other'

export interface ActivityItem {
  id: string
  kind: ActivityKind
  actor: string
  description: string
  timestamp: string
}

export type ComplianceAlertSeverity = 'critical' | 'warning' | 'info'

export interface ComplianceAlert {
  id: string
  title: string
  description: string
  severity: ComplianceAlertSeverity
  dueDate?: string
}

export type SubscriptionPlanStatus = 'trial' | 'active' | 'past_due'

export interface SubscriptionStatus {
  planName: string
  status: SubscriptionPlanStatus
  trialEndsAt?: string
  trialLengthDays?: number
  seatsUsed: number
  seatsLimit: number
}

export interface DashboardOverview {
  activeEmployees: number
  pendingInvitations: number
  pendingApprovalsCount: number
  onLeaveToday: number
  openPayrollRuns: number
}

export interface DashboardSummary {
  overview: DashboardOverview
  approvalCategories: ApprovalCategory[]
  currentPayroll: PayrollStatusSummary | null
  upcomingPayroll: UpcomingPayrollRun[]
  recentActivity: ActivityItem[]
  complianceAlerts: ComplianceAlert[] | null
  subscription: SubscriptionStatus | null
}
