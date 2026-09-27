import { useMutation, useQueryClient } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'
import type { DepartmentInput } from '../types/people-types'

export function useUpdateDepartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DepartmentInput }) => peopleApi.updateDepartment(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['people', 'departments'] })
      void queryClient.invalidateQueries({ queryKey: ['people', 'employees'] })
    },
  })
}
