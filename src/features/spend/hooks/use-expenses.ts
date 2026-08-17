import { useQuery } from '@tanstack/react-query'
import { spendService } from '../api/spend-service'

export function useExpenses() {
  return useQuery({
    queryKey: ['spend', 'expenses'],
    queryFn: () => spendService.getExpenses(),
  })
}
