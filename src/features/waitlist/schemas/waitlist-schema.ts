import { z } from 'zod'

export const waitlistSchema = z.object({
  name: z.string().trim().min(2, 'Your name is required'),
  position: z.string().trim().min(2, 'Your role is required'),
  businessName: z.string().trim().min(2, 'Company name is required'),
  businessEmail: z.string().trim().min(1, 'Work email is required').email('Enter a valid email address'),
})

export type WaitlistFormValues = z.infer<typeof waitlistSchema>
