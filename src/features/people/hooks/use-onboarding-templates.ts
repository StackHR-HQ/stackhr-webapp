import { useQuery } from '@tanstack/react-query'
import { peopleService } from '../api/people-service'

export function useOnboardingTemplates() {
  return useQuery({
    queryKey: ['people', 'onboarding', 'templates'],
    queryFn: () => peopleService.getOnboardingTemplates(),
  })
}
