import { http } from '../../../lib/http'
import type { StatutoryContributionRule } from '../../payroll/types/payroll-types'
import type { NotificationSettings, OrganizationSettings, PayrollSettings } from '../types/settings-types'

// Real backend calls. Not wired up yet — the endpoints don't exist. Kept
// behind the same shape as settings-mock-api.ts so settings-service.ts can
// swap to this by flipping VITE_USE_MOCK_AUTH once the backend is live.
export const settingsApi = {
  async getOrganizationSettings(): Promise<OrganizationSettings> {
    const { data } = await http.get<OrganizationSettings>('/settings/organization')
    return data
  },

  async updateOrganizationSettings(patch: Partial<OrganizationSettings>): Promise<OrganizationSettings> {
    const { data } = await http.patch<OrganizationSettings>('/settings/organization', patch)
    return data
  },

  async getPayrollSettings(): Promise<PayrollSettings> {
    const { data } = await http.get<PayrollSettings>('/settings/payroll')
    return data
  },

  async updatePayrollSettings(patch: Partial<PayrollSettings>): Promise<PayrollSettings> {
    const { data } = await http.patch<PayrollSettings>('/settings/payroll', patch)
    return data
  },

  async getStatutoryContributionRules(): Promise<StatutoryContributionRule[]> {
    const { data } = await http.get<StatutoryContributionRule[]>('/settings/payroll/statutory-contributions')
    return data
  },

  async getNotificationSettings(): Promise<NotificationSettings> {
    const { data } = await http.get<NotificationSettings>('/settings/notifications')
    return data
  },

  async updateNotificationSettings(patch: Partial<NotificationSettings>): Promise<NotificationSettings> {
    const { data } = await http.patch<NotificationSettings>('/settings/notifications', patch)
    return data
  },
}
