import type { EarningComponent } from '../types/payroll-types'

export const BASIC_PERCENT = 0.45
export const HOUSING_PERCENT = 0.25
export const TRANSPORT_PERCENT = 0.15
// Other allowances take the remainder, so gross always reconciles exactly.

export const EARNING_COMPONENTS: EarningComponent[] = [
  {
    id: 'basic',
    name: 'Basic salary',
    percentOfGross: BASIC_PERCENT * 100,
    description: 'The core salary component, and the base for most statutory calculations.',
  },
  {
    id: 'housing',
    name: 'Housing allowance',
    percentOfGross: HOUSING_PERCENT * 100,
    description: 'Contributes to the BHT (Basic + Housing + Transport) base used for pension.',
  },
  {
    id: 'transport',
    name: 'Transport allowance',
    percentOfGross: TRANSPORT_PERCENT * 100,
    description: 'Contributes to the BHT base used for pension.',
  },
  {
    id: 'other',
    name: 'Other allowances',
    percentOfGross: Math.round((1 - BASIC_PERCENT - HOUSING_PERCENT - TRANSPORT_PERCENT) * 100),
    description: 'Remaining taxable allowances outside the BHT base.',
  },
]
