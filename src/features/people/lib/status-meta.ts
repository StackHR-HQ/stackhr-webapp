import type { BadgeTone } from '../../../components/ui/badge'
import type { EmploymentStatus } from '../types/people-types'

export const EMPLOYMENT_STATUS_META: Record<EmploymentStatus, { label: string; tone: BadgeTone }> = {
  active: { label: 'Active', tone: 'positive' },
  pending_invitation: { label: 'Pending invitation', tone: 'warning' },
  onboarding: { label: 'Onboarding', tone: 'accent' },
  offboarding: { label: 'Offboarding', tone: 'critical' },
}

export const REQUEST_STATUS_META: Record<string, { label: string; tone: BadgeTone }> = {
  pending: { label: 'Pending', tone: 'warning' },
  approved: { label: 'Approved', tone: 'positive' },
  rejected: { label: 'Rejected', tone: 'critical' },
  repaid: { label: 'Repaid', tone: 'neutral' },
  paid: { label: 'Paid', tone: 'positive' },
  processing: { label: 'Processing', tone: 'accent' },
}
