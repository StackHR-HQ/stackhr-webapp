import type { PayrollRunListItem, SalaryAdvanceStatusEntry } from '../../payroll/types/payroll-types'
import type { LeaveRequestWithEmployee } from '../../people/types/people-types'
import type { Reimbursement, SpendApprovalRequest } from '../../spend/types/spend-types'
import { formatAmount, formatDate } from './format'
import type { GlobalApprovalItem, GlobalApprovalStatus } from '../types/approval-types'

export function leaveRequestsToApprovals(requests: LeaveRequestWithEmployee[]): GlobalApprovalItem[] {
  return requests.map((request) => ({
    id: request.id,
    domain: 'leave',
    title: request.employeeName,
    subtitle: `${request.type} · ${formatDate(request.startDate)} – ${formatDate(request.endDate)} (${request.days}d)`,
    avatarInitials: request.avatarInitials,
    submittedAt: request.startDate,
    status: request.status,
    detailPath: `/people/leave`,
    actionable: request.status === 'pending',
  }))
}

export function spendApprovalsToApprovals(requests: SpendApprovalRequest[]): GlobalApprovalItem[] {
  return requests.map((request) => ({
    id: request.id,
    domain: 'expenses',
    title: request.employeeName,
    subtitle: `${request.category} · ${request.description}`,
    avatarInitials: request.avatarInitials,
    amount: request.amount,
    currency: request.currency,
    submittedAt: request.submittedAt,
    status: request.status,
    decidedBy: request.decidedBy,
    decidedAt: request.decidedAt,
    detailPath: `/spend/expenses/${request.expenseId}`,
    actionable: request.status === 'pending',
  }))
}

const REIMBURSEMENT_STATUS_MAP: Record<Reimbursement['status'], GlobalApprovalStatus> = {
  pending: 'pending',
  approved: 'approved',
  processing: 'approved',
  completed: 'approved',
  failed: 'rejected',
}

export function reimbursementsToApprovals(reimbursements: Reimbursement[]): GlobalApprovalItem[] {
  return reimbursements.map((reimbursement) => ({
    id: reimbursement.id,
    domain: 'reimbursements',
    title: reimbursement.employeeName,
    subtitle: `${reimbursement.category} · ${reimbursement.method}`,
    avatarInitials: reimbursement.avatarInitials,
    amount: reimbursement.amount,
    currency: reimbursement.currency,
    submittedAt: reimbursement.requestedAt,
    status: REIMBURSEMENT_STATUS_MAP[reimbursement.status],
    decidedAt: reimbursement.completedAt,
    detailPath: `/spend/expenses/${reimbursement.expenseId}`,
    // Reimbursement status tracks payout progress, not a maker-checker decision
    // — the decision already happened at the expense-approval stage.
    actionable: false,
  }))
}

const ADVANCE_STATUS_MAP: Record<SalaryAdvanceStatusEntry['status'], GlobalApprovalStatus> = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
  disbursed: 'approved',
  repaid: 'approved',
}

export function salaryAdvancesToApprovals(advances: SalaryAdvanceStatusEntry[]): GlobalApprovalItem[] {
  return advances.map((advance) => ({
    id: advance.id,
    domain: 'salary-advances',
    title: advance.employeeName,
    subtitle: `Salary advance · ${advance.repaymentMonths} month repayment`,
    avatarInitials: advance.avatarInitials,
    amount: advance.amount,
    currency: advance.currency,
    submittedAt: advance.requestedAt,
    status: ADVANCE_STATUS_MAP[advance.status],
    detailPath: `/payroll/salary-advances`,
    actionable: advance.status === 'pending',
  }))
}

const PAYROLL_RUN_STATUS_MAP: Partial<Record<PayrollRunListItem['status'], GlobalApprovalStatus>> = {
  pending_approval: 'pending',
  approved: 'approved',
  completed: 'approved',
  failed: 'rejected',
}

export function payrollRunsToApprovals(runs: PayrollRunListItem[]): GlobalApprovalItem[] {
  return runs
    .filter((run) => run.status in PAYROLL_RUN_STATUS_MAP)
    .map((run) => ({
      id: run.id,
      domain: 'payroll',
      title: run.periodLabel,
      subtitle: `Payroll run · ${run.summary.employeeCount} employees · ${formatAmount(run.summary.netPay, run.summary.currency)} net`,
      submittedAt: run.generatedAt,
      status: PAYROLL_RUN_STATUS_MAP[run.status]!,
      decidedBy: run.approvedBy,
      decidedAt: run.approvedAt,
      detailPath: `/payroll/runs/${run.id}`,
      // Payroll approval is a multi-step maker-checker chain reviewed on the
      // run detail page itself, not a single approve/reject action here.
      actionable: false,
    }))
}
