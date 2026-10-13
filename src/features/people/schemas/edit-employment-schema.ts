import { z } from 'zod'
import { EMPLOYMENT_TYPES } from '../../onboarding/constants/onboarding-options'

// Max lengths mirror PATCH /people/employees/:id validation.
export const editEmploymentSchema = z.object({
  jobTitle: z.string().trim().min(1, 'Job title is required').max(150, 'Job title must be 150 characters or fewer'),
  departmentId: z.string(),
  managerId: z.string(),
  employmentType: z.enum(EMPLOYMENT_TYPES),
  startDate: z.string().trim().min(1, 'Start date is required'),
  status: z.enum(['active', 'pending_invitation', 'onboarding', 'offboarding']),
  workLocation: z.string().trim().max(150, 'Work location must be 150 characters or fewer'),
})

export type EditEmploymentFormValues = z.infer<typeof editEmploymentSchema>
