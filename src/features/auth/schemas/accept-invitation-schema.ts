import { z } from 'zod'

export const newAccountInvitationSchema = z
  .object({
    password: z.string().min(12, 'Password must be at least 12 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const existingAccountInvitationSchema = z.object({
  password: z.string().min(1, 'Enter your password'),
  confirmPassword: z.string().optional(),
})

export type AcceptInvitationFormValues = z.infer<typeof existingAccountInvitationSchema>

export const workspaceInvitationSchema = z
  .object({
    fullName: z.string().trim().min(1, 'Enter your full name'),
    password: z.string().min(12, 'Password must be at least 12 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type WorkspaceInvitationFormValues = z.infer<typeof workspaceInvitationSchema>
