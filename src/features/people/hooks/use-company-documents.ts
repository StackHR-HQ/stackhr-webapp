import { useQuery } from '@tanstack/react-query'
import { peopleService } from '../api/people-service'

export function useCompanyDocuments() {
  return useQuery({
    queryKey: ['people', 'documents', 'company'],
    queryFn: () => peopleService.getCompanyDocuments(),
  })
}
