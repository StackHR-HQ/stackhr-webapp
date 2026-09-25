import { useQuery } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'

export function useEmployeeDocuments() {
  return useQuery({
    queryKey: ['people', 'documents', 'employees'],
    queryFn: () => peopleApi.getEmployeeDocuments(),
  })
}
