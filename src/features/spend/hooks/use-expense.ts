import { useQuery } from '@tanstack/react-query'
import { spendService } from '../api/spend-service'

export function useExpense(id: string | undefined) {
  return useQuery({
    queryKey: ['spend', 'expenses', id],
    queryFn: () => spendService.getExpense(id!),
    enabled: Boolean(id),
  })
}
