import { useMutation, useQueryClient } from '@tanstack/react-query'
import { settingsService } from '../api/settings-service'
import type { PayrollSettings } from '../types/settings-types'

export function useUpdatePayrollSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (patch: Partial<PayrollSettings>) => settingsService.updatePayrollSettings(patch),
    onSuccess: (data) => {
      queryClient.setQueryData(['settings', 'payroll'], data)
    },
  })
}
