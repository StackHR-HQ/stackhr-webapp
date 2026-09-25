import { useQuery } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'

export function useCompanyDocuments() {
  return useQuery({
    queryKey: ['people', 'documents', 'company'],
    queryFn: () => peopleApi.getCompanyDocuments(),
  })
}
