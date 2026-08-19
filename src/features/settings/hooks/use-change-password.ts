import { useMutation } from '@tanstack/react-query'
import { settingsService } from '../api/settings-service'

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: { currentPassword: string; newPassword: string }) => settingsService.changePassword(payload),
  })
}
