import { useQuery } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'

export function useEmployeeOnboarding() {
  return useQuery({
    queryKey: ['people', 'onboarding', 'employees'],
    queryFn: () => peopleApi.getEmployeeOnboarding(),
  })
}
