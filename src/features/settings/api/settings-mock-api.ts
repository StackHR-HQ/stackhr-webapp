import { EMPLOYEES } from '../../people/data/employees'
import { getStatutoryContributions } from '../../payroll/lib/statutory-contributions'
import {
  DEFAULT_BILLING_SETTINGS,
  DEFAULT_INTEGRATIONS,
  DEFAULT_NOTIFICATION_SETTINGS,
  DEFAULT_ORGANIZATION_SETTINGS,
  DEFAULT_PAYROLL_SETTINGS,
  DEFAULT_SECURITY_SETTINGS,
} from '../data/settings-data'
import type {
  AuthenticationSettings,
  BillingSettings,
  Integration,
  IntegrationStatus,
  NotificationSettings,
  OrganizationSettings,
  PaymentMethod,
  PayrollSettings,
  SecuritySettings,
} from '../types/settings-types'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

let organizationSettings: OrganizationSettings = structuredClone(DEFAULT_ORGANIZATION_SETTINGS)
let payrollSettings: PayrollSettings = structuredClone(DEFAULT_PAYROLL_SETTINGS)
let notificationSettings: NotificationSettings = structuredClone(DEFAULT_NOTIFICATION_SETTINGS)
let billingSettings: BillingSettings = structuredClone(DEFAULT_BILLING_SETTINGS)
let securitySettings: SecuritySettings = structuredClone(DEFAULT_SECURITY_SETTINGS)
let integrations: Integration[] = structuredClone(DEFAULT_INTEGRATIONS)

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

  async getBillingSettings(): Promise<BillingSettings> {
    await delay(300)
    return structuredClone(billingSettings)
  },

  async updateSubscription(patch: Partial<BillingSettings['subscription']>): Promise<BillingSettings> {
    await delay(500)
    billingSettings = { ...billingSettings, subscription: { ...billingSettings.subscription, ...patch } }
    return structuredClone(billingSettings)
  },

  async updatePaymentMethod(paymentMethod: PaymentMethod): Promise<BillingSettings> {
    await delay(600)
    billingSettings = { ...billingSettings, paymentMethod }
    return structuredClone(billingSettings)
  },

  async getSecuritySettings(): Promise<SecuritySettings> {
    await delay(300)
    return structuredClone(securitySettings)
  },

  async updateAuthenticationSettings(patch: Partial<AuthenticationSettings>): Promise<SecuritySettings> {
    await delay(500)
    securitySettings = { ...securitySettings, authentication: { ...securitySettings.authentication, ...patch } }
    return structuredClone(securitySettings)
  },

  async revokeSession(sessionId: string): Promise<SecuritySettings> {
    await delay(500)
    securitySettings = { ...securitySettings, sessions: securitySettings.sessions.filter((session) => session.id !== sessionId) }
    return structuredClone(securitySettings)
  },

  async changePassword(_payload: { currentPassword: string; newPassword: string }): Promise<void> {
    await delay(700)
  },

  async getIntegrations(): Promise<Integration[]> {
    await delay(300)
    return structuredClone(integrations)
  },

  async updateIntegrationStatus(integrationId: string, status: IntegrationStatus): Promise<Integration[]> {
    await delay(500)
    integrations = integrations.map((integration) => (integration.id === integrationId ? { ...integration, status } : integration))
    return structuredClone(integrations)
  },
}
