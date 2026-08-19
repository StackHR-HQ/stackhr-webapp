import { z } from 'zod'

export const companyInformationSchema = z.object({
  name: z.string().trim().min(1, 'Company name is required'),
  industry: z.string().min(1, 'Select an industry'),
  companySize: z.string().min(1, 'Select a company size'),
  currency: z.string().min(1, 'Select a currency'),
  payrollFrequency: z.string().min(1, 'Select a payroll frequency'),
})

export type CompanyInformationFormValues = z.infer<typeof companyInformationSchema>

export const brandingSchema = z.object({
  logoDataUrl: z.string().optional(),
  primaryColor: z.string().min(1, 'Select a primary color'),
  accentColor: z.string().min(1, 'Select an accent color'),
})

export type BrandingFormValues = z.infer<typeof brandingSchema>

export const organizationAddressSchema = z.object({
  line1: z.string().trim().min(1, 'Address line 1 is required'),
  line2: z.string().trim(),
  city: z.string().trim().min(1, 'City is required'),
  state: z.string().trim().min(1, 'State is required'),
  country: z.string().trim().min(1, 'Country is required'),
  postalCode: z.string().trim(),
})

export type OrganizationAddressFormValues = z.infer<typeof organizationAddressSchema>

export const businessInformationSchema = z.object({
  registrationNumber: z.string().trim().min(1, 'Registration number is required'),
  taxId: z.string().trim().min(1, 'Tax ID is required'),
  businessType: z.string().min(1, 'Select a business type'),
  website: z.string().trim(),
  foundedYear: z.string().trim(),
})

export type BusinessInformationFormValues = z.infer<typeof businessInformationSchema>
