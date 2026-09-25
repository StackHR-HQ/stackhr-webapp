import { useMutation } from '@tanstack/react-query'
import { onboardingApi } from '../api/onboarding-api'
import type { CompleteOnboardingPayload } from '../types/onboarding-types'

export function useCompleteOnboarding() {
  return useMutation({
    mutationFn: (payload: CompleteOnboardingPayload) => onboardingApi.completeOnboarding(payload),
  })
}
