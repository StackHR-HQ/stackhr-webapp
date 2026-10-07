import { toApiEnum } from '../../../lib/api-enum'
import { http } from '../../../lib/http'
import type { ApprovalRequest } from '../../approvals/types/approval-request-types'
import { initials } from '../../employee/lib/profile-format'
import type { SalaryAdvanceStatusEntry } from '../../payroll/types/payroll-types'
import type {
  ExpenseClaim,
  ExpenseStatus,
  Reimbursement,
  ReimbursementInfo,
  ReimbursementStatus,
  SpendApprovalRequest,
  SpendApprovalStatus,
} from '../types/spend-types'

// Shapes confirmed against staging. Amounts are whole currency units (the
// matching approval requests report unit: "CURRENCY").
interface ApiEmployeeRef {
  id: string
  fullName: string
  email?: string
}

interface ApiExpense {
  id: string
  employeeId: string
  employee: ApiEmployeeRef | null
  category: string
  amount: number
  currency: string
  description: string | null
  receiptUrl: string | null
  status: string
  createdAt: string
  updatedAt: string
}

interface ApiSalaryAdvance {
  id: string
  employeeId: string
  employee: ApiEmployeeRef | null
  amount: number
  repaymentMonths: number
  monthlyDeduction: number
  reason: string | null
  status: string
  disbursedAt: string | null
  createdAt: string
}

// Only seen empty on staging so far; fields beyond the documented ones are optional.
interface ApiReimbursement {
  id: string
  expenseId: string
  amount: number
  currency: string
  status: string
  method?: string | null
  paymentMethod?: string | null
  failureReason?: string | null
  createdAt?: string
  paidAt?: string | null
  completedAt?: string | null
}

const EXPENSE_STATUS: Record<string, ExpenseStatus> = {
  PENDING: 'pending',
  SUBMITTED: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REIMBURSED: 'reimbursed',
  PAID: 'reimbursed',
}

const REIMBURSEMENT_STATUS: Record<string, ReimbursementStatus> = {
  PENDING: 'pending',
  APPROVED: 'approved',
  PROCESSING: 'processing',
  PAID: 'completed',
  COMPLETED: 'completed',
  FAILED: 'failed',
}

const APPROVAL_STATUS: Record<string, SpendApprovalStatus> = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
}

const ADVANCE_STATUS: Record<string, SalaryAdvanceStatusEntry['status']> = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  DISBURSED: 'disbursed',
  REPAYING: 'disbursed',
  REPAID: 'repaid',
}

const employeeName = (employee: ApiEmployeeRef | null) => employee?.fullName ?? 'Unknown employee'

function receiptFileName(url: string | null): string | undefined {
  if (!url) return undefined
  try {
    return decodeURIComponent(new URL(url).pathname.split('/').pop() || '') || undefined
  } catch {
    return undefined
  }
}

async function fetchExpenses(): Promise<ApiExpense[]> {
  const { data } = await http.get<{ expenses: ApiExpense[] }>('/spend/expenses')
  return data.expenses
}

async function fetchReimbursements(): Promise<ApiReimbursement[]> {
  const { data } = await http.get<{ reimbursements: ApiReimbursement[] }>('/spend/reimbursements')
  return data.reimbursements
}

async function fetchApprovals(type: 'EXPENSE' | 'SALARY_ADVANCE'): Promise<ApprovalRequest[]> {
  const { data } = await http.get<{ items: ApprovalRequest[] }>('/approvals', { params: { type, page: 1, limit: 100 } })
  return data.items
}

function toReimbursementInfo(reimbursement: ApiReimbursement): ReimbursementInfo {
  return {
    id: reimbursement.id,
    method: reimbursement.method ?? reimbursement.paymentMethod ?? '—',
    requestedAt: reimbursement.createdAt ?? '',
    status: REIMBURSEMENT_STATUS[toApiEnum(reimbursement.status)] ?? 'pending',
    completedAt: reimbursement.completedAt ?? reimbursement.paidAt ?? undefined,
    failureReason: reimbursement.failureReason ?? undefined,
  }
}

