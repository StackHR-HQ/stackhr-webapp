import { z } from 'zod'

export const loginSchema = z.object({
  orgSlug: z
    .string()
    .trim()
    .min(1, 'Workspace is required')
    .regex(/^[a-z0-9-]+$/i, 'Use letters, numbers, and hyphens only'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean(),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
