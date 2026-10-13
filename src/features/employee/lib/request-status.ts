import type { BadgeTone } from '../../../components/ui/badge'
import { toApiEnum } from '../../../lib/api-enum'
import { humanizeEnum } from './profile-format'

const STATUS_META: Record<string, { label: string; tone: BadgeTone }> = {
  PENDING: { label: 'Pending', tone: 'warning' },
  SUBMITTED: { label: 'Pending', tone: 'warning' },
  APPROVED: { label: 'Approved', tone: 'positive' },
  REJECTED: { label: 'Declined', tone: 'critical' },
  CANCELLED: { label: 'Cancelled', tone: 'neutral' },
  PAID: { label: 'Paid', tone: 'positive' },
  REIMBURSED: { label: 'Reimbursed', tone: 'positive' },
  DISBURSED: { label: 'Disbursed', tone: 'accent' },
  REPAYING: { label: 'Repaying', tone: 'accent' },
  REPAID: { label: 'Repaid', tone: 'neutral' },
}

export function requestStatusMeta(status: string): { label: string; tone: BadgeTone } {
  const key = toApiEnum(status)
  return STATUS_META[key] ?? { label: humanizeEnum(key).replace(/-/g, ' '), tone: 'neutral' }
}
