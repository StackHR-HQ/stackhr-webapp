import type { ExpenseClaim, Reimbursement, SpendApprovalRequest, SpendApprovalStatus } from '../types/spend-types'

const APPROVAL_STATUS_BY_EXPENSE: Record<ExpenseClaim['status'], SpendApprovalStatus> = {
  pending: 'pending',
  approved: 'approved',
  reimbursed: 'approved',
  rejected: 'rejected',
}

export function deriveApprovalRequests(claims: ExpenseClaim[]): SpendApprovalRequest[] {
  return claims.map((claim) => ({
    id: `apr-${claim.id}`,
    expenseId: claim.id,
    employeeId: claim.employeeId,
    employeeName: claim.employeeName,
    avatarInitials: claim.avatarInitials,
    category: claim.category,
    description: claim.description,
    amount: claim.amount,
    currency: claim.currency,
    submittedAt: claim.submittedAt,
    status: APPROVAL_STATUS_BY_EXPENSE[claim.status],
    decidedBy: claim.decidedBy,
    decidedAt: claim.decidedAt,
    rejectionReason: claim.rejectionReason,
  }))
}

export function deriveReimbursements(claims: ExpenseClaim[]): Reimbursement[] {
  return claims
    .filter((claim): claim is ExpenseClaim & { reimbursement: NonNullable<ExpenseClaim['reimbursement']> } =>
      Boolean(claim.reimbursement),
    )
    .map((claim) => ({
      ...claim.reimbursement,
      expenseId: claim.id,
      employeeId: claim.employeeId,
      employeeName: claim.employeeName,
      avatarInitials: claim.avatarInitials,
      category: claim.category,
      amount: claim.amount,
      currency: claim.currency,
    }))
}
