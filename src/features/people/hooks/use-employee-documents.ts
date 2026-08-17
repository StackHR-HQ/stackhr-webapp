import { useQuery } from '@tanstack/react-query'
import { peopleService } from '../api/people-service'

export function useEmployeeDocuments() {
  return useQuery({
    queryKey: ['people', 'documents', 'employees'],
    queryFn: () => peopleService.getEmployeeDocuments(),
  })
}
