import { getApiErrorMessage, http } from '../../../lib/http'
import { WaitlistError, type JoinWaitlistPayload, type WaitlistEntry } from '../types/waitlist-types'

export const waitlistApi = {
  async join(payload: JoinWaitlistPayload): Promise<WaitlistEntry> {
    try {
      const { data } = await http.post<WaitlistEntry>('/waitlist', payload)
      return data
    } catch (error) {
      throw new WaitlistError(getApiErrorMessage(error))
    }
  },
}
