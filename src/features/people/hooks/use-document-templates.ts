import { useQuery } from '@tanstack/react-query'
import { peopleService } from '../api/people-service'

export function useDocumentTemplates() {
  return useQuery({
    queryKey: ['people', 'documents', 'templates'],
    queryFn: () => peopleService.getDocumentTemplates(),
  })
}
