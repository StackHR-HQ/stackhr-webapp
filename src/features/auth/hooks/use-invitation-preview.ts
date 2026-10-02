import { useQuery } from '@tanstack/react-query'
import { authApi } from '../api/auth-api'

export function useInvitationPreview(token: string | undefined) {
  return useQuery({
    queryKey: ['auth', 'invitation', token],
    queryFn: () => authApi.previewInvitation(token!),
    enabled: Boolean(token),
    retry: false,
  })
}
