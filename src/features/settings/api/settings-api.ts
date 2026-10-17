import { http } from '../../../lib/http'
import { humanizeEnum } from '../../employee/lib/profile-format'
import type { StatutoryContributionRule } from '../../payroll/types/payroll-types'
import type {
  AuthenticationSettings,
  BillingSettings,
  BillingStatus,
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
  taxId: string | null
  registrationNumber: string | null
  businessType: string | null
  website: string | null
  foundedYear: number | null
  addressLine1: string | null
  addressLine2: string | null
  city: string | null
  state: string | null
  country: string | null
  postalCode: string | null
  primaryColor: string | null
  accentColor: string | null
  createdAt: string
  updatedAt: string
}

function organizationSettingsFrom(response: OrganizationResponse): OrganizationSettings {
  const frequencies: Record<string, string> = { MONTHLY: 'Monthly', BIWEEKLY: 'Bi-weekly', WEEKLY: 'Weekly' }
  const businessTypes: Record<string, string> = { PRIVATE_LIMITED_COMPANY: 'Private Limited Company', PUBLIC_LIMITED_COMPANY: 'Public Limited Company', SOLE_PROPRIETORSHIP: 'Sole Proprietorship', PARTNERSHIP: 'Partnership', NON_GOVERNMENTAL_ORGANIZATION: 'Non-Governmental Organization' }
  return {
    companyInformation: {
      name: response.name,
      industry: response.industry,
      companySize: response.companySize,
      currency: response.currency,
      payrollFrequency: frequencies[response.payrollFrequency.toUpperCase()] ?? response.payrollFrequency,
    },
    branding: {
      logoDataUrl: response.logo ?? undefined,
      primaryColor: response.primaryColor ?? '#0066ff',
      accentColor: response.accentColor ?? '#08060d',
    },
    address: { line1: response.addressLine1 ?? '', line2: response.addressLine2 ?? '', city: response.city ?? '', state: response.state ?? '', country: response.country ?? '', postalCode: response.postalCode ?? '' },
    businessInformation: {
      registrationNumber: response.registrationNumber ?? '',
      taxId: response.taxId ?? '',
      businessType: businessTypes[response.businessType ?? ''] ?? response.businessType ?? '',
      website: response.website ?? '',
      foundedYear: response.foundedYear?.toString() ?? '',
    },
  }
}

function payrollFrequencyValue(value: string): string {
  const normalized = value.toUpperCase().replace('-', '')
  return normalized === 'MONTHLY' ? 'MONTHLY' : normalized === 'BIWEEKLY' ? 'BIWEEKLY' : 'WEEKLY'
}

function businessTypeValue(value: string): string {
  return value.toUpperCase().replaceAll(' ', '_').replaceAll('-', '_')
}

function organizationUpdatePayload(patch: Partial<OrganizationSettings>) {
  return {
    ...(patch.companyInformation
      ? {
          companyName: patch.companyInformation.name,
          industry: patch.companyInformation.industry,
          companySize: patch.companyInformation.companySize,
          currency: patch.companyInformation.currency,
          payrollFrequency: payrollFrequencyValue(patch.companyInformation.payrollFrequency),
        }
      : {}),
    ...(patch.businessInformation
      ? { taxId: patch.businessInformation.taxId || null, registrationNumber: patch.businessInformation.registrationNumber || null, businessType: patch.businessInformation.businessType ? businessTypeValue(patch.businessInformation.businessType) : null, website: patch.businessInformation.website || null, foundedYear: patch.businessInformation.foundedYear ? Number(patch.businessInformation.foundedYear) : null }
      : {}),
    ...(patch.address
      ? { addressLine1: patch.address.line1 || null, addressLine2: patch.address.line2 || null, city: patch.address.city || null, state: patch.address.state || null, country: patch.address.country || null, postalCode: patch.address.postalCode || null }
      : {}),
    ...(patch.branding?.logoDataUrl
      ? patch.branding.logoDataUrl.startsWith('data:image/')
        ? { logoDataUrl: patch.branding.logoDataUrl }
        : { logo: patch.branding.logoDataUrl }
      : {}),
    ...(patch.branding ? { primaryColor: patch.branding.primaryColor, accentColor: patch.branding.accentColor } : {}),
  }
}

interface ApiBillingStatus {
  status: string
  planName: string
  trialStartedAt: string | null
  trialEndsAt: string | null
  trialLengthDays: number | null
  activeEmployeeCount: number
  seatLimit: number
  billingCycle: string
  nextBillingDate: string | null
}

const PLAN_STATUS: Record<string, BillingStatus['status']> = {
  TRIALING: 'trial',
  ACTIVE: 'active',
  PAST_DUE: 'past_due',
  UNPAID: 'past_due',
  CANCELED: 'canceled',
  CANCELLED: 'canceled',
}

// GET /billing/status is the only billing endpoint. The rest of the Billing
// page (subscription changes, payment method, history, invoices) has none yet.
export async function getBillingStatus(): Promise<BillingStatus> {
  const { data } = await http.get<ApiBillingStatus>('/billing/status')
  return {
    planName: humanizeEnum(data.planName.replace(/_TIER$/, '')),
    billingCycle: data.billingCycle.toUpperCase() === 'ANNUAL' ? 'annual' : 'monthly',
    status: PLAN_STATUS[data.status.toUpperCase()] ?? 'active',
    trialEndsAt: data.trialEndsAt ?? undefined,
    trialLengthDays: data.trialLengthDays ?? undefined,
    seatsUsed: data.activeEmployeeCount,
    seatsLimit: data.seatLimit,
  }
}

// Of these, only the organization calls exist on the backend. The settings
// pages show Coming soon for the rest when VITE_USE_MOCK_SETTINGS is off.
export const settingsApi = {
  async getOrganizationSettings(): Promise<OrganizationSettings> {
    const { data } = await http.get<OrganizationResponse>('/organization/current')
    return organizationSettingsFrom(data)
  },

  async updateOrganizationSettings(patch: Partial<OrganizationSettings>): Promise<void> {
    await http.patch('/onboarding/company', organizationUpdatePayload(patch))
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

  async getIntegrations(): Promise<Integration[]> {
    const { data } = await http.get<Integration[]>('/settings/integrations')
    return data
  },

  async updateIntegrationStatus(integrationId: string, status: IntegrationStatus): Promise<Integration[]> {
    const { data } = await http.patch<Integration[]>(`/settings/integrations/${integrationId}`, { status })
    return data
  },
}
