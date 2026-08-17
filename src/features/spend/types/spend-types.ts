export type ExpenseStatus = 'pending' | 'approved' | 'rejected' | 'reimbursed'

export type ReimbursementStatus = 'pending' | 'approved' | 'processing' | 'completed' | 'failed'

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

export interface Reimbursement extends ReimbursementInfo {
  expenseId: string
  employeeId: string
  employeeName: string
  avatarInitials: string
  category: string
  amount: number
  currency: string
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
