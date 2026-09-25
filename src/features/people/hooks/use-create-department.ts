import { useMutation, useQueryClient } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'
import type { CreateDepartmentPayload } from '../types/people-types'

export function useCreateDepartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateDepartmentPayload) => peopleApi.createDepartment(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['people', 'departments'] }),
  })
}
