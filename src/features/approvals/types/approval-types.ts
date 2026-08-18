export type ApprovalDomain = 'leave' | 'expenses' | 'reimbursements' | 'salary-advances' | 'payroll'

export type GlobalApprovalStatus = 'pending' | 'approved' | 'rejected'

export interface GlobalApprovalItem {
  id: string
  domain: ApprovalDomain
  title: string
  subtitle: string
  avatarInitials?: string
  amount?: number
  currency?: string
  submittedAt: string
  status: GlobalApprovalStatus
  decidedBy?: string
  decidedAt?: string
  detailPath: string
  actionable: boolean
}
