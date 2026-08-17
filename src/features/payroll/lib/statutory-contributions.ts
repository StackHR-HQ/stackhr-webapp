import type { StatutoryApplicability, StatutoryContributionRule } from '../types/payroll-types'

export function getStatutoryContributions(employeeCount: number): StatutoryContributionRule[] {
  const pensionApplicability: StatutoryApplicability = employeeCount >= 15 ? 'mandatory' : 'voluntary'
  const nhfApplicability: StatutoryApplicability = employeeCount >= 10 ? 'mandatory' : 'voluntary'
  const nsitfApplicability: StatutoryApplicability = employeeCount >= 5 ? 'mandatory' : 'not_applicable'

  return [
    {
      id: 'pension',
      name: 'Pension (RSA)',
      applicability: pensionApplicability,
      employeeRatePercent: 8,
      employerRatePercent: 10,
      base: 'bht',
      explanation:
        pensionApplicability === 'mandatory'
          ? `Mandatory for private organizations with 15 or more employees. Your organization has ${employeeCount} employees, so contributions are required for all eligible staff.`
          : `Private organizations with fewer than 15 employees may contribute voluntarily. Your organization currently has ${employeeCount} employees.`,
      legalReference: 'Pension Reform Act 2014',
    },
    {
      id: 'nhf',
      name: 'National Housing Fund',
      applicability: nhfApplicability,
      employeeRatePercent: 2.5,
      employerRatePercent: 0,
      base: 'basic',
      explanation:
        nhfApplicability === 'mandatory'
          ? 'Mandatory for employees earning above the minimum wage at organizations with 10 or more employees.'
          : 'Organizations with fewer than 10 employees may contribute voluntarily on behalf of staff.',
      legalReference: 'National Housing Fund Act 1992',
    },
    {
      id: 'nhia',
      name: 'Health Insurance (NHIA)',
      applicability: 'voluntary',
      employeeRatePercent: 0,
      employerRatePercent: 3,
      base: 'gross',
      explanation:
        'Configured as a voluntary employer-paid benefit for this organization. The contribution rate can be adjusted in payroll settings.',
      legalReference: 'National Health Insurance Authority Act 2022',
    },
    {
      id: 'nsitf',
      name: 'Employee Compensation (NSITF)',
      applicability: nsitfApplicability,
      employeeRatePercent: 0,
      employerRatePercent: 1,
      base: 'gross',
      explanation:
        nsitfApplicability === 'mandatory'
          ? 'Mandatory employer-only contribution for organizations with 5 or more employees, covering workplace injury and compensation.'
          : 'Not required for organizations with fewer than 5 employees.',
      legalReference: 'Employees Compensation Act 2010',
    },
    {
      id: 'itf',
      name: 'Industrial Training Fund',
      applicability: 'not_applicable',
      employeeRatePercent: 0,
      employerRatePercent: 1,
      base: 'gross',
      explanation:
        'Requires 5 or more employees and annual turnover of ₦50,000,000 or more. Your organization’s turnover profile hasn’t been configured yet, so ITF isn’t currently applied — configure it in payroll settings once available.',
      legalReference: 'Industrial Training Fund Act 2011',
    },
  ]
}
