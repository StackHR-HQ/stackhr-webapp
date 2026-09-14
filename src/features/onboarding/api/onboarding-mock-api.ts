import type { CompanyInfo, EmployeeDraft } from '../types/onboarding-types'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

let companyInfo: CompanyInfo = { name: '', industry: '', companySize: '', currency: 'NGN', payrollFrequency: 'Monthly' }

export const mockOnboardingApi = {
  async getCompanyInfo(): Promise<CompanyInfo> {
    await delay(250)
    return structuredClone(companyInfo)
  },

  async updateCompanyInfo(next: CompanyInfo): Promise<CompanyInfo> {
    await delay(400)
    companyInfo = structuredClone(next)
    return structuredClone(companyInfo)
  },

  async completeOnboarding(_payload: { companyInfo: CompanyInfo; employees: EmployeeDraft[] }): Promise<void> {
    await delay(900)
  },
}
