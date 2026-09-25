import { useQuery } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'

export function useOnboardingTemplates() {
  return useQuery({
    queryKey: ['people', 'onboarding', 'templates'],
    queryFn: () => peopleApi.getOnboardingTemplates(),
  })
}
