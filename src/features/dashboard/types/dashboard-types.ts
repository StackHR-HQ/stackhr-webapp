import type { PayrollRunStatus } from '../../payroll/types/payroll-types'

export type { PayrollRunStatus }

export interface PayrollStatusSummary {
  periodLabel: string
  status: PayrollRunStatus
  payDate: string
  totalNet: number
  currency: string
  employeesIncluded: number
  employeesTotal: number
}

export interface UpcomingPayrollRun {
  id: string
  periodLabel: string
  payDate: string
  status: PayrollRunStatus
}

export type ApprovalCategoryKey = 'employee-changes' | 'leave' | 'expenses' | 'reimbursements' | 'salary-advances'

export interface ApprovalItem {
  id: string
  employeeName: string
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
  seatsUsed: number
  seatsLimit: number
}

export interface DashboardOverview {
  activeEmployees: number
  pendingApprovalsCount: number
  openComplianceAlertsCount: number
  nextPayDate: string
}

export interface DashboardSummary {
  overview: DashboardOverview
  payroll: PayrollStatusSummary
  upcomingPayroll: UpcomingPayrollRun[]
  approvalCategories: ApprovalCategory[]
  recentActivity: ActivityItem[]
  complianceAlerts: ComplianceAlert[]
  subscription: SubscriptionStatus
}
