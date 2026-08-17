import { useQuery } from '@tanstack/react-query'
import { peopleService } from '../api/people-service'

export function useEmployeeOnboarding() {
  return useQuery({
    queryKey: ['people', 'onboarding', 'employees'],
    queryFn: () => peopleService.getEmployeeOnboarding(),
  })
}
