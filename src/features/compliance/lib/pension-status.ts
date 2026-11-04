import type { BadgeTone } from '../../../components/ui/badge'
import { getApiErrorMessage } from '../../../lib/http'

const SCHEDULE_STATUS: Record<string, { label: string; tone: BadgeTone }> = {
  DRAFT: { label: 'Draft', tone: 'neutral' },
  VALIDATING: { label: 'Validating', tone: 'accent' },
  VALIDATED: { label: 'Validated', tone: 'accent' },
  VALIDATION_FAILED: { label: 'Validation failed', tone: 'critical' },
  SUBMITTED: { label: 'Submitted', tone: 'accent' },
  PAYMENT_PENDING: { label: 'Awaiting payment', tone: 'warning' },
  PAID: { label: 'Paid', tone: 'positive' },
  DISBURSED: { label: 'Settled with PFAs', tone: 'positive' },
  CANCELLED: { label: 'Cancelled', tone: 'neutral' },
}

export function scheduleStatusMeta(status: string): { label: string; tone: BadgeTone } {
  return (
    SCHEDULE_STATUS[status] ?? {
      label: status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, ' '),
      tone: 'neutral',
    }
  )
}

// Profile fields the backend reports as missing, in words.
const MISSING_FIELD: Record<string, string> = {
  pensionRsaNumber: 'RSA PIN',
  pfaCode: 'PFA',
}

export const missingFieldLabel = (field: string) => MISSING_FIELD[field] ?? field

// PenCentral's 401 for missing partner credentials is a setup problem on our
// side, not something the customer can fix; say so plainly.
export function pensionErrorMessage(error: unknown): string {
  const message = getApiErrorMessage(error)
  return /partner credential/i.test(message)
    ? "StackHR can't reach PenCentral right now. Please try again later, or contact support if this keeps happening."
    : message
}
