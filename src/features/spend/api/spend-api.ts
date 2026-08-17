import { http } from '../../../lib/http'
import type { ExpenseClaim, Reimbursement, SpendApprovalRequest } from '../types/spend-types'

// Real backend calls. Not wired up yet — the endpoints don't exist. Kept
// behind the same shape as spend-mock-api.ts so spend-service.ts can swap to
// this by flipping VITE_USE_MOCK_AUTH once the backend is live.
export const spendApi = {
  async getExpenses(): Promise<ExpenseClaim[]> {
    const { data } = await http.get<ExpenseClaim[]>('/spend/expenses')
    return data
  },

  async getExpense(id: string): Promise<ExpenseClaim | null> {
    const { data } = await http.get<ExpenseClaim>(`/spend/expenses/${id}`)
    return data
  },

  async getReimbursements(): Promise<Reimbursement[]> {
    const { data } = await http.get<Reimbursement[]>('/spend/reimbursements')
    return data
  },

  async getApprovalRequests(): Promise<SpendApprovalRequest[]> {
    const { data } = await http.get<SpendApprovalRequest[]>('/spend/approvals')
    return data
  },
}
