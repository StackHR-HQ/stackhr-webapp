import { USE_MOCK_AUTH } from '../../../lib/env'
import { onboardingApi } from './onboarding-api'
import { mockOnboardingApi } from './onboarding-mock-api'

export const onboardingService = USE_MOCK_AUTH ? mockOnboardingApi : onboardingApi
