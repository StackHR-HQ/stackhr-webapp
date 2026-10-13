import { useMutation, useQuery } from '@tanstack/react-query'
import { authApi } from '../api/auth-api'
import type { AcceptWorkspaceInvitationPayload } from '../types/auth-types'

export function useWorkspaceInvitation(invitationId: string | undefined) {
  return useQuery({
    queryKey: ['auth', 'workspace-invitation', invitationId],
    queryFn: () => authApi.previewWorkspaceInvitation(invitationId!),
    enabled: Boolean(invitationId),
    retry: false,
  })
}

export function useAcceptWorkspaceInvitation() {
  return useMutation({
    mutationFn: (payload: AcceptWorkspaceInvitationPayload) => authApi.acceptWorkspaceInvitation(payload),
  })
}
