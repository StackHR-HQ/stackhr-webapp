import { useMutation, useQueryClient } from '@tanstack/react-query'
import { settingsService } from '../api/settings-service'
import type { PaymentMethod } from '../types/settings-types'

export function useUpdatePaymentMethod() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (paymentMethod: PaymentMethod) => settingsService.updatePaymentMethod(paymentMethod),
    onSuccess: (data) => {
      queryClient.setQueryData(['settings', 'billing'], data)
    },
  })
}
