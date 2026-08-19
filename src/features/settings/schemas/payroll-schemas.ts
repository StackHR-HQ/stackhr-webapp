import { z } from 'zod'

export const complianceProfileSchema = z.object({
  country: z.string().min(1, 'Select a country'),
  registeredEntityType: z.string().min(1, 'Select an entity type'),
  applyMinimumWageExemption: z.boolean(),
  autoApplyLatestTaxRules: z.boolean(),
})

export type ComplianceProfileFormValues = z.infer<typeof complianceProfileSchema>
