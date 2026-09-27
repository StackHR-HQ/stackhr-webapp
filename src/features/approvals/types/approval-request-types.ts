export type ApprovalDecision = 'APPROVED' | 'REJECTED'

export interface ApprovalRequest {
  id: string
  type: string
  subjectTable: string
  subjectId: string
  requesterId: string
  status: string
  amountSnapshot: number | null
  metadata: string | null
  submittedAt: string
}
