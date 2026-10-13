import { USE_MOCK_SETTINGS } from '../../../lib/env'
import { mockTeamAccessApi } from './team-access-mock-api'
import { teamAccessApi } from './team-access-api'

export const teamAccessService = {
  ...(USE_MOCK_SETTINGS ? mockTeamAccessApi : teamAccessApi),
  // Invitations are served by the backend, so they skip the settings mock flag.
  getInvitations: teamAccessApi.getInvitations,
}
