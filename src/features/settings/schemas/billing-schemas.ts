import { z } from 'zod'

export const paymentMethodSchema = z.object({
  cardholderName: z.string().trim().min(1, 'Cardholder name is required'),
  brand: z.string().min(1, 'Select a card brand'),
  last4: z
    .string()
    .trim()
    .regex(/^\d{4}$/, 'Enter the last 4 digits of the card'),
  expiryMonth: z.number().int().min(1, 'Invalid month').max(12, 'Invalid month'),
  expiryYear: z.number().int().min(new Date().getFullYear(), 'Card is expired'),
})

export type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>
