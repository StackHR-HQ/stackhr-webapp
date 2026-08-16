import { z } from 'zod'

export const companyInfoSchema = z.object({
  name: z.string().trim().min(1, 'Company name is required'),
  logoDataUrl: z.string().optional(),
  industry: z.string().min(1, 'Select an industry'),
  companySize: z.string().min(1, 'Select a company size'),
  taxId: z.string().trim().optional(),
  currency: z.string().min(1, 'Select a currency'),
  payrollFrequency: z.string().min(1, 'Select a payroll frequency'),
})

export type CompanyInfoFormValues = z.infer<typeof companyInfoSchema>
