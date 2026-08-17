export type ProfileTabKey =
  | 'overview'
  | 'personal'
  | 'employment'
  | 'compensation'
  | 'leave'
  | 'documents'
  | 'payroll'
  | 'expenses'
  | 'salary-advances'
  | 'activity'

export const PROFILE_TABS: { key: ProfileTabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'personal', label: 'Personal information' },
  { key: 'employment', label: 'Employment' },
  { key: 'compensation', label: 'Compensation' },
  { key: 'leave', label: 'Leave' },
  { key: 'documents', label: 'Documents' },
  { key: 'payroll', label: 'Payroll' },
  { key: 'expenses', label: 'Expenses' },
  { key: 'salary-advances', label: 'Salary advances' },
  { key: 'activity', label: 'Activity' },
]
