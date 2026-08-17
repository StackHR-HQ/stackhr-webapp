import { http } from '../../../lib/http'
import type { PayrollOverview, PayrollRunDetail, PayrollRunListItem } from '../types/payroll-types'

// Real backend calls. Not wired up yet — the endpoints don't exist. Kept
// behind the same shape as payroll-mock-api.ts so payroll-service.ts can
// swap to this by flipping VITE_USE_MOCK_AUTH once the backend is live.
export const payrollApi = {
  async getRuns(): Promise<PayrollRunListItem[]> {
    const { data } = await http.get<PayrollRunListItem[]>('/payroll/runs')
    return data
  },

  async getRun(id: string): Promise<PayrollRunDetail | null> {
    const { data } = await http.get<PayrollRunDetail>(`/payroll/runs/${id}`)
    return data
  },

  async getOverview(): Promise<PayrollOverview> {
    const { data } = await http.get<PayrollOverview>('/payroll/overview')
    return data
  },
}
