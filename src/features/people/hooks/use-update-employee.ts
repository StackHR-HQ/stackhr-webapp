import { useMutation, useQueryClient } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'
import type { UpdateEmployeePayload } from '../types/people-types'

export function useUpdateEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateEmployeePayload & { id: string }) => peopleApi.updateEmployee(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['people', 'employees'] }),
  })
}
