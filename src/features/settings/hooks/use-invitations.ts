import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { teamAccessApi } from '../api/team-access-api'
import { teamAccessService } from '../api/team-access-service'
import type { Role } from '../types/team-access-types'

const INVITATIONS_KEY = ['settings', 'invitations']

export function useInvitations() {
  return useQuery({
    queryKey: INVITATIONS_KEY,
    queryFn: () => teamAccessService.getInvitations(),
  })
}

function useInvitationMutation<TVariables>(mutationFn: (variables: TVariables) => Promise<void>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: INVITATIONS_KEY }),
  })
}

export function useInviteMember() {
  return useInvitationMutation((payload: { email: string; role: Role }) => teamAccessApi.inviteMember(payload))
}

export function useResendInvitation() {
  return useInvitationMutation((id: string) => teamAccessApi.resendInvitation(id))
}

export function useRevokeInvitation() {
  return useInvitationMutation((id: string) => teamAccessApi.revokeInvitation(id))
}
