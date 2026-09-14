import { http } from '../../../lib/http'
import type { CompanyInfo, EmployeeDraft } from '../types/onboarding-types'

interface CompanyResponse {
  id: string; name: string; slug: string; logo: string | null; industry: string; companySize: string
  currency: string; payrollFrequency: string; taxId: string | null; createdAt: string; updatedAt: string
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
  }
}

function toCompanyPayload(company: CompanyInfo) {
  return {
    companyName: company.name,
    industry: company.industry,
    companySize: company.companySize,
    currency: company.currency,
    payrollFrequency: company.payrollFrequency === 'Monthly' ? 'MONTHLY' : company.payrollFrequency === 'Bi-weekly' ? 'BIWEEKLY' : 'WEEKLY',
    taxId: company.taxId || null,
    ...(company.logoDataUrl ? { logoDataUrl: company.logoDataUrl } : {}),
  }
}

// Real backend calls, kept behind the same shape as onboarding-mock-api.ts so
// onboarding-service.ts can swap to this by flipping VITE_USE_MOCK_AUTH.
export const onboardingApi = {
  async getCompanyInfo(): Promise<CompanyInfo> {
    const { data } = await http.get<CompanyResponse>('/onboarding/company')
    return toCompanyInfo(data)
  },

  async updateCompanyInfo(company: CompanyInfo): Promise<CompanyInfo> {
    const { data } = await http.patch<CompanyResponse | { organization: CompanyResponse }>('/onboarding/company', toCompanyPayload(company))
    return toCompanyInfo('organization' in data ? data.organization : data)
  },

  async completeOnboarding(payload: { companyInfo: CompanyInfo; employees: EmployeeDraft[] }): Promise<void> {
    await http.post('/onboarding/complete', payload)
  },
}
