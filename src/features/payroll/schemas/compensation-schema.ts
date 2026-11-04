import { z } from 'zod'

// Whole-currency monthly amounts as typed, e.g. 300000 for ₦300,000.
// An empty allowance coerces to 0.
const allowance = z.coerce.number({ message: 'Enter an amount' }).min(0, "Amount can't be negative")

export const compensationSchema = z.object({
  basicSalary: z.coerce.number({ message: 'Enter an amount' }).positive('Basic salary must be greater than 0'),
  housingAllowance: allowance,
  transportAllowance: allowance,
  otherAllowances: allowance,
})

export type CompensationFormInput = z.input<typeof compensationSchema>
export type CompensationFormValues = z.infer<typeof compensationSchema>
