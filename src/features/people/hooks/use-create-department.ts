import { useMutation, useQueryClient } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'
import type { DepartmentInput } from '../types/people-types'

export function useCreateDepartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: DepartmentInput) => peopleApi.createDepartment(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['people', 'departments'] })
      void queryClient.invalidateQueries({ queryKey: ['people', 'employees'] })
    },
  })
}
