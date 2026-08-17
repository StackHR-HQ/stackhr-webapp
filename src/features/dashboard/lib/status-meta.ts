import type { BadgeTone } from '../../../components/ui/badge'
import type { ComplianceAlertSeverity, PayrollRunStatus } from '../types/dashboard-types'

export const PAYROLL_STATUS_META: Record<PayrollRunStatus, { label: string; tone: BadgeTone }> = {
  draft: { label: 'Draft', tone: 'neutral' },
  processing: { label: 'Processing', tone: 'accent' },
  pending_approval: { label: 'Pending approval', tone: 'warning' },
  approved: { label: 'Approved', tone: 'accent' },
  completed: { label: 'Completed', tone: 'positive' },
  failed: { label: 'Failed', tone: 'critical' },
}

export const COMPLIANCE_SEVERITY_META: Record<ComplianceAlertSeverity, { label: string; tone: BadgeTone }> = {
  critical: { label: 'Critical', tone: 'critical' },
  warning: { label: 'Attention', tone: 'warning' },
  info: { label: 'Info', tone: 'neutral' },
}
