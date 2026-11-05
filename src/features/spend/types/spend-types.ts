export type ExpenseStatus = 'pending' | 'approved' | 'rejected' | 'reimbursed' | 'cancelled'

export type ReimbursementStatus =
  | 'pending'
  | 'approved'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'rejected'
  | 'cancelled'

export interface ReimbursementInfo {
  id: string
  method: string
  requestedAt: string
  status: ReimbursementStatus
  completedAt?: string
  failureReason?: string
}

export interface ExpenseClaim {
  id: string
  employeeId: string
  employeeName: string
  avatarInitials: string
  category: string
  description: string
  date: string
  submittedAt: string
  amount: number
  currency: string
  paymentMethod: string
  receiptFileName?: string
  status: ExpenseStatus
  decidedBy?: string
  decidedAt?: string
  rejectionReason?: string
  reimbursement?: ReimbursementInfo
}

export type SpendApprovalStatus = 'pending' | 'approved' | 'rejected'

// Either created when an expense is approved (expenseId set) or submitted on
// its own as a reimbursement claim (no expense; approved via its approvalId).
export interface Reimbursement extends ReimbursementInfo {
  expenseId?: string
  employeeId: string
  employeeName: string
  avatarInitials: string
  category: string
  description: string
  amount: number
  currency: string
  approvalId?: string
  // The auth user who submitted the claim; they can't approve it themselves.
  requesterId?: string
}

export interface ReimbursementTotals {
  count: number
  // One sum per currency; amounts in different currencies are never added together.
  amounts: { currency: string; amount: number }[]
}

// Totals by stage, worked out from the list. GET /reimbursements/summary counts
// a reimbursement from an approved expense as pending, so it isn't used.
export interface ReimbursementSummary {
  pending: ReimbursementTotals
  approved: ReimbursementTotals
  paid: ReimbursementTotals
}

export interface SpendApprovalRequest {
  id: string
  expenseId: string
  employeeId: string
  employeeName: string
  avatarInitials: string
  category: string
  description: string
  amount: number
  currency: string
  submittedAt: string
  status: SpendApprovalStatus
  decidedBy?: string
  decidedAt?: string
  rejectionReason?: string
}
