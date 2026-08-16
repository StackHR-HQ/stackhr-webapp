import type { CompanyInfo, EmployeeDraft } from '../types/onboarding-types'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const mockOnboardingApi = {
  async completeOnboarding(_payload: { companyInfo: CompanyInfo; employees: EmployeeDraft[] }): Promise<void> {
    await delay(900)
  },
}
