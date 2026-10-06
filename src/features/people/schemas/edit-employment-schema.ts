import { z } from 'zod'

// Max lengths mirror PATCH /people/employees/:id validation.
export const editEmploymentSchema = z.object({
  jobTitle: z.string().trim().min(1, 'Job title is required').max(150, 'Job title must be 150 characters or fewer'),
  managerId: z.string(),
  workLocation: z.string().trim().max(150, 'Work location must be 150 characters or fewer'),
})

export type EditEmploymentFormValues = z.infer<typeof editEmploymentSchema>
