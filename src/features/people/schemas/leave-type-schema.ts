import { z } from 'zod'

export const leaveTypeSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  description: z.string().trim().optional(),
  daysPerYear: z.coerce.number().int('Use whole days').positive('Days per year must be greater than 0'),
  paid: z.boolean(),
  requiresApproval: z.boolean(),
})

export type LeaveTypeFormInput = z.input<typeof leaveTypeSchema>
export type LeaveTypeFormValues = z.infer<typeof leaveTypeSchema>
