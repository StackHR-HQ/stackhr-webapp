export const INDUSTRIES = [
  'Technology',
  'Retail & E-commerce',
  'Financial Services',
  'Healthcare',
  'Manufacturing',
  'Hospitality',
  'Professional Services',
  'Agriculture',
  'Construction',
  'Other',
] as const

export const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'] as const

export const CURRENCIES = [
  { code: 'NGN', label: 'Nigerian Naira', symbol: '₦' },
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'GHS', label: 'Ghanaian Cedi', symbol: '₵' },
  { code: 'KES', label: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'ZAR', label: 'South African Rand', symbol: 'R' },
  { code: 'GBP', label: 'British Pound', symbol: '£' },
] as const

export const PAYROLL_FREQUENCIES = ['Monthly', 'Bi-weekly', 'Weekly'] as const

export const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Intern'] as const

export function currencySymbol(code: string): string {
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? code
}
