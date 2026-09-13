import { useMutation, useQueryClient } from '@tanstack/react-query'
import { peopleService } from '../api/people-service'

export function useUpdateOnboardingChecklist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ employeeId, itemId, completed }: { employeeId: string; itemId: string; completed: boolean }) =>
      peopleService.updateOnboardingChecklist(employeeId, itemId, completed),
    onSuccess: (row) => {
      void queryClient.invalidateQueries({ queryKey: ['people', 'onboarding', 'employees'] })
      void queryClient.invalidateQueries({ queryKey: ['people', 'employees', row.employeeId] })
    },
  })
}
