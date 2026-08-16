import { http } from '../../../lib/http'
import type { CompanyInfo, EmployeeDraft } from '../types/onboarding-types'

// Real backend call. Not wired up yet — the endpoint doesn't exist. Kept
// behind the same shape as onboarding-mock-api.ts so onboarding-service.ts
// can swap to this by flipping VITE_USE_MOCK_AUTH once the backend is live.
export const onboardingApi = {
  async completeOnboarding(payload: { companyInfo: CompanyInfo; employees: EmployeeDraft[] }): Promise<void> {
    await http.post('/onboarding/complete', payload)
  },
}
