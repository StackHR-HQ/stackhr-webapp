import { useQuery } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'

export function useEmployee(id: string | undefined) {
  return useQuery({
    queryKey: ['people', 'employees', id],
    queryFn: () => peopleApi.getEmployee(id!),
    enabled: Boolean(id),
  })
}
