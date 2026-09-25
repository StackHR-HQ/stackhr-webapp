import { http } from '../../../lib/http'
import type { SendInvitationPayload } from '../types/invitation-types'

export const invitationsApi = {
  async sendInvitation(payload: SendInvitationPayload): Promise<void> {
    await http.post('/invitations', payload)
  },
}
