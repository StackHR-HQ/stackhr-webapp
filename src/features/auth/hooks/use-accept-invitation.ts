import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api/auth-api'
import { useAuthStore } from '../store/auth-store'
import type { AcceptInvitationPayload } from '../types/auth-types'

export function useAcceptInvitation() {
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: (payload: AcceptInvitationPayload) => authApi.acceptInvitation(payload),
    onSuccess: (session) => {
      if (session) setSession(session, true)
    },
  })
}
