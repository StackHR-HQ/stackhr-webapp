import type { DeductionType } from '../types/payroll-types'

export const DEDUCTION_TYPES: DeductionType[] = [
  {
    id: 'paye',
    name: 'PAYE (Pay-As-You-Earn tax)',
    category: 'statutory',
    rateDescription: 'Progressive, per the active tax rule set',
    description: 'Income tax withheld from every payslip and remitted to the relevant state tax authority.',
  },
  {
    id: 'pension-employee',
    name: 'Pension (employee share)',
    category: 'statutory',
    rateDescription: '8% of BHT',
    description: 'The employee-funded portion of statutory pension contributions.',
  },
  {
    id: 'nhf-employee',
    name: 'National Housing Fund',
    category: 'statutory',
    rateDescription: '2.5% of basic salary',
    description: 'Employee contribution toward the National Housing Fund, where applicable.',
  },
  {
    id: 'salary-advance-repayment',
    name: 'Salary advance repayment',
    category: 'other',
    rateDescription: 'Installment set at approval',
    description: 'Recurring deduction against an employee’s approved salary advance until fully repaid.',
  },
]
