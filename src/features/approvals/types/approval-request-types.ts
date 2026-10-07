export type ApprovalDecision = 'APPROVED' | 'REJECTED'

export interface ApprovalSubjectSummary {
  // Set instead of the details below when the subject was deleted, e.g. "Leave Request (Archived)".
  label?: string
  leaveType?: string
  startDate?: string
  endDate?: string
  totalDays?: number
  reason?: string | null
  // Expense subjects
  category?: string
  description?: string | null
  amount?: number
  currency?: string
  receiptUrl?: string | null
}

export interface ApprovalRequest {
  id: string
  type: string
  subjectTable: string
  subjectId: string
  requesterId: string
  requester: { id: string; fullName: string } | null
  approver: { id: string; fullName: string } | null
  status: string
  amountSnapshot: number | null
  unit: string | null
  currency: string | null
  subjectSummary: ApprovalSubjectSummary | null
  metadata: string | null
  submittedAt: string
  decidedAt: string | null
  rejectionReason?: string | null
}
