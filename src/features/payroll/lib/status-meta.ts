import type { BadgeTone } from '../../../components/ui/badge'
import type {
  PayrollRunStage,
  PayrollRunStatus,
  SalaryAdvanceStatusEntry,
  StatutoryApplicability,
} from '../types/payroll-types'

export const PAYROLL_RUN_STATUS_META: Record<PayrollRunStatus, { label: string; tone: BadgeTone }> = {
  draft: { label: 'Draft', tone: 'neutral' },
  processing: { label: 'Processing', tone: 'accent' },
  pending_approval: { label: 'Pending approval', tone: 'warning' },
  approved: { label: 'Approved', tone: 'accent' },
  completed: { label: 'Completed', tone: 'positive' },
  failed: { label: 'Failed', tone: 'critical' },
}

// Stages that PAYROLL_RUN_STATUS_META's grouping would mislabel on a run's own page.
export const PAYROLL_RUN_STAGE_META: Partial<Record<PayrollRunStage, { label: string; tone: BadgeTone }>> = {
  CALCULATED: { label: 'Calculated', tone: 'neutral' },
  REJECTED: { label: 'Rejected', tone: 'critical' },
  FUNDING_CHECK_PASSED: { label: 'Funding confirmed', tone: 'accent' },
  FUNDING_SHORTFALL: { label: 'Funding shortfall', tone: 'critical' },
  EXECUTED: { label: 'Paid', tone: 'accent' },
}

export const APPLICABILITY_META: Record<StatutoryApplicability, { label: string; tone: BadgeTone }> = {
  mandatory: { label: 'Mandatory', tone: 'critical' },
  voluntary: { label: 'Voluntary', tone: 'warning' },
  not_applicable: { label: 'Not applicable', tone: 'neutral' },
}

export const ADVANCE_STATUS_META: Record<SalaryAdvanceStatusEntry['status'], { label: string; tone: BadgeTone }> = {
  pending: { label: 'Pending', tone: 'warning' },
  approved: { label: 'Approved', tone: 'accent' },
  rejected: { label: 'Rejected', tone: 'critical' },
  disbursed: { label: 'Disbursed', tone: 'positive' },
  repaid: { label: 'Repaid', tone: 'neutral' },
  cancelled: { label: 'Cancelled', tone: 'neutral' },
}
