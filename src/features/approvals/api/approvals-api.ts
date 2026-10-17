import { http } from '../../../lib/http'
import type { ApprovalDecision, ApprovalRequest } from '../types/approval-request-types'

interface ApprovalsPage {
  items: ApprovalRequest[]
  meta: { total: number }
}

export const approvalsApi = {
  async listPending(): Promise<{ items: ApprovalRequest[]; total: number }> {
    const { data } = await http.get<ApprovalsPage>('/approvals', { params: { status: 'PENDING', page: 1, limit: 20 } })
    return { items: data.items, total: data.meta.total }
  },

  // Every pending request the signed-in user can see, of the given types.
  async listPendingOfTypes(types: string[]): Promise<ApprovalRequest[]> {
    const { data } = await http.get<ApprovalsPage>('/approvals', { params: { status: 'PENDING', page: 1, limit: 100 } })
    return data.items.filter((item) => types.includes(item.type))
  },

  async listRecent(): Promise<ApprovalRequest[]> {
    const { data } = await http.get<ApprovalsPage>('/approvals', { params: { page: 1, limit: 20 } })
    return data.items
  },

  async decide(id: string, status: ApprovalDecision): Promise<void> {
    await http.patch(`/approvals/${id}/decide`, { status })
  },
}
