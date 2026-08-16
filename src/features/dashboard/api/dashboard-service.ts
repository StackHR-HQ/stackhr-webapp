import { USE_MOCK_AUTH } from '../../../lib/env'
import { dashboardApi } from './dashboard-api'
import { mockDashboardApi } from './dashboard-mock-api'

export const dashboardService = USE_MOCK_AUTH ? mockDashboardApi : dashboardApi
