import { http } from '../../../lib/http'
import type { ApprovalDecision, ApprovalRequest } from '../types/approval-request-types'

interface ApprovalsPage {
  items: ApprovalRequest[]
  meta: { total: number; totalPages?: number }
}

// The backend caps a page at 100.
const PAGE_LIMIT = 100

// Every approval request matching the filters, across all pages. Employees get
// only their own requests; approver roles get the whole organization's.
export async function fetchAllApprovals(filters: { type?: string; status?: string } = {}): Promise<ApprovalRequest[]> {
  const items: ApprovalRequest[] = []
  for (let page = 1; ; page += 1) {
    const { data } = await http.get<ApprovalsPage>('/approvals', { params: { ...filters, page, limit: PAGE_LIMIT } })
    items.push(...data.items)
    const totalPages = data.meta.totalPages ?? Math.ceil(data.meta.total / PAGE_LIMIT)
    if (page >= totalPages || data.items.length === 0) return items
  }
}

export const approvalsApi = {
  async listPending(): Promise<{ items: ApprovalRequest[]; total: number }> {
    const { data } = await http.get<ApprovalsPage>('/approvals', { params: { status: 'PENDING', page: 1, limit: 20 } })
    return { items: data.items, total: data.meta.total }
  },

  // Every pending request the signed-in user can see, of the given types.
  async listPendingOfTypes(types: string[]): Promise<ApprovalRequest[]> {
    const items = await fetchAllApprovals({ status: 'PENDING' })
    return items.filter((item) => types.includes(item.type))
  },

  async listRecent(): Promise<ApprovalRequest[]> {
    const { data } = await http.get<ApprovalsPage>('/approvals', { params: { page: 1, limit: 20 } })
    return data.items
  },

  async decide(id: string, status: ApprovalDecision): Promise<void> {
    await http.patch(`/approvals/${id}/decide`, { status })
  },
}
