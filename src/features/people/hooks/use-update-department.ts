import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { DepartmentInput } from '../api/people-api'
import { peopleService } from '../api/people-service'

export function useUpdateDepartment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DepartmentInput }) => peopleService.updateDepartment(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['people', 'departments'] })
      void queryClient.invalidateQueries({ queryKey: ['people', 'employees'] })
    },
  })
}
