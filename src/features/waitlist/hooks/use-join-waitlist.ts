import { useMutation } from '@tanstack/react-query'
import { waitlistApi } from '../api/waitlist-api'
import type { JoinWaitlistPayload } from '../types/waitlist-types'

export function useJoinWaitlist() {
  return useMutation({
    mutationFn: (payload: JoinWaitlistPayload) => waitlistApi.join(payload),
  })
}
