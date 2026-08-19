import type { TaxRuleSetId } from '../../payroll/types/payroll-types'

export interface CompanyInformation {
  name: string
  industry: string
  companySize: string
  currency: string
  payrollFrequency: string
}

export interface BrandingSettings {
  logoDataUrl?: string
  primaryColor: string
  accentColor: string
}

export interface OrganizationAddress {
  line1: string
  line2: string
  city: string
  state: string
  country: string
  postalCode: string
}

export interface BusinessInformation {
  registrationNumber: string
  taxId: string
  businessType: string
  website: string
  foundedYear: string
}

export interface OrganizationSettings {
  companyInformation: CompanyInformation
  branding: BrandingSettings
  address: OrganizationAddress
  businessInformation: BusinessInformation
}

export type PensionCalculationBase = 'basic' | 'bht' | 'gross'

export interface ContributionPreference {
  contributionId: 'pension' | 'nhf' | 'nhia' | 'nsitf' | 'itf'
  enabled: boolean
  employeeRatePercentOverride: number | null
  employerRatePercentOverride: number | null
}

export interface SalaryComponentClassification {
  componentId: string
  taxable: boolean
  pensionable: boolean
}

export interface ComplianceProfile {
  country: string
  registeredEntityType: string
  applyMinimumWageExemption: boolean
  autoApplyLatestTaxRules: boolean
}

export interface PayrollSettings {
  activeTaxRuleSetId: TaxRuleSetId
  contributionPreferences: ContributionPreference[]
  pensionCalculationBase: PensionCalculationBase
  salaryComponentClassifications: SalaryComponentClassification[]
  complianceProfile: ComplianceProfile
}

export interface NotificationToggle {
  key: string
  label: string
  description: string
  enabled: boolean
}

export interface NotificationSettings {
  email: NotificationToggle[]
  inApp: NotificationToggle[]
  payroll: NotificationToggle[]
  approvals: NotificationToggle[]
}

export type NotificationChannel = keyof NotificationSettings
