export interface NavLeaf {
  label: string
  path: string
}

export interface NavSection {
  label: string
  path?: string
  items?: NavLeaf[]
}

// Mirrors sidebar.md — the single source of truth for the dashboard nav tree.
export const SIDEBAR_NAV: NavSection[] = [
  { label: 'Dashboard', path: '/' },
  {
    label: 'People',
    items: [
      { label: 'Employees', path: '/people/employees' },
      { label: 'Leave', path: '/people/leave' },
      { label: 'Documents', path: '/people/documents' },
      { label: 'Organization', path: '/people/organization' },
      { label: 'Onboarding', path: '/people/onboarding' },
    ],
  },
  {
    label: 'Payroll',
    items: [
      { label: 'Overview', path: '/payroll/overview' },
      { label: 'Payroll Runs', path: '/payroll/runs' },
      { label: 'Salaries', path: '/payroll/salaries' },
      { label: 'Payslips', path: '/payroll/payslips' },
      { label: 'Salary Advances', path: '/payroll/salary-advances' },
    ],
  },
  {
    label: 'Spend',
    items: [
      { label: 'Expenses', path: '/spend/expenses' },
      { label: 'Reimbursements', path: '/spend/reimbursements' },
      { label: 'Approvals', path: '/spend/approvals' },
    ],
  },
  {
    label: 'Compliance',
    items: [
      { label: 'Tax', path: '/compliance/tax' },
      { label: 'Statutory', path: '/compliance/statutory' },
      { label: 'Remittances', path: '/compliance/remittances' },
    ],
  },
  { label: 'Approvals', path: '/approvals' },
  { label: 'Reports', path: '/reports' },
  {
    label: 'Settings',
    items: [
      { label: 'Organization', path: '/settings/organization' },
      { label: 'Payroll', path: '/settings/payroll' },
      { label: 'Team & Access', path: '/settings/team-access' },
      { label: 'Notifications', path: '/settings/notifications' },
      { label: 'Billing', path: '/settings/billing' },
      { label: 'Security', path: '/settings/security' },
      { label: 'Integrations', path: '/settings/integrations' },
    ],
  },
]
