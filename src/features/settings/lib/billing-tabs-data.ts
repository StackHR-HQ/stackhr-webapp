export type BillingSettingsTabKey = 'current-plan' | 'subscription' | 'payment-method' | 'billing-history' | 'invoices' | 'trial-status'

export const BILLING_SETTINGS_TABS: { key: BillingSettingsTabKey; label: string }[] = [
  { key: 'current-plan', label: 'Current Plan' },
  { key: 'subscription', label: 'Subscription' },
  { key: 'payment-method', label: 'Payment Method' },
  { key: 'billing-history', label: 'Billing History' },
  { key: 'invoices', label: 'Invoices' },
  { key: 'trial-status', label: 'Trial Status' },
]
