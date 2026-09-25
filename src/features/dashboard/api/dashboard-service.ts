import { USE_MOCK_DASHBOARD } from '../../../lib/env'
import { dashboardApi } from './dashboard-api'
import { mockDashboardApi } from './dashboard-mock-api'

export const dashboardService = USE_MOCK_DASHBOARD ? mockDashboardApi : dashboardApi
