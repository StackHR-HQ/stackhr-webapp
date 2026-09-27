import { useQuery } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'

export function useDepartments() {
  return useQuery({
    queryKey: ['people', 'departments'],
    queryFn: () => peopleApi.getDepartments(),
  })
}
