import { z } from 'zod'
import { EMPLOYMENT_TYPES } from '../../onboarding/constants/onboarding-options'

export const addEmployeeSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  workEmail: z.string().trim().min(1, 'Work email is required').email('Enter a valid email address'),
  jobTitle: z.string().trim().min(1, 'Job title is required'),
  employmentType: z.enum(EMPLOYMENT_TYPES),
  startDate: z.string().trim().min(1, 'Start date is required'),
  salaryAmount: z.coerce.number().positive('Salary must be greater than 0'),
})

export type AddEmployeeFormInput = z.input<typeof addEmployeeSchema>
export type AddEmployeeFormValues = z.infer<typeof addEmployeeSchema>
