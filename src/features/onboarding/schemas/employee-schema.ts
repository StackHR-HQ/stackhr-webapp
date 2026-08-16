import { z } from 'zod'
import { EMPLOYMENT_TYPES } from '../constants/onboarding-options'

export const employeeFormSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  department: z.string().trim().min(1, 'Department is required'),
  jobTitle: z.string().trim().min(1, 'Role is required'),
  employmentType: z.enum(EMPLOYMENT_TYPES),
  salary: z.coerce.number().positive('Salary must be greater than 0'),
  startDate: z.string().trim().min(1, 'Start date is required'),
  managerId: z.string().optional(),
})

// react-hook-form needs the pre-coercion (input) shape for its field values
// and the post-coercion (output) shape for what handleSubmit hands back —
// z.coerce.number() makes those two types diverge (salary is `unknown`
// going in, `number` coming out).
export type EmployeeFormInput = z.input<typeof employeeFormSchema>
export type EmployeeFormValues = z.infer<typeof employeeFormSchema>

// Looser variant for CSV rows: fields arrive as raw strings, employmentType
// is matched case-insensitively against the known list instead of requiring
// an exact enum match, and manager is a free-text name (no id to reference
// yet — rows are validated independently of each other).
export const employeeCsvRowSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
  department: z.string().trim().min(1, 'Department is required'),
  jobTitle: z.string().trim().min(1, 'Role is required'),
  employmentType: z
    .string()
    .trim()
    .min(1, 'Employment type is required')
    .refine(
      (value) => EMPLOYMENT_TYPES.some((type) => type.toLowerCase() === value.toLowerCase()),
      `Must be one of: ${EMPLOYMENT_TYPES.join(', ')}`,
    ),
  salary: z.coerce.number().positive('Salary must be greater than 0'),
  startDate: z.string().trim().min(1, 'Start date is required'),
  managerName: z.string().trim().optional(),
})

export type EmployeeCsvRowValues = z.infer<typeof employeeCsvRowSchema>
