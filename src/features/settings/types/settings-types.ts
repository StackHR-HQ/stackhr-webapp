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

export type SubscriptionPlanStatus = 'trial' | 'active' | 'past_due' | 'canceled'

export interface CurrentPlan {
  id: string
  name: string
  priceLabel: string
  billingCycle: 'monthly' | 'annual'
  seatsIncluded: number
  features: string[]
}

export interface Subscription {
  status: SubscriptionPlanStatus
  currentPeriodStart: string
  currentPeriodEnd: string
  seatsUsed: number
  seatsLimit: number
  autoRenew: boolean
  trialEndsAt?: string
}

export interface PaymentMethod {
  cardholderName: string
  brand: string
  last4: string
  expiryMonth: number
  expiryYear: number
}

export type BillingTransactionStatus = 'paid' | 'failed' | 'pending'

export interface BillingHistoryEntry {
  id: string
  date: string
  description: string
  amount: number
  currency: string
  status: BillingTransactionStatus
}

export type InvoiceStatus = 'paid' | 'unpaid' | 'overdue'

export interface Invoice {
  id: string
  number: string
  issuedDate: string
  dueDate: string
  amount: number
  currency: string
  status: InvoiceStatus
}

export interface BillingSettings {
  currentPlan: CurrentPlan
  subscription: Subscription
  paymentMethod: PaymentMethod
  billingHistory: BillingHistoryEntry[]
  invoices: Invoice[]
}

export type TwoFactorMethod = 'authenticator_app' | 'sms'

export interface AuthenticationSettings {
  twoFactorEnabled: boolean
  twoFactorMethod: TwoFactorMethod | null
  ssoEnabled: boolean
  ssoProvider: string
}

export interface SessionInfo {
  id: string
  device: string
  browser: string
  location: string
  ipAddress: string
  lastActiveAt: string
  current: boolean
}

export type SecurityEventStatus = 'success' | 'failed'

export interface SecurityActivityEntry {
  id: string
  event: string
  description: string
  ipAddress: string
  device: string
  timestamp: string
  status: SecurityEventStatus
}

export interface SecuritySettings {
  authentication: AuthenticationSettings
  sessions: SessionInfo[]
  activity: SecurityActivityEntry[]
}

export type IntegrationCategory = 'payment' | 'email' | 'accounting' | 'banking'

export type IntegrationStatus = 'connected' | 'not_connected'

export interface Integration {
  id: string
  name: string
  category: IntegrationCategory
  description: string
  status: IntegrationStatus
  connectedAccount?: string
}
