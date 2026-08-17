export type OrganizationTabKey = 'departments' | 'teams' | 'reporting' | 'org-chart'

export const ORGANIZATION_TABS: { key: OrganizationTabKey; label: string }[] = [
  { key: 'departments', label: 'Departments' },
  { key: 'teams', label: 'Teams' },
  { key: 'reporting', label: 'Reporting structure' },
  { key: 'org-chart', label: 'Org chart' },
]
