import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { DepartmentInput } from '../api/people-api'
import { peopleService } from '../api/people-service'

export function useCreateDepartment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: DepartmentInput) => peopleService.createDepartment(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['people', 'departments'] })
      void queryClient.invalidateQueries({ queryKey: ['people', 'employees'] })
    },
  })
}
