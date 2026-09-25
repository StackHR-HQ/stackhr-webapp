export interface JoinWaitlistPayload {
  name: string
  position: string
  businessName: string
  businessEmail: string
}

export interface WaitlistEntry extends JoinWaitlistPayload {
  id: string
  alreadyJoined: boolean
  createdAt: string
}

export class WaitlistError extends Error {}
