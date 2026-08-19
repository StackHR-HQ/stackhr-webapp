import type { IntegrationCategory } from '../types/settings-types'

export type IntegrationsTabKey = IntegrationCategory | 'other'

export const INTEGRATIONS_TABS: { key: IntegrationsTabKey; label: string }[] = [
  { key: 'payment', label: 'Payment' },
  { key: 'email', label: 'Email' },
  { key: 'accounting', label: 'Accounting' },
  { key: 'banking', label: 'Banking' },
  { key: 'other', label: 'Other Integrations' },
]
