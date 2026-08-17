import type { BadgeTone } from '../../../components/ui/badge'
import type { PayrollRunStatus, StatutoryApplicability } from '../types/payroll-types'

export const PAYROLL_RUN_STATUS_META: Record<PayrollRunStatus, { label: string; tone: BadgeTone }> = {
  draft: { label: 'Draft', tone: 'neutral' },
  processing: { label: 'Processing', tone: 'accent' },
  pending_approval: { label: 'Pending approval', tone: 'warning' },
  approved: { label: 'Approved', tone: 'accent' },
  completed: { label: 'Completed', tone: 'positive' },
  failed: { label: 'Failed', tone: 'critical' },
}

export const APPLICABILITY_META: Record<StatutoryApplicability, { label: string; tone: BadgeTone }> = {
  mandatory: { label: 'Mandatory', tone: 'critical' },
  voluntary: { label: 'Voluntary', tone: 'warning' },
  not_applicable: { label: 'Not applicable', tone: 'neutral' },
}
