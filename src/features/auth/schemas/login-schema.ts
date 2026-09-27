import { z } from 'zod'

export const loginSchema = z.object({
  // Optional: only needed to disambiguate an email shared across workspaces.
  orgSlug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]*$/i, 'Use letters, numbers, and hyphens only')
    .optional(),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean(),
})

export type LoginFormValues = z.infer<typeof loginSchema>