function toExpenseClaim(
  expense: ApiExpense,
  approval: ApprovalRequest | undefined,
  reimbursement: ApiReimbursement | undefined,
): ExpenseClaim {
  const name = employeeName(expense.employee)
  return {
    id: expense.id,
    employeeId: expense.employeeId,
    employeeName: name,
    avatarInitials: initials(name),
    category: expense.category,
    description: expense.description ?? '',
    // There's no separate expense date yet, so the submission date stands in.
    date: expense.createdAt,
    submittedAt: expense.createdAt,
    amount: expense.amount,
    currency: expense.currency,
    paymentMethod: '—',
    receiptFileName: receiptFileName(expense.receiptUrl),
    status: EXPENSE_STATUS[toApiEnum(expense.status)] ?? 'pending',
    decidedBy: approval?.approver?.fullName,
    decidedAt: approval?.decidedAt ?? undefined,
    rejectionReason: approval?.rejectionReason ?? undefined,
    reimbursement: reimbursement ? toReimbursementInfo(reimbursement) : undefined,
  }
}

async function getExpenseClaims(): Promise<ExpenseClaim[]> {
  const [expenses, approvals, reimbursements] = await Promise.all([
    fetchExpenses(),
    fetchApprovals('EXPENSE'),
    fetchReimbursements(),
  ])
  const approvalByExpense = new Map(approvals.map((approval) => [approval.subjectId, approval]))
  const reimbursementByExpense = new Map(reimbursements.map((reimbursement) => [reimbursement.expenseId, reimbursement]))
  return expenses
    .map((expense) =>
      toExpenseClaim(expense, approvalByExpense.get(expense.id), reimbursementByExpense.get(expense.id)),
    )
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
}

export const spendApi = {
  getExpenses: getExpenseClaims,

  // No GET /spend/expenses/:id yet, so look the claim up in the list.
  async getExpense(id: string): Promise<ExpenseClaim | null> {
    const claims = await getExpenseClaims()
    return claims.find((claim) => claim.id === id) ?? null
  },

  async getReimbursements(): Promise<Reimbursement[]> {
    const [reimbursements, expenses] = await Promise.all([fetchReimbursements(), fetchExpenses()])
    const expenseById = new Map(expenses.map((expense) => [expense.id, expense]))
    return reimbursements
      .map((reimbursement) => {
        const expense = expenseById.get(reimbursement.expenseId)
        const name = employeeName(expense?.employee ?? null)
        return {
          ...toReimbursementInfo(reimbursement),
          expenseId: reimbursement.expenseId,
          employeeId: expense?.employeeId ?? '',
          employeeName: name,
          avatarInitials: initials(name),
          category: expense?.category ?? '—',
          amount: reimbursement.amount,
          currency: reimbursement.currency,
        }
      })
      .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt))
  },

  // Expense approvals come from the shared approvals engine; ids are approval
  // request ids, so they can be passed straight to /approvals/:id/decide.
  async getApprovalRequests(): Promise<SpendApprovalRequest[]> {
    const approvals = await fetchApprovals('EXPENSE')
    return approvals
      .map((approval) => {
        const summary = approval.subjectSummary
        const name = approval.requester?.fullName ?? 'Unknown employee'
        return {
          id: approval.id,
          expenseId: approval.subjectId,
          employeeId: approval.requesterId,
          employeeName: name,
          avatarInitials: initials(name),
          category: summary?.category ?? 'Expense',
          description: summary?.description ?? '',
          amount: approval.amountSnapshot ?? 0,
          currency: approval.currency ?? summary?.currency ?? 'NGN',
          submittedAt: approval.submittedAt,
          status: APPROVAL_STATUS[approval.status] ?? 'pending',
          decidedBy: approval.approver?.fullName,
          decidedAt: approval.decidedAt ?? undefined,
          rejectionReason: approval.rejectionReason ?? undefined,
        }
      })
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
  },

  async getSalaryAdvances(): Promise<SalaryAdvanceStatusEntry[]> {
    const [{ data }, approvals] = await Promise.all([
      http.get<{ advances: ApiSalaryAdvance[] }>('/spend/advances'),
      fetchApprovals('SALARY_ADVANCE'),
    ])
    const approvalByAdvance = new Map(approvals.map((approval) => [approval.subjectId, approval.id]))
    return data.advances
      .map((advance) => {
        const name = employeeName(advance.employee)
        return {
          id: advance.id,
          employeeId: advance.employeeId,
          employeeName: name,
          avatarInitials: initials(name),
          requestedAt: advance.createdAt,
          amount: advance.amount,
          // Advances don't carry a currency; they're paid in the org's payroll currency.
          currency: 'NGN',
          repaymentMonths: advance.repaymentMonths,
          status: ADVANCE_STATUS[toApiEnum(advance.status)] ?? 'pending',
          approvalId: approvalByAdvance.get(advance.id),
        }
      })
      .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt))
  },
}
