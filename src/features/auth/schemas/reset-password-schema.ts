import { z } from 'zod'

export const resetPasswordSchema = z
  .object({
    password: z.string().min(12, 'Password must be at least 12 characters'),
    confirmPassword: z.string().min(1, 'Confirm your new password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
