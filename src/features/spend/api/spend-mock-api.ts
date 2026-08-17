import { EXPENSE_CLAIMS, getExpenseClaim } from '../data/expenses'
import { deriveApprovalRequests, deriveReimbursements } from '../lib/derive'
import type { ExpenseClaim, Reimbursement, SpendApprovalRequest } from '../types/spend-types'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const mockSpendApi = {
  async getExpenses(): Promise<ExpenseClaim[]> {
    await delay(400)
    return [...EXPENSE_CLAIMS].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
  },

  async getExpense(id: string): Promise<ExpenseClaim | null> {
    await delay(400)
    return getExpenseClaim(id) ?? null
  },

  async getReimbursements(): Promise<Reimbursement[]> {
    await delay(400)
    return deriveReimbursements(EXPENSE_CLAIMS).sort(
      (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime(),
    )
  },

  async getApprovalRequests(): Promise<SpendApprovalRequest[]> {
    await delay(400)
    return deriveApprovalRequests(EXPENSE_CLAIMS).sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    )
  },
}
