import type { AuthUser } from '../../auth/types/auth-types'

export type NavIconName =
  | 'dashboard'
  | 'people'
  | 'payroll'
  | 'spend'
  | 'compliance'
  | 'approvals'
  | 'reports'
  | 'settings'
  | 'profile'
  | 'leave'
  | 'payslips'
  | 'expenses'
  | 'reimbursements'
  | 'salaryAdvance'
  | 'documents'
  | 'notifications'

export interface NavLeaf {
  label: string
  path: string
}

export interface NavSection {
  label: string
  icon: NavIconName
  path?: string
  items?: NavLeaf[]
}

// Mirrors sidebar.md — the single source of truth for the dashboard nav tree.
// Admins and managers share one nav tree for now; the spec doesn't call out
// manager-specific restrictions yet, so this covers both roles.
export const ADMIN_SIDEBAR_NAV: NavSection[] = [
  { label: 'Dashboard', icon: 'dashboard', path: '/' },
  {
    label: 'People',
    icon: 'people',
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
    icon: 'payroll',
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
    icon: 'spend',
    items: [
      { label: 'Expenses', path: '/spend/expenses' },
      { label: 'Reimbursements', path: '/spend/reimbursements' },
      { label: 'Approvals', path: '/spend/approvals' },
    ],
  },
  {
    label: 'Compliance',
    icon: 'compliance',
    items: [
      { label: 'Overview', path: '/compliance' },
      { label: 'Tax', path: '/compliance/tax' },
      { label: 'Statutory', path: '/compliance/statutory' },
      { label: 'Remittances', path: '/compliance/remittances' },
    ],
  },
  { label: 'Approvals', icon: 'approvals', path: '/approvals' },
  { label: 'Reports', icon: 'reports', path: '/reports' },
  {
    label: 'Settings',
    icon: 'settings',
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

// The self-service nav for the 'employee' role — flat, personal-scope pages
// rather than the org-wide sections admins and managers see.
export const EMPLOYEE_SIDEBAR_NAV: NavSection[] = [
  { label: 'Dashboard', icon: 'dashboard', path: '/' },
  { label: 'My Profile', icon: 'profile', path: '/me/profile' },
  { label: 'My Leave', icon: 'leave', path: '/me/leave' },
  { label: 'My Payslips', icon: 'payslips', path: '/me/payslips' },
  { label: 'My Expenses', icon: 'expenses', path: '/me/expenses' },
  { label: 'My Reimbursements', icon: 'reimbursements', path: '/me/reimbursements' },
  { label: 'My Salary Advance', icon: 'salaryAdvance', path: '/me/salary-advance' },
  { label: 'Documents', icon: 'documents', path: '/me/documents' },
  { label: 'Approvals', icon: 'approvals', path: '/approvals' },
  { label: 'Notifications', icon: 'notifications', path: '/me/notifications' },
  { label: 'Settings', icon: 'settings', path: '/me/settings' },
]

export function getSidebarNav(role: AuthUser['role'] | undefined): NavSection[] {
  return role === 'employee' ? EMPLOYEE_SIDEBAR_NAV : ADMIN_SIDEBAR_NAV
}
