import {
  ChartBarIcon,
  CheckCircleIcon,
  CreditCardIcon,
  GearIcon,
  MoneyIcon,
  ShieldCheckIcon,
  SquaresFourIcon,
  UsersIcon,
  type Icon,
} from '@phosphor-icons/react'
import type { NavIconName } from './sidebar-nav-data'

export const NAV_ICONS: Record<NavIconName, Icon> = {
  dashboard: SquaresFourIcon,
  people: UsersIcon,
  payroll: MoneyIcon,
  spend: CreditCardIcon,
  compliance: ShieldCheckIcon,
  approvals: CheckCircleIcon,
  reports: ChartBarIcon,
  settings: GearIcon,
}
