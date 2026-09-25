import { useMutation, useQueryClient } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'
import type { CreateEmployeePayload } from '../types/people-types'

export function useCreateEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) => peopleApi.createEmployee(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['people', 'employees'] }),
  })
}
