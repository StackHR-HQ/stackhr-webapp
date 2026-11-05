import { toApiEnum } from '../../../lib/api-enum'
import { http } from '../../../lib/http'
import { fetchAllApprovals } from '../../approvals/api/approvals-api'
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
  // Null on claims made before these fields existed.
  expenseDate?: string | null
  paymentMethod?: string | null
}

// GET /spend/expenses/:id adds the linked reimbursement. The service includes a
// `reimbursements` array, while the Postman example shows a single `reimbursement`.
interface ApiExpenseDetail extends ApiExpense {
  reimbursements?: ApiReimbursement[]
  reimbursement?: ApiReimbursement | null
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
  // Null on advances made before currency was recorded.
  currency?: string | null
}

// Fields beyond the documented ones are optional. A claim submitted on its own
// (POST /reimbursements) has no expense.
interface ApiReimbursement {
  id: string
  expenseId?: string | null
  employeeId?: string
  employee?: ApiEmployeeRef | null
  description?: string | null
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
  CANCELLED: 'cancelled',
}

const REIMBURSEMENT_STATUS: Record<string, ReimbursementStatus> = {
  PENDING: 'pending',
  APPROVED: 'approved',
  PROCESSING: 'processing',
  PAID: 'completed',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
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
  CANCELLED: 'cancelled',
}

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  BANK_TRANSFER: 'Bank transfer',
  CARD: 'Card',
  CASH: 'Cash',
}

// A reimbursement claim submitted on its own is approved through an EXPENSE
// approval request whose subject is the reimbursement rather than an expense.
export const isReimbursementApproval = (approval: ApprovalRequest) => approval.subjectTable === 'reimbursement'

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

// All of them, not just the first page, so older claims still find their approval.
const fetchApprovals = (type: 'EXPENSE' | 'SALARY_ADVANCE') => fetchAllApprovals({ type })

// The backend leaves a reimbursement PENDING after it's been decided:
// - one created from an approved expense was approved at the expense stage;
// - a claim keeps PENDING after its approval request is approved or rejected.
// So a pending one takes its status from that decision.
export function reimbursementStatus(
  reimbursement: Pick<ApiReimbursement, 'status' | 'expenseId'>,
  approval?: ApprovalRequest,
): ReimbursementStatus {
  const status = REIMBURSEMENT_STATUS[toApiEnum(reimbursement.status)] ?? 'pending'
  if (status !== 'pending') return status
  if (reimbursement.expenseId || approval?.status === 'APPROVED') return 'approved'
  if (approval?.status === 'REJECTED') return 'rejected'
  return status
}

function toReimbursementInfo(reimbursement: ApiReimbursement, approval?: ApprovalRequest): ReimbursementInfo {
  return {
    id: reimbursement.id,
    method: reimbursement.method ?? reimbursement.paymentMethod ?? '—',
    requestedAt: reimbursement.createdAt ?? '',
    status: reimbursementStatus(reimbursement, approval),
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
    // Claims made before expenseDate existed fall back to the submission date.
    date: expense.expenseDate ?? expense.createdAt,
    submittedAt: expense.createdAt,
    amount: expense.amount,
    currency: expense.currency,
    paymentMethod: (expense.paymentMethod && PAYMENT_METHOD_LABEL[toApiEnum(expense.paymentMethod)]) ?? '—',
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
  const reimbursementByExpense = new Map(
    reimbursements.flatMap((reimbursement) => (reimbursement.expenseId ? [[reimbursement.expenseId, reimbursement]] : [])),
  )
  return expenses
    .map((expense) =>
      toExpenseClaim(expense, approvalByExpense.get(expense.id), reimbursementByExpense.get(expense.id)),
    )
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
}

export const spendApi = {
  getExpenses: getExpenseClaims,

  async getExpense(id: string): Promise<ExpenseClaim | null> {
    const [{ data }, approvals] = await Promise.all([
      http.get<{ expense: ApiExpenseDetail }>(`/spend/expenses/${id}`),
      fetchApprovals('EXPENSE'),
    ])
    const { expense } = data
    const reimbursement = expense.reimbursements?.[0] ?? expense.reimbursement ?? undefined
    return toExpenseClaim(expense, approvals.find((approval) => approval.subjectId === id), reimbursement)
  },

  async getReimbursements(): Promise<Reimbursement[]> {
    const [reimbursements, expenses, approvals] = await Promise.all([
      fetchReimbursements(),
      fetchExpenses(),
      fetchApprovals('EXPENSE'),
    ])
    const expenseById = new Map(expenses.map((expense) => [expense.id, expense]))
    // Claims are approved through an EXPENSE approval whose subject is the reimbursement.
    const approvalByClaim = new Map(
      approvals.filter(isReimbursementApproval).map((approval) => [approval.subjectId, approval]),
    )
    return reimbursements
      .map((reimbursement) => {
        const expense = reimbursement.expenseId ? expenseById.get(reimbursement.expenseId) : undefined
        const approval = approvalByClaim.get(reimbursement.id)
        const name = employeeName(reimbursement.employee ?? expense?.employee ?? approval?.requester ?? null)
        return {
          ...toReimbursementInfo(reimbursement, approval),
          expenseId: reimbursement.expenseId ?? undefined,
          employeeId: reimbursement.employeeId ?? expense?.employeeId ?? '',
          employeeName: name,
          avatarInitials: initials(name),
          category: expense?.category ?? 'Reimbursement claim',
          description: reimbursement.description ?? expense?.description ?? '',
          amount: reimbursement.amount,
          currency: reimbursement.currency,
          approvalId: approval?.id,
          requesterId: approval?.requesterId,
        }
      })
      .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt))
  },

  // Sends the money: the backend pays the employee by bank transfer (Anchor)
  // when the organization has a funded deposit account.
  async markReimbursementPaid(id: string): Promise<void> {
    await http.post(`/reimbursements/${id}/pay`)
  },

  // Expense approvals come from the shared approvals engine; ids are approval
  // request ids, so they can be passed straight to /approvals/:id/decide.
  async getApprovalRequests(): Promise<SpendApprovalRequest[]> {
    const approvals = await fetchApprovals('EXPENSE')
    return approvals
      // Reimbursement claims are listed under Reimbursements instead.
      .filter((approval) => !isReimbursementApproval(approval))
      // Approvals are cancelled along with their expense, or when the expense is deleted.
      .filter((approval) => approval.status in APPROVAL_STATUS)
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
          status: APPROVAL_STATUS[approval.status],
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
          // Older advances have no currency; they're paid in the org's payroll currency.
          currency: advance.currency ?? 'NGN',
          repaymentMonths: advance.repaymentMonths,
          status: ADVANCE_STATUS[toApiEnum(advance.status)] ?? 'pending',
          approvalId: approvalByAdvance.get(advance.id),
        }
      })
      .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt))
  },

  async disburseSalaryAdvance(id: string): Promise<void> {
    await http.post(`/spend/advances/${id}/disburse`)
  },
}
