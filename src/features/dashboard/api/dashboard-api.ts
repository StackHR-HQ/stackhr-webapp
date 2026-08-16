import { http } from '../../../lib/http'
import type { DashboardSummary } from '../types/dashboard-types'

// Real backend call. Not wired up yet — the endpoint doesn't exist. Kept
// behind the same shape as dashboard-mock-api.ts so dashboard-service.ts can
// swap to this by flipping VITE_USE_MOCK_AUTH once the backend is live.
export const dashboardApi = {
  async getSummary(): Promise<DashboardSummary> {
    const { data } = await http.get<DashboardSummary>('/dashboard/summary')
    return data
  },
}
