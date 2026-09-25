import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Organization } from '../../organizations/types/organization-types'
import { authApi } from '../api/auth-api'
import { useAuthStore } from '../store/auth-store'

export function useSwitchOrganization() {
  const queryClient = useQueryClient()
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: async (organization: Organization) => ({
      organization,
      session: await authApi.switchOrganization(organization.id),
    }),
    onSuccess: ({ organization, session }) => {
      // The backend's user.name isn't the org name, so take it from the org list.
      const rememberMe = useAuthStore.getState().rememberMe
      setSession({ user: { ...session.user, orgName: organization.name } }, rememberMe)
      queryClient.resetQueries()
    },
  })
}
