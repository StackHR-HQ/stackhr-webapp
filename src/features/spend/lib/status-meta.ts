import type { BadgeTone } from '../../../components/ui/badge'
import type { ExpenseStatus, ReimbursementStatus, SpendApprovalStatus } from '../types/spend-types'

export const EXPENSE_STATUS_META: Record<ExpenseStatus, { label: string; tone: BadgeTone }> = {
  pending: { label: 'Pending approval', tone: 'warning' },
  approved: { label: 'Approved', tone: 'accent' },
  rejected: { label: 'Rejected', tone: 'critical' },
  reimbursed: { label: 'Reimbursed', tone: 'positive' },
}

export const REIMBURSEMENT_STATUS_META: Record<ReimbursementStatus, { label: string; tone: BadgeTone }> = {
  pending: { label: 'Pending', tone: 'warning' },
  approved: { label: 'Approved', tone: 'accent' },
  processing: { label: 'Processing', tone: 'accent' },
  completed: { label: 'Completed', tone: 'positive' },
  failed: { label: 'Failed', tone: 'critical' },
}

export const SPEND_APPROVAL_STATUS_META: Record<SpendApprovalStatus, { label: string; tone: BadgeTone }> = {
  pending: { label: 'Pending', tone: 'warning' },
  approved: { label: 'Approved', tone: 'positive' },
  rejected: { label: 'Rejected', tone: 'critical' },
}
