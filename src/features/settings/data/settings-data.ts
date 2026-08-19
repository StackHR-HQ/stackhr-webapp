import type { NotificationSettings, OrganizationSettings, PayrollSettings } from '../types/settings-types'

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
