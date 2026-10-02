import type { BadgeTone } from '../../../components/ui/badge'
import type { ComplianceAlertSeverity } from '../types/dashboard-types'

const PAYROLL_STATUS_META: Record<string, { label: string; tone: BadgeTone }> = {
  DRAFT: { label: 'Draft', tone: 'neutral' },
  CALCULATED: { label: 'Calculated', tone: 'accent' },
  PENDING_APPROVAL: { label: 'Pending approval', tone: 'warning' },
  APPROVED: { label: 'Approved', tone: 'accent' },
  FUNDING_CHECK_PASSED: { label: 'Funded', tone: 'accent' },
  EXECUTED: { label: 'Paid', tone: 'positive' },
  RECONCILED: { label: 'Reconciled', tone: 'positive' },
  FAILED: { label: 'Failed', tone: 'critical' },
}

export function payrollStatusMeta(status: string): { label: string; tone: BadgeTone } {
  const label = status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, ' ')
  return PAYROLL_STATUS_META[status] ?? { label, tone: 'neutral' }
}

export const COMPLIANCE_SEVERITY_META: Record<ComplianceAlertSeverity, { label: string; tone: BadgeTone }> = {
  critical: { label: 'Critical', tone: 'critical' },
  warning: { label: 'Attention', tone: 'warning' },
  info: { label: 'Info', tone: 'neutral' },
}
