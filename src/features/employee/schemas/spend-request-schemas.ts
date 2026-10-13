import { z } from 'zod'

export const EXPENSE_CATEGORIES = [
  'Travel',
  'Transport',
  'Meals & Entertainment',
  'Client Hospitality',
  'Office Supplies',
  'Software & Subscriptions',
  'Training & Conferences',
  'Other',
] as const

// Today as YYYY-MM-DD in the user's own timezone, matching a date input's value.
export const todayInputValue = () => new Date().toLocaleDateString('en-CA')

export const PAYMENT_METHODS = [
  { value: 'BANK_TRANSFER', label: 'Bank transfer' },
  { value: 'CARD', label: 'Card' },
  { value: 'CASH', label: 'Cash' },
] as const

export const REPAYMENT_MONTH_OPTIONS = [1, 2, 3, 4, 5, 6] as const

export const expenseSchema = z.object({
  category: z.string().min(1, 'Choose a category'),
  // Whole-currency amount as typed, e.g. 25000 for ₦25,000.
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  description: z.string().trim().max(500, 'Description must be 500 characters or fewer').optional(),
  // YYYY-MM-DD from the date input: when the money was spent.
  expenseDate: z
    .string()
    .min(1, 'Choose the date you paid')
    .refine((value) => value <= todayInputValue(), "The date can't be in the future"),
  paymentMethod: z.enum(['BANK_TRANSFER', 'CARD', 'CASH'], { message: 'Choose how you paid' }),
})

export type ExpenseFormInput = z.input<typeof expenseSchema>
export type ExpenseFormValues = z.infer<typeof expenseSchema>

export const salaryAdvanceSchema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  repaymentMonths: z.coerce.number().int().min(1, 'Choose a repayment period'),
  reason: z.string().trim().max(500, 'Reason must be 500 characters or fewer').optional(),
})

export type SalaryAdvanceFormInput = z.input<typeof salaryAdvanceSchema>
export type SalaryAdvanceFormValues = z.infer<typeof salaryAdvanceSchema>
