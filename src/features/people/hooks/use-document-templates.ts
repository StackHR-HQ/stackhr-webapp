import { useQuery } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'

export function useDocumentTemplates() {
  return useQuery({
    queryKey: ['people', 'documents', 'templates'],
    queryFn: () => peopleApi.getDocumentTemplates(),
  })
}
