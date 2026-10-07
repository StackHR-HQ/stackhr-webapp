import { useQuery } from '@tanstack/react-query'
import { employeeApi } from '../api/employee-api'

export function useMyCompensationHistory() {
  return useQuery({
    queryKey: ['me', 'compensation-history'],
    queryFn: () => employeeApi.getCompensationHistory(),
  })
}
