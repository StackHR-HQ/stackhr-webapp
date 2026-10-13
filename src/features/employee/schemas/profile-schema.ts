import { z } from 'zod'

// Max lengths mirror the backend's PATCH /me/profile validation.
const optionalText = (max: number, label: string) =>
  z.string().trim().max(max, `${label} must be ${max} characters or fewer`)

export const profileSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(100, 'First name must be 100 characters or fewer'),
  lastName: z.string().trim().min(1, 'Last name is required').max(100, 'Last name must be 100 characters or fewer'),
  dateOfBirth: z.string(),
  gender: z.string(),
  maritalStatus: z.string(),
  nationality: optionalText(100, 'Nationality'),
  phone: optionalText(20, 'Phone'),
  personalEmail: z.union([z.literal(''), z.string().trim().email('Enter a valid email address')]),
  address: optionalText(500, 'Address'),
  emergencyContactName: optionalText(150, 'Name'),
  emergencyContactRelationship: optionalText(100, 'Relationship'),
  emergencyContactPhone: optionalText(20, 'Phone'),
  bankName: optionalText(100, 'Bank name'),
  accountNumber: optionalText(20, 'Account number').regex(/^\d*$/, 'Account number must contain only digits'),
  accountName: optionalText(150, 'Account name'),
  tin: optionalText(20, 'TIN'),
  pensionProvider: optionalText(100, 'Pension provider'),
  pensionRsaNumber: optionalText(20, 'RSA number'),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
