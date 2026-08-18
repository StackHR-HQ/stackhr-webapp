import {
  CalendarBlankIcon,
  HandCoinsIcon,
  MoneyIcon,
  ReceiptIcon,
  ArrowUUpLeftIcon,
  type Icon,
} from '@phosphor-icons/react'
import type { BadgeTone } from '../../../components/ui/badge'
import type { ApprovalDomain, GlobalApprovalStatus } from '../types/approval-types'

export const APPROVAL_STATUS_META: Record<GlobalApprovalStatus, { label: string; tone: BadgeTone }> = {
  pending: { label: 'Pending', tone: 'warning' },
  approved: { label: 'Approved', tone: 'positive' },
  rejected: { label: 'Rejected', tone: 'critical' },
}

export const APPROVAL_DOMAIN_META: Record<ApprovalDomain, { label: string; icon: Icon }> = {
  leave: { label: 'Leave', icon: CalendarBlankIcon },
  expenses: { label: 'Expenses', icon: ReceiptIcon },
  reimbursements: { label: 'Reimbursements', icon: ArrowUUpLeftIcon },
  'salary-advances': { label: 'Salary Advances', icon: HandCoinsIcon },
  payroll: { label: 'Payroll', icon: MoneyIcon },
}
