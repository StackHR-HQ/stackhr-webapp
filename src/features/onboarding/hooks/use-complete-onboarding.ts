import { useMutation } from '@tanstack/react-query'
import { onboardingService } from '../api/onboarding-service'
import type { CompanyInfo, EmployeeDraft } from '../types/onboarding-types'

export function useCompleteOnboarding() {
  return useMutation({
    mutationFn: (payload: { companyInfo: CompanyInfo; employees: EmployeeDraft[] }) =>
      onboardingService.completeOnboarding(payload),
  })
}
