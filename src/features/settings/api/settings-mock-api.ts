import { EMPLOYEES } from '../../people/data/employees'
import { getStatutoryContributions } from '../../payroll/lib/statutory-contributions'
import { DEFAULT_NOTIFICATION_SETTINGS, DEFAULT_ORGANIZATION_SETTINGS, DEFAULT_PAYROLL_SETTINGS } from '../data/settings-data'
import type { NotificationSettings, OrganizationSettings, PayrollSettings } from '../types/settings-types'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

let organizationSettings: OrganizationSettings = structuredClone(DEFAULT_ORGANIZATION_SETTINGS)
let payrollSettings: PayrollSettings = structuredClone(DEFAULT_PAYROLL_SETTINGS)
let notificationSettings: NotificationSettings = structuredClone(DEFAULT_NOTIFICATION_SETTINGS)

export const mockSettingsApi = {
  async getOrganizationSettings(): Promise<OrganizationSettings> {
    await delay(300)
    return structuredClone(organizationSettings)
  },

  async updateOrganizationSettings(patch: Partial<OrganizationSettings>): Promise<OrganizationSettings> {
    await delay(500)
    organizationSettings = { ...organizationSettings, ...patch }
    return structuredClone(organizationSettings)
  },

  async getPayrollSettings(): Promise<PayrollSettings> {
    await delay(300)
    return structuredClone(payrollSettings)
  },

  async updatePayrollSettings(patch: Partial<PayrollSettings>): Promise<PayrollSettings> {
    await delay(500)
    payrollSettings = { ...payrollSettings, ...patch }
    return structuredClone(payrollSettings)
  },

  async getStatutoryContributionRules() {
    await delay(300)
    return getStatutoryContributions(EMPLOYEES.length)
  },

  async getNotificationSettings(): Promise<NotificationSettings> {
    await delay(300)
    return structuredClone(notificationSettings)
  },

  async updateNotificationSettings(patch: Partial<NotificationSettings>): Promise<NotificationSettings> {
    await delay(500)
    notificationSettings = { ...notificationSettings, ...patch }
    return structuredClone(notificationSettings)
  },
}
