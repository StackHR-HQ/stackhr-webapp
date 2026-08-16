import { z } from 'zod'

export const otpSchema = z.object({
  code: z
    .string()
    .trim()
    .length(6, 'Enter the 6-digit code')
    .regex(/^\d{6}$/, 'Digits only'),
})

export type OtpFormValues = z.infer<typeof otpSchema>
