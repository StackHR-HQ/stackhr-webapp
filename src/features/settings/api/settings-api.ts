import { http } from '../../../lib/http'
import type { StatutoryContributionRule } from '../../payroll/types/payroll-types'
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

interface OrganizationResponse {
  id: string
  name: string
  slug: string
  logo: string | null
  industry: string
  companySize: string
  currency: string
  payrollFrequency: string
  taxId: string
  createdAt: string
  updatedAt: string
}

interface UpdateOrganizationResponse {
  organization: OrganizationResponse
}

function organizationSettingsFrom(response: OrganizationResponse): OrganizationSettings {
  return {
    companyInformation: {
      name: response.name,
      industry: response.industry,
      companySize: response.companySize,
      currency: response.currency,
      payrollFrequency: response.payrollFrequency,
    },
    branding: {
      logoDataUrl: response.logo ?? undefined,
      // Brand colours are not persisted by the current Organization API.
      primaryColor: '#0066ff',
      accentColor: '#08060d',
    },
    address: { line1: '', line2: '', city: '', state: '', country: '', postalCode: '' },
    businessInformation: {
      registrationNumber: '',
      taxId: response.taxId,
      businessType: '',
      website: '',
      foundedYear: '',
    },
  }
}

function organizationUpdatePayload(patch: Partial<OrganizationSettings>) {
  return {
    ...(patch.companyInformation
      ? {
          companyName: patch.companyInformation.name,
          industry: patch.companyInformation.industry,
          companySize: patch.companyInformation.companySize,
          currency: patch.companyInformation.currency,
          payrollFrequency: patch.companyInformation.payrollFrequency,
        }
      : {}),
    ...(patch.businessInformation ? { taxId: patch.businessInformation.taxId } : {}),
    ...(patch.branding?.logoDataUrl ? { logoDataUrl: patch.branding.logoDataUrl } : {}),
  }
}

// Real backend calls. Not wired up yet — the endpoints don't exist. Kept
// behind the same shape as settings-mock-api.ts so settings-service.ts can
// swap to this by flipping VITE_USE_MOCK_AUTH once the backend is live.
export const settingsApi = {
  async getOrganizationSettings(): Promise<OrganizationSettings> {
    const { data } = await http.get<OrganizationResponse>('/organization/current')
    return organizationSettingsFrom(data)
  },

  async updateOrganizationSettings(patch: Partial<OrganizationSettings>): Promise<OrganizationSettings> {
    const { data } = await http.patch<UpdateOrganizationResponse>('/onboarding/company', organizationUpdatePayload(patch))
    return organizationSettingsFrom(data.organization)
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

  async getBillingSettings(): Promise<BillingSettings> {
    const { data } = await http.get<BillingSettings>('/settings/billing')
    return data
  },

  async updateSubscription(patch: Partial<BillingSettings['subscription']>): Promise<BillingSettings> {
    const { data } = await http.patch<BillingSettings>('/settings/billing/subscription', patch)
    return data
  },

  async updatePaymentMethod(paymentMethod: PaymentMethod): Promise<BillingSettings> {
    const { data } = await http.put<BillingSettings>('/settings/billing/payment-method', paymentMethod)
    return data
  },

  async getSecuritySettings(): Promise<SecuritySettings> {
    const { data } = await http.get<SecuritySettings>('/settings/security')
    return data
  },

  async updateAuthenticationSettings(patch: Partial<AuthenticationSettings>): Promise<SecuritySettings> {
    const { data } = await http.patch<SecuritySettings>('/settings/security/authentication', patch)
    return data
  },

  async revokeSession(sessionId: string): Promise<SecuritySettings> {
    const { data } = await http.delete<SecuritySettings>(`/settings/security/sessions/${sessionId}`)
    return data
  },

  async changePassword(payload: { currentPassword: string; newPassword: string }): Promise<void> {
    await http.post('/settings/security/password', payload)
  },

  async getIntegrations(): Promise<Integration[]> {
    const { data } = await http.get<Integration[]>('/settings/integrations')
    return data
  },

  async updateIntegrationStatus(integrationId: string, status: IntegrationStatus): Promise<Integration[]> {
    const { data } = await http.patch<Integration[]>(`/settings/integrations/${integrationId}`, { status })
    return data
  },
}
