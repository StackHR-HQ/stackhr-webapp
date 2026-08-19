import type { ModulePermission, RoleDefinition } from '../types/team-access-types'

// The permission matrix — the single source of truth for what each role can
// do. 'full' = every record, 'team' = records for people who report up to
// you, 'own' = your own records only, 'none' = no access.
export const RBAC_MATRIX: ModulePermission[] = [
  {
    module: 'people',
    label: 'People',
    description: 'Employee profiles, leave, documents, onboarding, and org structure.',
    admin: 'full',
    manager: 'team',
    employee: 'own',
  },
  {
    module: 'payroll',
    label: 'Payroll',
    description: 'Payroll runs, salaries, payslips, and salary advances.',
    admin: 'full',
    manager: 'team',
    employee: 'own',
  },
  {
    module: 'spend',
    label: 'Spend',
    description: 'Expense claims, reimbursements, and spend approvals.',
    admin: 'full',
    manager: 'team',
    employee: 'own',
  },
  {
    module: 'compliance',
    label: 'Compliance',
    description: 'Tax filings, statutory contributions, and remittances.',
    admin: 'full',
    manager: 'none',
    employee: 'none',
  },
  {
    module: 'reports',
    label: 'Reports',
    description: 'Cross-functional reporting across People, Payroll, and Spend.',
    admin: 'full',
    manager: 'team',
    employee: 'none',
  },
  {
    module: 'approvals',
    label: 'Approvals',
    description: 'The approval queue for leave, expenses, and salary advances.',
    admin: 'full',
    manager: 'team',
    employee: 'none',
  },
  {
    module: 'settings',
    label: 'Settings',
    description: 'Organization, payroll, and team & access configuration.',
    admin: 'full',
    manager: 'none',
    employee: 'none',
  },
]

export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    role: 'admin',
    label: 'Admin',
    description: 'Full access to every module — the only role that can change payroll settings or team access.',
    summary: [
      'Manage every employee, payroll run, and spend record',
      'Configure payroll, compliance, and org-wide settings',
      'Invite team members and change roles',
    ],
  },
  {
    role: 'manager',
    label: 'Manager',
    description: 'Scoped to their own team — sees and approves records for the people who report up to them.',
    summary: [
      "View and edit their team's People and Payroll records",
      "Approve their team's leave, expense, and advance requests",
      'No access to compliance or settings',
    ],
  },
  {
    role: 'employee',
    label: 'Employee',
    description: 'Scoped to their own records. Self-service access is planned but not live yet.',
    summary: [
      'View their own profile, leave balance, and payslips once self-service ships',
      'Submit their own leave, expense, and advance requests',
      'No visibility into other employees’ records',
    ],
  },
]
