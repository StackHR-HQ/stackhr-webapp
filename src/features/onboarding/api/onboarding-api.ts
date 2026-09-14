import { http } from '../../../lib/http'
import type { CompanyInfo, EmployeeDraft } from '../types/onboarding-types'

interface CompanyResponse {
  id: string; name: string; slug: string; logo: string | null; industry: string; companySize: string
  currency: string; payrollFrequency: string; taxId: string | null; registrationNumber?: string | null; businessType?: string | null; website?: string | null; foundedYear?: number | null
  addressLine1?: string | null; addressLine2?: string | null; city?: string | null; state?: string | null; country?: string | null; postalCode?: string | null; primaryColor?: string | null; accentColor?: string | null
  createdAt: string; updatedAt: string
}

function toCompanyInfo(company: CompanyResponse): CompanyInfo {
  const frequencies: Record<string, string> = { MONTHLY: 'Monthly', BIWEEKLY: 'Bi-weekly', WEEKLY: 'Weekly' }
  return {
    name: company.name,
    logoDataUrl: company.logo ?? undefined,
    industry: company.industry,
    companySize: company.companySize,
    taxId: company.taxId ?? undefined,
    currency: company.currency,
    payrollFrequency: frequencies[company.payrollFrequency.toUpperCase()] ?? company.payrollFrequency,
    registrationNumber: company.registrationNumber ?? undefined,
    businessType: company.businessType ?? undefined,
    website: company.website ?? undefined,
    foundedYear: company.foundedYear ?? undefined,
    addressLine1: company.addressLine1 ?? undefined,
    addressLine2: company.addressLine2 ?? undefined,
    city: company.city ?? undefined,
    state: company.state ?? undefined,
    country: company.country ?? undefined,
    postalCode: company.postalCode ?? undefined,
    primaryColor: company.primaryColor ?? undefined,
    accentColor: company.accentColor ?? undefined,
  }
}

function toCompanyPayload(company: CompanyInfo) {
  const frequency = company.payrollFrequency.toUpperCase().replace('-', '')
  return {
    companyName: company.name,
    industry: company.industry,
    companySize: company.companySize,
    currency: company.currency,
    payrollFrequency: frequency === 'MONTHLY' ? 'MONTHLY' : frequency === 'BIWEEKLY' ? 'BIWEEKLY' : 'WEEKLY',
    taxId: company.taxId || null,
    ...(company.logoDataUrl ? { logoDataUrl: company.logoDataUrl } : {}),
    ...(company.registrationNumber ? { registrationNumber: company.registrationNumber } : {}),
    ...(company.businessType ? { businessType: company.businessType } : {}),
    ...(company.website ? { website: company.website } : {}),
    ...(company.foundedYear ? { foundedYear: company.foundedYear } : {}),
    ...(company.addressLine1 ? { addressLine1: company.addressLine1 } : {}),
    ...(company.addressLine2 ? { addressLine2: company.addressLine2 } : {}),
    ...(company.city ? { city: company.city } : {}),
    ...(company.state ? { state: company.state } : {}),
    ...(company.country ? { country: company.country } : {}),
    ...(company.postalCode ? { postalCode: company.postalCode } : {}),
    ...(company.primaryColor ? { primaryColor: company.primaryColor } : {}),
    ...(company.accentColor ? { accentColor: company.accentColor } : {}),
  }
}

function businessTypeValue(value?: string): string | undefined {
  return value ? value.toUpperCase().replaceAll(' ', '_').replaceAll('-', '_') : undefined
}

// Real backend calls, kept behind the same shape as onboarding-mock-api.ts so
// onboarding-service.ts can swap to this by flipping VITE_USE_MOCK_AUTH.
export const onboardingApi = {
  async getCompanyInfo(): Promise<CompanyInfo> {
    const { data } = await http.get<CompanyResponse>('/onboarding/company')
    return toCompanyInfo(data)
  },

  async updateCompanyInfo(company: CompanyInfo): Promise<CompanyInfo> {
    await http.patch('/onboarding/company', toCompanyPayload(company))
    // The update response may contain only `{ organization: {}, onboarding: {} }`.
    return company
  },

  async completeOnboarding(payload: { companyInfo: CompanyInfo; employees: EmployeeDraft[] }): Promise<void> {
    const { name, ...companyInfo } = payload.companyInfo
    await http.post('/onboarding/complete', { ...payload, companyInfo: { name, ...companyInfo, businessType: businessTypeValue(companyInfo.businessType), payrollFrequency: toCompanyPayload(payload.companyInfo).payrollFrequency } })
  },
}
