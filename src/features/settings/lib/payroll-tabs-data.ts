export type PayrollSettingsTabKey =
  | 'tax-rules'
  | 'statutory-contributions'
  | 'contribution-preferences'
  | 'pension-calculation-base'
  | 'salary-component-classification'
  | 'compliance-profile'

export const PAYROLL_SETTINGS_TABS: { key: PayrollSettingsTabKey; label: string }[] = [
  { key: 'tax-rules', label: 'Tax Rules' },
  { key: 'statutory-contributions', label: 'Statutory Contributions' },
  { key: 'contribution-preferences', label: 'Contribution Preferences' },
  { key: 'pension-calculation-base', label: 'Pension Calculation Base' },
  { key: 'salary-component-classification', label: 'Salary Component Classification' },
  { key: 'compliance-profile', label: 'Compliance Profile' },
]
