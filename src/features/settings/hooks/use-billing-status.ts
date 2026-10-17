import { useQuery } from '@tanstack/react-query'
import { getBillingStatus } from '../api/settings-api'

export function useBillingStatus(enabled = true) {
  return useQuery({
    queryKey: ['settings', 'billing-status'],
    queryFn: getBillingStatus,
    enabled,
  })
}
