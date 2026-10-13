import { useMutation, useQueryClient } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'

export function useCompleteOnboarding() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (employeeId: string) => peopleApi.completeOnboarding(employeeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['people'] })
      // Active employees are included in the next payroll run.
      void queryClient.invalidateQueries({ queryKey: ['payroll'] })
    },
  })
}
