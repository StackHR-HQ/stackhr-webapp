import type { FC } from 'react'
import {
  ApprovalsIcon,
  ComplianceIcon,
  DashboardIcon,
  type IconProps,
  PayrollIcon,
  PeopleIcon,
  ReportsIcon,
  SettingsIcon,
  SpendIcon,
} from './nav-icons'
import type { NavIconName } from './sidebar-nav-data'

export const NAV_ICONS: Record<NavIconName, FC<IconProps>> = {
  dashboard: DashboardIcon,
  people: PeopleIcon,
  payroll: PayrollIcon,
  spend: SpendIcon,
  compliance: ComplianceIcon,
  approvals: ApprovalsIcon,
  reports: ReportsIcon,
  settings: SettingsIcon,
}
