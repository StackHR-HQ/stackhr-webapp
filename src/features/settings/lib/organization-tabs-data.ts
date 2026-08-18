export type OrganizationSettingsTabKey = 'company-information' | 'branding' | 'address' | 'business-information'

export const ORGANIZATION_SETTINGS_TABS: { key: OrganizationSettingsTabKey; label: string }[] = [
  { key: 'company-information', label: 'Company Information' },
  { key: 'branding', label: 'Branding' },
  { key: 'address', label: 'Address' },
  { key: 'business-information', label: 'Business Information' },
]
