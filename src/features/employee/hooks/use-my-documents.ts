import { useQuery } from '@tanstack/react-query'
import { employeeApi } from '../api/employee-api'

export function useMyDocuments() {
  return useQuery({ queryKey: ['me', 'documents'], queryFn: () => employeeApi.getDocuments() })
}
