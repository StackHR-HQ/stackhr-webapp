import type {
  BillingSettings,
  Integration,
  NotificationSettings,
  OrganizationSettings,
  PayrollSettings,
  SecuritySettings,
} from '../types/settings-types'

function daysFromNow(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

function daysAgo(days: number): string {
  return daysFromNow(-days)
}

export const DEFAULT_ORGANIZATION_SETTINGS: OrganizationSettings = {
  companyInformation: {
    name: 'Acme Nigeria Ltd.',
    industry: 'Technology',
    companySize: '11-50',
    currency: 'NGN',
    payrollFrequency: 'Monthly',
  },
  branding: {
    logoDataUrl: undefined,
    primaryColor: '#0066ff',
    accentColor: '#08060d',
  },
  address: {
    line1: '14 Admiralty Way',
    line2: 'Lekki Phase 1',
    city: 'Lagos',
    state: 'Lagos',
    country: 'Nigeria',
    postalCode: '106104',
  },
  businessInformation: {
    registrationNumber: 'RC 1234567',
    taxId: 'TIN 12345678-0001',
    businessType: 'Private Limited Company',
    website: 'https://acme.example',
    foundedYear: '2019',
  },
}

export const DEFAULT_PAYROLL_SETTINGS: PayrollSettings = {
  activeTaxRuleSetId: 'NG-2026-v1',
  contributionPreferences: [
    { contributionId: 'pension', enabled: true, employeeRatePercentOverride: null, employerRatePercentOverride: null },
    { contributionId: 'nhf', enabled: true, employeeRatePercentOverride: null, employerRatePercentOverride: null },
    { contributionId: 'nhia', enabled: false, employeeRatePercentOverride: null, employerRatePercentOverride: null },
    { contributionId: 'nsitf', enabled: true, employeeRatePercentOverride: null, employerRatePercentOverride: null },
    { contributionId: 'itf', enabled: false, employeeRatePercentOverride: null, employerRatePercentOverride: null },
  ],
  pensionCalculationBase: 'bht',
  salaryComponentClassifications: [
    { componentId: 'basic', taxable: true, pensionable: true },
    { componentId: 'housing', taxable: true, pensionable: true },
    { componentId: 'transport', taxable: true, pensionable: true },
    { componentId: 'other', taxable: true, pensionable: false },
  ],
  complianceProfile: {
    country: 'Nigeria',
    registeredEntityType: 'Private Limited Company',
    applyMinimumWageExemption: true,
    autoApplyLatestTaxRules: true,
  },
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  email: [
    {
      key: 'payroll-processed',
      label: 'Payroll processed',
      description: 'Get an email summary whenever a payroll run is completed.',
      enabled: true,
    },
    {
      key: 'compliance-deadlines',
      label: 'Compliance deadlines',
      description: 'Reminders ahead of statutory filing and remittance deadlines.',
      enabled: true,
    },
    {
      key: 'weekly-digest',
      label: 'Weekly digest',
      description: 'A weekly summary of approvals, headcount changes, and spend activity.',
      enabled: false,
    },
    {
      key: 'product-updates',
      label: 'Product updates',
      description: 'Occasional emails about new StackHR features and improvements.',
      enabled: false,
    },
  ],
  inApp: [
    {
      key: 'approval-requests',
      label: 'Approval requests',
      description: 'Show a notification when something needs your approval.',
      enabled: true,
    },
    {
      key: 'system-alerts',
      label: 'System alerts',
      description: 'Alerts about failed jobs, integration issues, or account problems.',
      enabled: true,
    },
    {
      key: 'mentions',
      label: 'Mentions & comments',
      description: 'When a teammate mentions you or comments on a record you follow.',
      enabled: true,
    },
  ],
  payroll: [
    {
      key: 'before-run-reminder',
      label: 'Upcoming payroll run reminder',
      description: 'Notify the payroll admin a few days before the next run is due.',
      enabled: true,
    },
    {
      key: 'run-completed',
      label: 'Payroll run completed',
      description: 'Notify admins and managers once a payroll run finishes processing.',
      enabled: true,
    },
    {
      key: 'run-failed',
      label: 'Payroll run failed',
      description: 'Immediately notify the payroll admin if a run fails to process.',
      enabled: true,
    },
    {
      key: 'compliance-warnings',
      label: 'Compliance warnings on a run',
      description: 'Notify when a payroll run has open compliance warnings.',
      enabled: true,
    },
  ],
  approvals: [
    {
      key: 'new-request',
      label: 'New approval request',
      description: 'Notify approvers when a new request is waiting on them.',
      enabled: true,
    },
    {
      key: 'request-approved',
      label: 'Request approved',
      description: 'Notify the requester when their request is approved.',
      enabled: true,
    },
    {
      key: 'request-rejected',
      label: 'Request rejected',
      description: 'Notify the requester when their request is rejected.',
      enabled: true,
    },
    {
      key: 'escalation',
      label: 'Approval escalation',
      description: 'Notify a manager when a request has been pending too long and escalates.',
      enabled: false,
    },
  ],
}

export const DEFAULT_BILLING_SETTINGS: BillingSettings = {
  currentPlan: {
    id: 'growth',
    name: 'Growth',
    priceLabel: '₦15,000 / seat / month',
    billingCycle: 'monthly',
    seatsIncluded: 25,
    features: [
      'Unlimited payroll runs',
      'Statutory compliance engine',
      'Spend management & approvals',
      'Priority email support',
    ],
  },
  subscription: {
    status: 'trial',
    currentPeriodStart: daysAgo(8),
    currentPeriodEnd: daysFromNow(6),
    seatsUsed: 15,
    seatsLimit: 25,
    autoRenew: true,
    trialEndsAt: daysFromNow(6),
  },
  paymentMethod: {
    cardholderName: 'Demo Admin',
    brand: 'Visa',
    last4: '4242',
    expiryMonth: 11,
    expiryYear: 2028,
  },
  billingHistory: [
    { id: 'txn-1', date: daysAgo(38), description: 'Growth plan — monthly subscription', amount: 225_000, currency: 'NGN', status: 'paid' },
    { id: 'txn-2', date: daysAgo(68), description: 'Growth plan — monthly subscription', amount: 210_000, currency: 'NGN', status: 'paid' },
    { id: 'txn-3', date: daysAgo(98), description: 'Growth plan — monthly subscription', amount: 210_000, currency: 'NGN', status: 'failed' },
  ],
  invoices: [
    { id: 'inv-1', number: 'INV-2026-0142', issuedDate: daysAgo(8), dueDate: daysFromNow(6), amount: 225_000, currency: 'NGN', status: 'unpaid' },
    { id: 'inv-2', number: 'INV-2026-0098', issuedDate: daysAgo(38), dueDate: daysAgo(24), amount: 225_000, currency: 'NGN', status: 'paid' },
    { id: 'inv-3', number: 'INV-2025-0231', issuedDate: daysAgo(68), dueDate: daysAgo(54), amount: 210_000, currency: 'NGN', status: 'paid' },
  ],
}

export const DEFAULT_SECURITY_SETTINGS: SecuritySettings = {
  authentication: {
    twoFactorEnabled: false,
    twoFactorMethod: null,
    ssoEnabled: false,
    ssoProvider: '',
  },
  sessions: [
    {
      id: 'session-1',
      device: 'MacBook Pro',
      browser: 'Chrome on macOS',
      location: 'Lagos, Nigeria',
      ipAddress: '105.112.24.6',
      lastActiveAt: daysAgo(0),
      current: true,
    },
    {
      id: 'session-2',
      device: 'iPhone 15',
      browser: 'Safari on iOS',
      location: 'Lagos, Nigeria',
      ipAddress: '105.112.24.19',
      lastActiveAt: daysAgo(2),
      current: false,
    },
    {
      id: 'session-3',
      device: 'Windows PC',
      browser: 'Edge on Windows',
      location: 'Abuja, Nigeria',
      ipAddress: '197.211.53.101',
      lastActiveAt: daysAgo(9),
      current: false,
    },
  ],
  activity: [
    { id: 'act-1', event: 'Signed in', description: 'Successful sign-in from a recognized device.', ipAddress: '105.112.24.6', device: 'Chrome on macOS', timestamp: daysAgo(0), status: 'success' },
    { id: 'act-2', event: 'Password changed', description: 'Account password was updated.', ipAddress: '105.112.24.6', device: 'Chrome on macOS', timestamp: daysAgo(12), status: 'success' },
    { id: 'act-3', event: 'Failed sign-in attempt', description: 'Incorrect password entered.', ipAddress: '41.58.12.203', device: 'Unknown device', timestamp: daysAgo(15), status: 'failed' },
    { id: 'act-4', event: 'New session', description: 'Signed in from a new device.', ipAddress: '105.112.24.19', device: 'Safari on iOS', timestamp: daysAgo(20), status: 'success' },
  ],
}

export const DEFAULT_INTEGRATIONS: Integration[] = [
  {
    id: 'anchor',
    name: 'Anchor',
    category: 'payment',
    description: 'Send NGN salary and vendor payments directly from StackHR.',
    status: 'connected',
    connectedAccount: 'Acme Inc. — Operating Account',
  },
  {
    id: 'paystack',
    name: 'Paystack',
    category: 'payment',
    description: 'Accept and reconcile inbound payments and reimbursement top-ups.',
    status: 'not_connected',
  },
  {
    id: 'sendbyte',
    name: 'Sendbyte',
    category: 'email',
    description: 'Transactional email for payslips, approvals, and notifications.',
    status: 'connected',
    connectedAccount: 'notifications@acme.example',
  },
  {
    id: 'google-workspace',
    name: 'Google Workspace',
    category: 'email',
    description: 'Sync employee directory and calendars with Google Workspace.',
    status: 'not_connected',
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    category: 'accounting',
    description: 'Sync payroll journal entries and expense claims to QuickBooks.',
    status: 'not_connected',
  },
  {
    id: 'xero',
    name: 'Xero',
    category: 'accounting',
    description: 'Sync payroll journal entries and expense claims to Xero.',
    status: 'not_connected',
  },
  {
    id: 'gtbank',
    name: 'GTBank Business',
    category: 'banking',
    description: 'Connect a business bank account for payroll funding and reconciliation.',
    status: 'connected',
    connectedAccount: 'GTBank •••• 4821',
  },
  {
    id: 'access-bank',
    name: 'Access Bank',
    category: 'banking',
    description: 'Connect a business bank account for payroll funding and reconciliation.',
    status: 'not_connected',
  },
]
